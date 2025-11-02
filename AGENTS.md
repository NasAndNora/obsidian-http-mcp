# AGENTS.md - Guide d'utilisation des agents

ELITE CODE AI

**Production-grade**: Secure, maintainable, zero redundancy  
**For**: CLI/Terminal/IDE AI | **Stack**: Adaptable (JS/TS/Python default) | **Team** : User + AIs

---

## SESSION WORKFLOW

### Context Load (30s)

```bash
cat package.json pyproject.toml README.md .cursorrules 2>/dev/null | head -30
rg "class|interface|schema" -g "*types*" --max-count 3
rg "TODO|FIXME" --type ts py | head -5
```

---

## BEFORE ANY CODE

### 1. Search Existing

```bash
rg "def targetName|function targetName"
rg "keyword1.*keyword2" -A 2
rg "validate|schema" -g "*validation*"
```

### 2. Decision Tree

```text
exact_match → STOP + "Use existing_function()?"
similar     → Extend OR create (explain why)
none        → Check stdlib → Create
```

Modifying?
├─ usage > 5      → STOP + "Breaking change OK?"
├─ no_tests+crit  → STOP + "Write test first?"
└─ go ahead

---

## SECURITY

```text
NEVER: hardcode_secrets | string_sql | silent_failures | client_auth | expose_stacks
ALWAYS: validate_entry | parameterized_queries | typed_errors | structured_logs
```

**Format**: `API_KEY=sk_...` | `DATABASE_URL=postgresql://...` | `JWT_SECRET=...`
**PII Protection**: Never log: passwords, tokens, emails, phone, health data  
**Sensitive domains**: Health, finance, identity → Extra validation + audit logs  
**Input**: Validate at boundary (Zod/Pydantic)  
**Queries**: `cursor.execute("?", (val,))` | `db.query($1, [val])`  
**Errors**: Domain classes with `code` field  
**Logs**: Structured JSON, no PII

```python
class PaymentError(Exception):
    def __init__(self, code: str, msg: str):
        self.code = code
        super().__init__(msg)

logger.error('Payment failed', {'request_id': rid, 'user_id': uid, 'code': e.code})
```

---

## BUG FIXING (ROOT CAUSE)

### Triage

```bash
# Reproduce (unreliable = race) → Trace backwards
rg "error_keyword" -A 5 -B 5
rg "except|catch.*error" -A 3

# 3. Categorize
[ ] Validation missing at entry
[ ] Race condition
[ ] Implicit assumption
[ ] Contract broken
[ ] State inconsistency

# 4. Fix strategy
validation   → Add at boundary
race         → Atomic op
assumption   → Guard clause
contract     → Version/adapter
state        → Transaction
```

### Prevent Class

```bash
rg "similar_pattern" -g "!*test*"
# IF 2+ → Lint rule + type guard + test matrix
```

---

## CODE QUALITY

### Naming

```text
GOOD: unpaid_invoices_from_last_month | can_user_edit
BAD:  data | result | temp | handler | utils
```

### Structure

```text
AVOID: god_functions (>50 lines) | deep_nesting (>3 levels) | 
       property_chains (3+ dots) | magic_values | silent_failures
```

### Early Returns

```python
if not user:
    return None
if not user.subscription:
    return None
return user.subscription.plan.price
```

### Encapsulation (Max 2 Dots)

```text
GOOD: user.get_price()
BAD:  user.account.subscription.plan.price
```

### Single Responsibility

Search existing → IF 2+ places: Refactor FIRST (ask user's Validation)

---

## FILE ORGANIZATION

- **Feature-based**: `/features/auth/` not `/controllers/`
- **API contracts**: Version endpoints (`/v1/chat`), consistent naming
- **Types shared**: Export for frontend (`types/api.ts`)
- **Colocation**: Component + test + styles together
- **Max 3 levels**: `features/auth/components/LoginForm.tsx`
- **Specific names**: `user_service.py` not `service.py`

**Structure by project type:**

```text
# App/Site
/features/{domain}/        # auth, payment, profile
/shared/                   # utils, types, components

# Agent/AI
/agents/{name}/            # Per-agent code
/tools/                    # Shared tools
/prompts/                  # Prompt templates

# Script/Automation
/scripts/{purpose}/        # data_sync, report_gen
/lib/                      # Shared functions
```

---

## ADAPTIVE COMPLEXITY

**START**: Simplest solution that works

**ESCALATE ONLY IF:**

- N+1 queries: Use joinedload/eager loading
- Pagination: Always .limit(100), never .all()
- Caching: Data fetched 3+ times + profiled bottleneck
- State manager: Prop drilling >3 levels + complex shared state
- Queue: Operations >100/sec + order matters
- Advanced patterns: Measurable problem exists NOW

**NEVER**: "Future flexibility" | "Looks enterprise"  
**ALWAYS**: "Using X because Y problem exists NOW"

---

## OBSERVABILITY

**Request tracing**: Pass `request_id` through all operations  
**Structured logs**: JSON with context (no PII)  
**Monitoring**: Sentry (errors), Langfuse (LLM), Posthog (events)  
**LLM tracing**: Log prompt, model, tokens, latency

```python
# GOOD
logger.error('Payment failed', {
    'request_id': req_id,
    'user_id': uid,
    'amount': amount,
    'error_code': e.code
})

# BAD
print(f"Error: {e}")  # Can't grep, no context
```

**Targets**: SSE streaming | API <200ms | LLM first token <2s

---

## TESTING

**Critical paths**: Auth, payments, data integrity  
**If modifying + no test**: Write test FIRST + ASK user

```python
def test_concurrent_payment():
    # Two threads charge same account → One succeeds
```

---

## COMMENTS & TODOS

### Comments (WHY not WHAT) (ASCII ok, NO emoji)

```python
# --- Authentication Layer ---
# Verify expiry before DB (prevents stale session attack)
if token.expired_at < now():
    raise AuthError('expired')
```

### TODO Format

```python
# TODO: [Action] | Priority: [H/M/L] | Reason: [Why not now]
# TODO: Add retry logic | Priority: H | Reason: Race condition in prod
# TODO: Cache results | Priority: L | Reason: Only 10 users currently
```

---

## PRAGMATIC TRADE-OFFS

**Priority**: Security > Data Integrity > Correctness > Performance > Quality

**Legacy with type issues:**

```python
# ACCEPTABLE: Runtime validation + TODO
data: Any = legacy_function()
validated = UserSchema.parse(data)  # Safety net
# TODO: Add proper types | Priority: H
```

**Quick fix vs Refactor:**

```text
usage < 3  → Quick fix OK (document debt)
usage ≥ 3  → Refactor FIRST
```

---

## TOOLS

Prettier: `--check .` / `--write .` | ESLint: `. --quiet` / `. --fix`  
pytest: `python -m pytest` / `--cov=app` | Pyright: `pyright app/`  
Bandit: `bandit app/` | Safety: `safety check` | markdownlint: `"**/*.md" --fix`

---

## PRE-COMMIT CHECKLIST

```text
[ ] Context: Loaded session
[ ] Search: Checked existing
[ ] Dependencies: If 2+ similar, analyzed
[ ] Impact: If modifying, verified usage
[ ] Root cause: If bug, traced backwards
[ ] Validation: At boundary
[ ] Security: No secrets (use .env), PII protection
[ ] Queries: N+1 prevented
[ ] Testing: Critical paths
[ ] Comments: WHY (ASCII ok, no emoji)
[ ] Prevention: Similar pattern search
[ ] TODO: Proper format if debt added

IF uncertain → ASK user
```

---

## SELF-CHECK

Security? Duplication? Root cause? Complexity justified?  
IF fails → REVISE | IF uncertain → ASK user

---

## PHILOSOPHY

Search→Analyze→Ask→Code | Reuse>Create | Root cause>Symptom | Prevent class | Simple until proven | Secure by default

---

## OUTPUT

```markdown
ANALYSIS:
- Existing: [files]
- Dependencies: [graph if 2+]
- Root cause: [category]

DECISION: [Reuse|Extend|Create|Refactor]

IMPLEMENTATION: [code]

PREVENTION: [similar pattern + lint rule]
```

---

Claude Code a des agents spécialisés. Ce guide t'aide à les utiliser **efficacement** pour ce projet.

## Agents pertinents pour ce projet

### 1. **precheck** - AVANT toute création de fonction

**Quand**: Avant d'écrire une nouvelle fonction/classe/feature

**Pourquoi**: Éviter duplication, vérifier si ça existe déjà

**Exemple**:

```bash
Avant d'implémenter list_files, vérifie avec precheck si une fonction similaire existe
```

### 2. **code-review-verifier** - APRÈS implémentation

**Quand**: Après avoir terminé un composant (tool, client, server)

**Pourquoi**: Vérifier correctness, qualité, pas d'erreurs

**Exemple**:

```bash
Après avoir codé tools/read.ts, utilise code-review-verifier
```

### 3. **root-cause-debugger** - Quand ça bug

**Quand**: Erreurs, comportements inattendus, bugs

**Pourquoi**: Diagnostic systématique, pas de band-aid

**Exemple**:

```bash
BrokenPipeError, 404, timeout → root-cause-debugger
```

### 4. **doc-fetcher** - Avant d'implémenter une feature externe

**Quand**: Avant d'utiliser Obsidian API, MCP SDK, Hono features

**Pourquoi**: Vérifier si fonctionnalité native existe

**Exemple**:

```bash
Avant de coder search custom, vérifier si Obsidian API a search natif
```

### 5. **performance-optimizer** - Après liste/search tools

**Quand**: Après tools lourds (list_files, search)

**Pourquoi**: Vérifier N+1 queries, optimiser perf

**Exemple**:

```bash
Après search.ts, vérifier perf avec performance-optimizer
```

## Flow de développement recommandé

```text
1. precheck (avant code)
2. Coder le composant
3. code-review-verifier (après code)
4. performance-optimizer (si perf-critical)
5. root-cause-debugger (si bugs)
```

## Notes spécifiques projet

- **Pas besoin de security-auditor** pour MVP (API key déjà géré par Obsidian REST API)
- **doc-fetcher** critique pour MCP SDK (@modelcontextprotocol/sdk v1.20.2)
- **performance-optimizer** important pour search tool (peut scanner 1000+ notes)

## Pragmatisme

Ne pas sur-utiliser les agents. Si c'est trivial, code direct. Agents = pour complexité réelle.
