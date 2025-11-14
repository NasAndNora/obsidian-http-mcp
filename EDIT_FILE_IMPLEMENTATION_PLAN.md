# Plan d'Implémentation: `edit_file` Tool

**Date:** 2025-11-14
**Objectif:** Ajouter outil d'édition chirurgicale avec pattern matching (old_string/new_string)
**Impact:** 98% réduction tokens AI pour éditions

---

## 📊 Analyse Préliminaire

### Structure Actuelle

**Fichiers existants:**
```
src/tools/
├── write.ts          → create/overwrite/append (garde)
├── read.ts           → lecture complète (garde)
├── find.ts           → invalidateFilesCache() (réutilise)
└── ...

src/types/tools.ts    → Interfaces Args (extend)
src/server/http.ts    → Enregistrement tools (extend)
```

**Patterns identifiés:**
1. **Validation:** Chaque tool valide ses args
2. **Cache:** Appelle `invalidateFilesCache()` après modif
3. **Retour:** Interface `ToolResult` standard
4. **Erreurs:** Try-catch avec messages clairs

### Opportunités de Refacto

**🔴 Duplication actuelle:**
- Validation `path` répétée dans 6 tools
- Validation `content !== undefined` répétée
- Pattern try-catch identique partout

**✅ Refacto proposé:**
- Créer `src/utils/validation.ts` avec helpers communs
- Extraire logique remplacement réutilisable

---

## 🎯 Architecture Proposée

### Nouveaux Fichiers

```
src/tools/edit.ts               → Fonction principale editFile()
src/utils/validation.ts         → Helpers validation (NOUVEAU)
src/utils/string-replace.ts     → Logique remplacement (NOUVEAU)
```

### Fichiers Modifiés

```
src/types/tools.ts              → + EditFileArgs interface
src/server/http.ts              → + edit_file tool schema
```

### Dépendances

```
edit.ts
  ├─> ObsidianClient (read/write)
  ├─> validation.ts (validatePath, validateContent)
  ├─> string-replace.ts (countOccurrences, replaceContent)
  └─> find.ts (invalidateFilesCache)
```

---

## 📝 Phases d'Implémentation

### Phase 1: Core Logic (Sans Refacto) - 2h

**Objectif:** Implémenter fonctionnalité minimale qui marche

**Fichier:** `src/tools/edit.ts`

```typescript
// Pseudo-code structure
function editFile(client, args):
  // 1. Validation basique
  if not args.path or not args.old_string or args.new_string === undefined:
    return error("Missing required parameters")

  try:
    // 2. Lire fichier
    content = await client.readFile(args.path)

    // 3. Compter occurrences
    occurrences = countOccurrences(content, args.old_string)

    // 4. Valider unicité
    if occurrences == 0:
      return error("old_string not found")

    if occurrences > 1 and not args.replace_all:
      return error("Found {occurrences} occurrences. Use replace_all=true or add context")

    // 5. Remplacer
    newContent = args.replace_all
      ? content.replaceAll(args.old_string, args.new_string)
      : content.replace(args.old_string, args.new_string)

    // 6. Écrire
    await client.writeFile(args.path, newContent)

    // 7. Invalider cache
    invalidateFilesCache()

    return success({
      path: args.path,
      occurrences_replaced: args.replace_all ? occurrences : 1
    })

  catch error:
    return error(error.message)
```

**Helper interne:**
```typescript
function countOccurrences(content, substring):
  return content.split(substring).length - 1
```

**Type Args:**
```typescript
// src/types/tools.ts
interface EditFileArgs:
  path: string
  old_string: string
  new_string: string
  replace_all?: boolean
```

**Tool Schema:**
```typescript
// src/server/http.ts
{
  name: 'edit_file',
  description: 'Surgically edit file using exact string replacement...',
  inputSchema: {
    properties: {
      path: string,
      old_string: string,
      new_string: string,
      replace_all: boolean
    },
    required: ['path', 'old_string', 'new_string']
  }
}
```

**Tests Phase 1:**
- ✅ Remplacement unique (1 occurrence)
- ✅ Multiple occurrences sans replace_all (error)
- ✅ Multiple occurrences avec replace_all
- ✅ old_string not found (error)

**Livrables:**
- `src/tools/edit.ts` fonctionnel (~80 lignes)
- `src/types/tools.ts` avec EditFileArgs
- `src/server/http.ts` avec tool schema
- 4 tests de base

**⚠️ Limitations Phase 1:**
- Code dupliqué (validation répétée)
- Pas de helper réutilisable
- Acceptable pour MVP

---

### Phase 2: Refacto Validation - 1h

**Objectif:** Éliminer duplication validation, améliorer maintenabilité

**Nouveau fichier:** `src/utils/validation.ts`

```typescript
// Pseudo-code structure
module validation:

  // Valide path (non vide, pas undefined)
  function validatePath(path):
    if not path or typeof path != 'string':
      throw ValidationError("path is required and must be string")
    return path.trim()

  // Valide que content n'est pas undefined (peut être vide string)
  function validateContent(content):
    if content === undefined:
      throw ValidationError("content parameter is required")
    return content

  // Valide string non vide
  function validateNonEmptyString(value, fieldName):
    if not value or typeof value != 'string':
      throw ValidationError("{fieldName} is required and must be non-empty string")
    return value.trim()

  // Helper pour retourner ToolResult error
  function validationError(message):
    return { success: false, error: message }
```

**Mise à jour `edit.ts`:**
```typescript
import { validatePath, validateNonEmptyString, validationError } from '../utils/validation.js'

function editFile(client, args):
  // Validation refactorée
  try:
    validatePath(args.path)
    validateNonEmptyString(args.old_string, 'old_string')
    // new_string peut être vide (deletion) donc pas validateNonEmpty
    if args.new_string === undefined:
      return validationError('new_string parameter is required')
  catch ValidationError as e:
    return validationError(e.message)

  // Rest unchanged...
```

**⚠️ Conflit potentiel:**
- `write.ts` utilise déjà validation inline
- **Décision:** Ne pas refacto write.ts maintenant (scope creep)
- **Justification:** edit.ts nouveau code, write.ts stable

**Tests Phase 2:**
- ✅ Validation path vide
- ✅ Validation old_string vide
- ✅ Validation new_string undefined
- ✅ Backward compat: anciens tests passent toujours

**Livrables:**
- `src/utils/validation.ts` (~50 lignes)
- `src/tools/edit.ts` refactoré (~75 lignes, -5 grâce helpers)
- 3 tests validation

---

### Phase 3: Refacto String Replace Logic - 1h

**Objectif:** Extraire logique remplacement réutilisable (future: active_edit_file)

**Nouveau fichier:** `src/utils/string-replace.ts`

```typescript
// Pseudo-code structure
module stringReplace:

  // Compte occurrences d'une substring
  function countOccurrences(content, substring):
    if not substring:
      return 0
    return content.split(substring).length - 1

  // Vérifie unicité et retourne erreur si besoin
  function validateUniqueness(occurrences, replaceAll):
    if occurrences == 0:
      return { valid: false, error: 'old_string not found' }

    if occurrences > 1 and not replaceAll:
      return {
        valid: false,
        error: `Found ${occurrences} occurrences. Use replace_all=true or add more context.`
      }

    return { valid: true, occurrences }

  // Effectue le remplacement
  function performReplacement(content, oldString, newString, replaceAll):
    return replaceAll
      ? content.replaceAll(oldString, newString)
      : content.replace(oldString, newString)

  // Fonction complète (combine tout)
  function replaceInContent(content, oldString, newString, replaceAll = false):
    occurrences = countOccurrences(content, oldString)
    validation = validateUniqueness(occurrences, replaceAll)

    if not validation.valid:
      return { success: false, error: validation.error }

    newContent = performReplacement(content, oldString, newString, replaceAll)

    return {
      success: true,
      content: newContent,
      occurrences: validation.occurrences
    }
```

**Mise à jour `edit.ts`:**
```typescript
import { replaceInContent } from '../utils/string-replace.js'

function editFile(client, args):
  // Validation... (Phase 2)

  try:
    // Lire
    content = await client.readFile(args.path)

    // Remplacer (logique extraite)
    result = replaceInContent(
      content,
      args.old_string,
      args.new_string,
      args.replace_all
    )

    if not result.success:
      return { success: false, error: result.error }

    // Écrire
    await client.writeFile(args.path, result.content)
    invalidateFilesCache()

    return success({
      path: args.path,
      occurrences_replaced: result.occurrences
    })

  catch error:
    return error(error.message)
```

**Avantages:**
- ✅ Logic testable indépendamment
- ✅ Réutilisable pour `edit_active_file` (Phase 2 du projet global)
- ✅ Séparation concerns (string ops vs file ops)

**Tests Phase 3:**
- ✅ countOccurrences: 0, 1, N occurrences
- ✅ validateUniqueness: tous cas
- ✅ performReplacement: simple, replaceAll
- ✅ replaceInContent: intégration complète
- ✅ edit.ts: backward compat

**Livrables:**
- `src/utils/string-replace.ts` (~80 lignes)
- `src/tools/edit.ts` refactoré (~60 lignes, -15 grâce helpers)
- 8 tests unitaires utils

---

### Phase 4: Polish & Edge Cases - 1h

**Objectif:** Gérer cas limites, améliorer messages d'erreur, edge cases

**Améliorations `edit.ts`:**

```typescript
function editFile(client, args):
  // Validation...

  // Edge case: empty old_string
  if args.old_string === '':
    return validationError('old_string cannot be empty')

  try:
    content = await client.readFile(args.path)

    // Edge case: empty file
    if content === '':
      return error('Cannot edit empty file')

    result = replaceInContent(...)

    if not result.success:
      // Améliorer message si not found
      if result.error.includes('not found'):
        return error(`old_string not found in ${args.path}. Ensure exact match (including whitespace).`)
      return error(result.error)

    // Edge case: no actual change
    if result.content === content:
      return success({
        path: args.path,
        occurrences_replaced: 0,
        message: 'No changes made (old_string and new_string identical)'
      })

    await client.writeFile(args.path, result.content)
    invalidateFilesCache()

    return success({
      path: args.path,
      occurrences_replaced: result.occurrences,
      message: `Successfully replaced ${result.occurrences} occurrence(s)`
    })

  catch error:
    // Améliorer messages pour erreurs courantes
    if error.message.includes('ENOENT'):
      return error(`File not found: ${args.path}`)
    if error.message.includes('EACCES'):
      return error(`Permission denied: ${args.path}`)
    return error(error.message)
```

**Améliorations `string-replace.ts`:**

```typescript
function validateUniqueness(occurrences, replaceAll):
  if occurrences == 0:
    return {
      valid: false,
      error: 'old_string not found. Ensure exact match (including whitespace/indentation).'
    }

  if occurrences > 1 and not replaceAll:
    return {
      valid: false,
      error: `Found ${occurrences} occurrences. Either:\n` +
             `1. Set replace_all=true to replace all ${occurrences}, OR\n` +
             `2. Include more surrounding context in old_string to make it unique`
    }

  return { valid: true, occurrences }
```

**Tests Phase 4:**
- ✅ Empty old_string (error)
- ✅ Empty file (error)
- ✅ No change (old === new)
- ✅ File not found (ENOENT)
- ✅ Permission denied (EACCES)
- ✅ Unicode/emoji handling
- ✅ Multiline old_string
- ✅ Indentation preservation

**Livrables:**
- `src/tools/edit.ts` final (~80 lignes avec edge cases)
- `src/utils/string-replace.ts` final (~90 lignes avec messages améliorés)
- 8 tests edge cases

---

## 🔄 Gestion Conflits Potentiels

### Conflit 1: invalidateFilesCache()

**Situation:** Déjà utilisé dans write.ts, delete.ts, move.ts

**Résolution:** ✅ Aucun conflit
- Fonction exportée de `find.ts`
- Import simple dans `edit.ts`
- Comportement identique (invalide cache global)

### Conflit 2: Validation path

**Situation:** Logique similaire dans write.ts, read.ts, etc.

**Résolution Phase 2:** Créer `validation.ts` mais **NE PAS** refacto les anciens tools
- **Risque:** Introduire bugs dans code stable
- **Bénéfice:** Minime (anciens tools fonctionnent)
- **Décision:** Validation helpers pour NOUVEAUX tools uniquement

### Conflit 3: Tool naming

**Situation:** Éviter confusion avec write_file

**Résolution:** Naming très explicite
- `write_file`: Créer/écraser/append fichier complet
- `edit_file`: Remplacer substring spécifique
- Descriptions MCP claires sur différence

### Conflit 4: Type EditFileArgs

**Situation:** Ajouter dans `types/tools.ts` déjà rempli

**Résolution:** ✅ Simple ajout à la fin
```typescript
// types/tools.ts
export interface EditFileArgs {
  path: string;
  old_string: string;
  new_string: string;
  replace_all?: boolean;
}
```

---

## 📁 Fichiers Impactés - Résumé

### Nouveaux Fichiers

| Fichier | Phase | Lignes | Description |
|---------|-------|--------|-------------|
| `src/tools/edit.ts` | 1 | ~80 | Fonction principale editFile() |
| `src/utils/validation.ts` | 2 | ~50 | Helpers validation réutilisables |
| `src/utils/string-replace.ts` | 3 | ~90 | Logique remplacement réutilisable |

**Total nouveau code:** ~220 lignes

### Fichiers Modifiés

| Fichier | Phase | Changements | Risque |
|---------|-------|-------------|--------|
| `src/types/tools.ts` | 1 | + EditFileArgs interface (5 lignes) | 🟢 Aucun |
| `src/server/http.ts` | 1 | + edit_file tool schema (20 lignes) | 🟢 Aucun |
| `src/server/http.ts` | 1 | + import editFile (1 ligne) | 🟢 Aucun |
| `src/server/http.ts` | 1 | + case 'edit_file' dans handler (5 lignes) | 🟢 Aucun |

**Total modifs:** ~31 lignes dans fichiers existants

### Fichiers NON Touchés (Important)

**Aucune modification:**
- ❌ `src/tools/write.ts` - Reste stable
- ❌ `src/tools/read.ts` - Reste stable
- ❌ `src/client/obsidian.ts` - Aucun nouveau endpoint requis
- ❌ Tous autres tools existants

---

## 🧪 Stratégie Tests

### Tests Unitaires (src/utils/)

**validation.ts** (6 tests):
- validatePath: vide, undefined, valide
- validateNonEmptyString: vide, undefined, valide
- validationError: format correct

**string-replace.ts** (12 tests):
- countOccurrences: 0, 1, N, empty substring
- validateUniqueness: 0, 1, N avec/sans replaceAll
- performReplacement: simple, replaceAll
- replaceInContent: integration complète

### Tests Intégration (src/tools/edit.ts)

**Phase 1** (4 tests):
- Replacement unique
- Multiple sans replaceAll (error)
- Multiple avec replaceAll
- Not found (error)

**Phase 4** (8 tests):
- Empty old_string (error)
- Empty file (error)
- No change détecté
- File not found
- Permission denied
- Unicode/emoji
- Multiline old_string
- Indentation préservée

**Total:** 30 tests

---

## ⏱️ Timeline Détaillé

| Phase | Durée | Livrables | Tests |
|-------|-------|-----------|-------|
| **Phase 1: Core** | 2h | edit.ts fonctionnel + types + schema | 4 |
| **Phase 2: Validation** | 1h | validation.ts + refacto edit.ts | 9 |
| **Phase 3: String Logic** | 1h | string-replace.ts + refacto edit.ts | 12 |
| **Phase 4: Polish** | 1h | Edge cases + messages améliorés | 8 |
| **Total** | **5h** | **3 nouveaux fichiers, 1 modifié** | **30 tests** |

**Note:** Timeline originale était 4h, +1h pour refacto (investissement pour future maintenance)

---

## 🎯 Ordre d'Exécution Recommandé

### Option A: Progressive (Recommandée)

```
Day 1:
  Phase 1 (2h) → Tests → Commit
  → Livrable: edit_file fonctionnel MVP

Day 2:
  Phase 2 (1h) → Tests → Commit
  Phase 3 (1h) → Tests → Commit
  → Livrable: Code refactoré, réutilisable

Day 3:
  Phase 4 (1h) → Tests → Commit
  → Livrable: Production-ready avec edge cases
```

**Avantages:**
- Fonctionnel dès jour 1
- Refacto incrémental
- Commits logiques

### Option B: All-in-One

```
Phase 1-4 séquentiellement → 1 gros commit
```

**Désavantages:**
- Pas de livrable intermédiaire
- Commit énorme (difficile à review)
- Risque scope creep

**❌ Non recommandé**

---

## 🚀 Prêt à Démarrer?

### Checklist Avant Phase 1

- [x] Plan validé
- [ ] Tests setup vérifié (npm run test fonctionne?)
- [ ] Branche créée (`git checkout -b feature/edit-file`)
- [ ] Obsidian + Local REST API running (pour tests intégration)

### Commandes Phase 1

```bash
# Créer fichiers
touch src/tools/edit.ts
# Modifier types
code src/types/tools.ts
# Modifier server
code src/server/http.ts

# Tests après chaque fonction
npm run build
npm run test

# Commit
git add src/tools/edit.ts src/types/tools.ts src/server/http.ts
git commit -m "feat(edit): add edit_file tool with pattern matching (Phase 1)"
```

---

**Question:** Tu valides ce plan? On commence Phase 1 maintenant?
