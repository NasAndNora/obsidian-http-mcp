# Plan d'Implémentation - Token Optimization & API Improvements

**Date:** 2025-11-14
**Version actuelle:** 1.0.6
**Version cible:** 1.1.0

---

## 📋 Table des Matières

1. [Résumé Exécutif](#résumé-exécutif)
2. [Analyse Critique](#analyse-critique)
3. [Fonctionnalités Sous-Utilisées](#fonctionnalités-sous-utilisées)
4. [Plan d'Implémentation](#plan-dimplémentation)
5. [Risques & Mitigations](#risques--mitigations)
6. [Timeline & Effort](#timeline--effort)

---

## 🎯 Résumé Exécutif

### Problème Principal
Le serveur MCP actuel utilise seulement **30% des capacités** de l'API Obsidian Local REST (v3.2.0), ce qui entraîne:
- **Consommation excessive de tokens AI** (jusqu'à 10,000 tokens pour éditer 1 ligne)
- **Performance dégradée** (search: 2-3s au lieu de 100ms)
- **API calls inefficaces** (1000+ GET au lieu de 1 POST)

### Solution Proposée
**Approche 2: Multi-outils spécialisés** avec optimisations critiques:
- ✅ **98% réduction tokens AI** (edit_file + patch_file)
- ✅ **95% amélioration performance** (native search API)
- ✅ **50% réduction complexity** (active file API)

### Impact Attendu
| Métrique | Avant | Après | Gain |
|----------|-------|-------|------|
| Tokens AI (édition) | 10,000 | 200 | **98%** |
| Search performance | 2-3s | 100ms | **95%** |
| API calls (search) | 1000+ | 1 | **99%** |
| UX (edit active file) | 3-4 calls | 1 call | **75%** |

---

## 🔴 Analyse Critique

### Problème 1: Search Inefficace (CRITIQUE)

**État actuel:** `src/tools/search.ts`
```typescript
// On réinvente la roue:
// 1. walkVault() → Liste TOUS les fichiers
// 2. Lit chaque fichier (GET x1000)
// 3. Pattern matching manuel ligne par ligne
// Performance: 2-3 secondes pour 1000 fichiers
```

**API disponible mais NON UTILISÉE:**
```http
POST /search/simple/
Body: { query: "texte", contextLength: 100 }
```

**Impact:**
- ❌ 1000+ GET requests au lieu de 1 POST
- ❌ Pas d'indexation native Obsidian
- ❌ Performance dégradée (gros vaults: 5000+ notes)
- ❌ Coût API élevé

**Priorité:** 🔴 **CRITIQUE** - À fixer AVANT tout le reste

---

### Problème 2: Édition Coûteuse en Tokens

**État actuel:** Pour changer 1 ligne
```typescript
// AI doit envoyer:
1. read_file("note.md") → Reçoit 5000 tokens
2. AI traite et régénère TOUT le fichier → 5000 tokens
3. write_file("note.md", fullContent) → Envoie 5000 tokens

// Total: ~10,000 tokens pour 1 ligne modifiée
```

**Impact:**
- ❌ Consommation excessive tokens API
- ❌ Coûts élevés pour utilisateurs
- ❌ Latence accrue
- ❌ Limite contexte atteinte rapidement

**Priorité:** 🔴 **CRITIQUE** - Token Optimization v1.1

---

### Problème 3: Pas d'Édition Structurée

**PATCH API disponible (v3.0+) mais NON UTILISÉE:**
```http
PATCH /vault/{path}
Operation: replace | append | prepend
Target-Type: heading | block | frontmatter
Target: Section Title
```

**Use cases manquants:**
- Modifier un heading spécifique
- Éditer frontmatter (tags, status, etc.)
- Append sous une section
- Modifier block référencé

**Impact:**
- ❌ AI doit réécrire fichier complet
- ❌ Pas d'opérations atomiques
- ❌ Risque écrasement concurrent

**Priorité:** 🔥 **URGENT** - Ajouter patch_file

---

### Problème 4: Active File Ignoré

**API disponible mais NON UTILISÉE:**
```http
GET /active/      # Fichier actuellement ouvert
POST /active/     # Append au fichier actif
PATCH /active/    # Modifier fichier actif
```

**Use case typique:**
```
User: "Edit this file" (dans Obsidian)
AI actuel:
  1. "Quel fichier?" → find_files
  2. Lire → read_file
  3. Éditer → write_file
  Total: 3-4 API calls

AI optimal avec /active/:
  1. edit_active_file({ old_string, new_string })
  Total: 1 API call
```

**Impact:**
- ❌ 3-4x plus d'API calls
- ❌ Tokens gaspillés pour trouver le path
- ❌ UX dégradée (AI doit deviner)

**Priorité:** 🟡 **IMPORTANT** - Phase 2

---

## 🔍 Fonctionnalités Sous-Utilisées

### 1. Search API Native (v1.0+) 🔴 CRITIQUE

**Endpoint:** `POST /search/simple/`

**Capacités:**
- Recherche full-text indexée
- Support regex
- Context lines configurables
- Scores de pertinence

**Fiabilité:** ✅ Très stable (API core depuis v1.0)

**Implémentation actuelle:** ❌ Aucune (on fait manuellement)

**Action:** Remplacer `src/tools/search.ts` complètement

---

### 2. PATCH API (v3.0.1+) 🔥 URGENT

**Endpoint:** `PATCH /vault/{path}` avec headers

**Capacités:**
- Édition par heading
- Édition frontmatter
- Édition par block reference
- 3 opérations: append/prepend/replace

**Fiabilité:** ✅ Stable depuis 18 mois (nov 2023)

**Implémentation actuelle:** ❌ Partiellement (seulement append)

**Action:** Ajouter outil `patch_file` complet

---

### 3. Active File API (v1.0+) 🟡 IMPORTANT

**Endpoints:** `/active/` (GET, POST, PUT, PATCH, DELETE)

**Capacités:**
- Accès direct au fichier ouvert
- Pas besoin de path
- Édition contextuelle

**Fiabilité:** ✅ Très stable (API core)

**Implémentation actuelle:** ❌ Aucune

**Action:** Ajouter outils `*_active_file`

---

### 4. Periodic Notes API (v3.1.0) ⏰ OPTIONNEL

**Endpoints:** `/periodic/{period}/` et `/periodic/{y}/{m}/{d}/{period}/`

**Capacités:**
- Daily/Weekly/Monthly notes
- Dates arbitraires
- Auto-création

**Fiabilité:** ✅ Stable (mars 2024)

**Implémentation actuelle:** ❌ Aucune

**Action:** Roadmap v2.0+ (si demandé par users)

---

### 5. Commands API (v2.0+) ⏰ OPTIONNEL

**Endpoints:** `GET /commands/` et `POST /commands/{id}/`

**Capacités:**
- Liste commandes disponibles
- Exécution commandes Obsidian
- Intégration workflows

**Fiabilité:** ✅ Stable

**Implémentation actuelle:** ❌ Aucune

**Action:** Roadmap v2.0+ (cas d'usage limités)

---

### 6. Open File API (v1.0+) ⏰ OPTIONNEL

**Endpoint:** `POST /open/{path}`

**Capacités:**
- Ouvrir fichier dans UI Obsidian
- Navigation guidée

**Fiabilité:** ✅ Stable

**Implémentation actuelle:** ❌ Aucune

**Action:** Roadmap v1.3+ (nice-to-have)

---

### 7. Tags Endpoint (PR #199) ⏳ EN ATTENTE

**Endpoint:** `GET /tags`

**Capacités:**
- Liste tous les tags du vault
- Suggestions intelligentes

**Fiabilité:** ⚠️ PR ouverte (nov 2025), pas encore mergée

**Implémentation actuelle:** ❌ Aucune

**Action:** Attendre merge, puis ajouter en v1.3+

---

### 8. HTML Rendering (PR #195) ⏳ EN ATTENTE

**Endpoint:** `GET /vault/{path}` avec `Accept: text/html`

**Capacités:**
- Contenu rendu en HTML
- Prévisualisation sans parser

**Fiabilité:** ⚠️ PR ouverte (nov 2025), pas encore mergée

**Implémentation actuelle:** ❌ Aucune

**Action:** Attendre merge, évaluer intérêt

---

### 9. File Move Operation (PR #191) ⚠️ INCERTAIN

**Endpoint:** `MOVE /vault/{path}` avec header `Destination`

**Capacités:**
- Déplacer fichiers
- Préserver liens internes
- Création dirs auto

**Fiabilité:** ⚠️ PR en discussion, peut ne pas être mergée

**Implémentation actuelle:** ✅ On a `move_file` (fonctionne différemment)

**Action:** Attendre résolution discussions (WebDAV-style proposé)

---

## 🚀 Plan d'Implémentation

### Phase 0: Correctifs Critiques (AVANT TOUT) 🔴

**Objectif:** Fixer inefficacités majeures

#### 0.1 Remplacer Search par API Native

**Fichiers modifiés:**
- `src/client/obsidian.ts` - Ajouter méthode `searchSimple()`
- `src/tools/search.ts` - Réécrire complètement

**Ancienne implémentation (À SUPPRIMER):**
```typescript
// 1. walkVault() → Liste tous fichiers
// 2. Promise.allSettled(batch.map(readFile))
// 3. Pattern matching ligne par ligne
```

**Nouvelle implémentation:**
```typescript
// src/client/obsidian.ts
async searchSimple(query: string, contextLength?: number) {
  const response = await this.client.post('/search/simple/', {
    query,
    contextLength: contextLength || 100
  });
  return response.data;
}

// src/tools/search.ts
async search(client, args) {
  const results = await client.searchSimple(
    args.query,
    args.context_lines
  );

  return {
    success: true,
    data: {
      matches: results.map(r => ({
        file: r.filename,
        score: r.score,
        matches: r.matches.map(m => ({
          line: m.match.start.line,
          content: m.context
        }))
      })),
      total_matches: results.length
    }
  };
}
```

**Tests:**
- Query simple
- Query regex
- Context lines
- Max results
- Performance benchmark (doit être <200ms)

**Impact:**
- ✅ 95% plus rapide (100ms vs 2-3s)
- ✅ 99% moins d'API calls (1 POST vs 1000 GET)
- ✅ Utilise indexation native

**Effort:** 2h

**Risque:** 🟢 Faible (API stable v1.0+)

**Priorité:** 🔴 **CRITIQUE - À faire en premier**

---

### Phase 1: Token Optimization Core 🔥

**Objectif:** Réduire 98% tokens AI pour éditions

#### 1.1 Ajouter `edit_file` (Pattern Matching)

**Outil nouveau:** `edit_file`

**API:**
```typescript
edit_file({
  path: string,              // Chemin fichier
  old_string: string,        // Texte exact à remplacer
  new_string: string,        // Nouveau texte
  replace_all?: boolean      // Remplacer toutes occurrences (défaut: false)
})
```

**Description pour AI:**
```
Surgically edit file content using exact string replacement.
Use this for arbitrary text edits anywhere in the file.
For structured edits (headings/frontmatter), use patch_file instead.

IMPORTANT:
- old_string must match exactly (including whitespace/indentation)
- Include enough context to make old_string unique
- If multiple matches exist, you'll get an error (use replace_all or add more context)
```

**Implémentation:**

**Fichiers à créer:**
- `src/tools/edit.ts` - Nouvel outil
- `src/types/tools.ts` - Ajouter `EditFileArgs`

**Fichiers à modifier:**
- `src/server/http.ts` - Enregistrer outil

**Code:**
```typescript
// src/tools/edit.ts
import type { ObsidianClient } from '../client/obsidian.js';
import type { ToolResult } from '../types/index.js';
import { invalidateFilesCache } from './find.js';

export async function editFile(
  client: ObsidianClient,
  args: {
    path: string;
    old_string: string;
    new_string: string;
    replace_all?: boolean;
  }
): Promise<ToolResult> {
  try {
    // Validation
    if (!args.path || !args.old_string || args.new_string === undefined) {
      return {
        success: false,
        error: 'path, old_string, and new_string are required',
      };
    }

    // 1. Read current content
    const content = await client.readFile(args.path);

    // 2. Count occurrences
    const parts = content.split(args.old_string);
    const occurrences = parts.length - 1;

    if (occurrences === 0) {
      return {
        success: false,
        error: `old_string not found in ${args.path}. Make sure it matches exactly (including whitespace).`,
      };
    }

    if (!args.replace_all && occurrences > 1) {
      return {
        success: false,
        error: `Found ${occurrences} occurrences of old_string. Either:\n` +
               `1. Set replace_all=true to replace all ${occurrences} occurrences, OR\n` +
               `2. Include more context in old_string to make it unique`,
      };
    }

    // 3. Replace
    const newContent = args.replace_all
      ? content.replaceAll(args.old_string, args.new_string)
      : content.replace(args.old_string, args.new_string);

    // 4. Write back
    await client.writeFile(args.path, newContent);

    // Invalidate cache
    invalidateFilesCache();

    return {
      success: true,
      data: {
        path: args.path,
        occurrences_replaced: args.replace_all ? occurrences : 1,
        message: `Successfully replaced ${args.replace_all ? occurrences : 1} occurrence(s)`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

**Tool Schema (http.ts):**
```typescript
{
  name: 'edit_file',
  description: 'Surgically edit file content using exact string replacement. Use for arbitrary text edits. IMPORTANT: old_string must match exactly including whitespace. Include context for uniqueness. For structured edits (headings/frontmatter), use patch_file instead.',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'File path to edit (e.g., "Notes/meeting.md")'
      },
      old_string: {
        type: 'string',
        description: 'Exact text to replace (must match exactly including whitespace). Include enough context to ensure uniqueness.'
      },
      new_string: {
        type: 'string',
        description: 'Replacement text'
      },
      replace_all: {
        type: 'boolean',
        description: 'Replace all occurrences (default: false). If false and multiple matches exist, returns error.'
      }
    },
    required: ['path', 'old_string', 'new_string'],
  },
}
```

**Tests à écrire:**
```typescript
// Test 1: Simple unique replacement
// Test 2: Multiple occurrences without replace_all (should error)
// Test 3: Multiple occurrences with replace_all=true
// Test 4: old_string not found (should error)
// Test 5: Preserve indentation/whitespace
// Test 6: Replace across multiple lines
// Test 7: Empty new_string (deletion)
// Test 8: Unicode/emoji handling
```

**Impact:**
- ✅ 98% réduction tokens AI (200 vs 10,000)
- ✅ Pattern familier (comme Edit tool Claude Code)
- ✅ Édition arbitraire (pas limité aux sections)

**Effort:** 4h (80 lignes code + 50 lignes tests)

**Risque:** 🟡 Moyen
- old_string doit être unique → Erreurs possibles
- Mitigation: Messages d'erreur clairs + guidance

**Priorité:** 🔥 **URGENT**

---

#### 1.2 Ajouter `patch_file` (Édition Structurée)

**Outil nouveau:** `patch_file`

**API:**
```typescript
patch_file({
  path: string,                                    // Chemin fichier
  operation: 'append' | 'prepend' | 'replace',    // Opération
  target_type: 'heading' | 'block' | 'frontmatter', // Type cible
  target: string,                                  // Titre/ID/Clé
  content: string                                  // Nouveau contenu
})
```

**Description pour AI:**
```
Edit structured content (headings, blocks, frontmatter) using Obsidian's native PATCH API.
More efficient than edit_file for section-based edits.

Use cases:
- Modify a specific heading: target_type='heading', target='Section Title'
- Update frontmatter field: target_type='frontmatter', target='status'
- Edit block reference: target_type='block', target='^block-id'

Operations:
- append: Add content after target
- prepend: Add content before target
- replace: Replace target content entirely
```

**Implémentation:**

**Fichiers à modifier:**
- `src/client/obsidian.ts` - Ajouter méthode `patchFile()`
- `src/tools/patch.ts` - Créer nouvel outil
- `src/types/tools.ts` - Ajouter `PatchFileArgs`
- `src/server/http.ts` - Enregistrer outil

**Code:**
```typescript
// src/client/obsidian.ts - Ajouter cette méthode
async patchFile(
  path: string,
  operation: 'append' | 'prepend' | 'replace',
  targetType: 'heading' | 'block' | 'frontmatter',
  target: string,
  content: string
): Promise<void> {
  this.validatePath(path);
  const encoded = this.encodePath(path);

  await this.client.patch(`/vault/${encoded}`, content, {
    headers: {
      'Content-Type': 'text/markdown',
      'Operation': operation,
      'Target-Type': targetType,
      'Target': target,
    },
  });
}

// src/tools/patch.ts - Nouveau fichier
import type { ObsidianClient } from '../client/obsidian.js';
import type { ToolResult } from '../types/index.js';

export async function patchFile(
  client: ObsidianClient,
  args: {
    path: string;
    operation: 'append' | 'prepend' | 'replace';
    target_type: 'heading' | 'block' | 'frontmatter';
    target: string;
    content: string;
  }
): Promise<ToolResult> {
  try {
    // Validation
    if (!args.path || !args.operation || !args.target_type || !args.target || args.content === undefined) {
      return {
        success: false,
        error: 'All parameters (path, operation, target_type, target, content) are required',
      };
    }

    const validOperations = ['append', 'prepend', 'replace'];
    if (!validOperations.includes(args.operation)) {
      return {
        success: false,
        error: `Invalid operation: ${args.operation}. Must be one of: ${validOperations.join(', ')}`,
      };
    }

    const validTargetTypes = ['heading', 'block', 'frontmatter'];
    if (!validTargetTypes.includes(args.target_type)) {
      return {
        success: false,
        error: `Invalid target_type: ${args.target_type}. Must be one of: ${validTargetTypes.join(', ')}`,
      };
    }

    // Call native PATCH API
    await client.patchFile(
      args.path,
      args.operation,
      args.target_type,
      args.target,
      args.content
    );

    return {
      success: true,
      data: {
        path: args.path,
        operation: args.operation,
        target_type: args.target_type,
        target: args.target,
        message: `Successfully ${args.operation}ed content ${args.target_type === 'frontmatter' ? 'to' : 'relative to'} "${args.target}"`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

**Tool Schema (http.ts):**
```typescript
{
  name: 'patch_file',
  description: 'Edit structured content (headings, blocks, frontmatter) using native PATCH API. More efficient than edit_file for section-based edits. Use cases: modify heading, update frontmatter field, edit block reference.',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'File path to patch (e.g., "Notes/meeting.md")'
      },
      operation: {
        type: 'string',
        enum: ['append', 'prepend', 'replace'],
        description: 'Operation: append (add after), prepend (add before), replace (overwrite)'
      },
      target_type: {
        type: 'string',
        enum: ['heading', 'block', 'frontmatter'],
        description: 'Type of target: heading (section title), block (^block-id), frontmatter (YAML key)'
      },
      target: {
        type: 'string',
        description: 'Target identifier: heading title (e.g., "Notes"), block ID (e.g., "^abc123"), or frontmatter key (e.g., "status")'
      },
      content: {
        type: 'string',
        description: 'Content to insert/replace'
      }
    },
    required: ['path', 'operation', 'target_type', 'target', 'content'],
  },
}
```

**Tests à écrire:**
```typescript
// Test 1: Replace heading content
// Test 2: Append under heading
// Test 3: Prepend before heading
// Test 4: Update frontmatter field
// Test 5: Create new frontmatter field
// Test 6: Edit block reference
// Test 7: Target not found (should error from API)
// Test 8: Invalid operation/target_type
```

**Impact:**
- ✅ 95% réduction tokens pour éditions structurées
- ✅ API native (pas de parsing manuel)
- ✅ Opérations atomiques
- ✅ Support frontmatter natif

**Effort:** 4h (100 lignes code + 60 lignes tests)

**Risque:** 🟢 Faible (API stable v3.0+ depuis 18 mois)

**Priorité:** 🔥 **URGENT**

---

#### 1.3 Améliorer `write_file` (Bonus)

**Modification:** Ajouter mode `prepend`

**Actuellement supporté:**
- `create` - Créer (erreur si existe)
- `overwrite` - Écraser
- `append` - Ajouter à la fin

**À ajouter:**
- `prepend` - Ajouter au début

**Implémentation:**
```typescript
// src/tools/write.ts - Modifier fonction existante
if (mode === 'prepend') {
  // Read existing content
  const fileExists = await client.fileExists(args.path);
  if (fileExists) {
    const existing = await client.readFile(args.path);
    await client.writeFile(args.path, args.content + '\n' + existing);
  } else {
    // File doesn't exist, just create it
    await client.writeFile(args.path, args.content);
  }
}
```

**Tool Schema (modifier existant):**
```typescript
mode: {
  type: 'string',
  enum: ['create', 'overwrite', 'append', 'prepend'],
  description: 'Write mode: create (error if exists), overwrite (replace all), append (add to end), prepend (add to beginning)'
}
```

**Tests:**
```typescript
// Test 1: Prepend to existing file
// Test 2: Prepend to non-existing file (should create)
// Test 3: Preserve existing content
```

**Impact:**
- ✅ Complète les modes d'écriture
- ✅ Cas d'usage: ajouter header/notice en haut

**Effort:** 1h (20 lignes)

**Risque:** 🟢 Très faible

**Priorité:** 🟡 **BONUS** (si temps disponible)

---

### Phase 2: Active File Support 🟡

**Objectif:** Réduire 50% tokens pour éditer fichier actif

#### 2.1 Ajouter Active File Tools

**Outils nouveaux:**
1. `read_active_file` - Lire fichier actif
2. `edit_active_file` - Éditer fichier actif (pattern matching)
3. `patch_active_file` - Patch fichier actif (structuré)
4. `write_active_file` - Écrire fichier actif (modes)

**Implémentation:**

**Fichiers à modifier:**
- `src/client/obsidian.ts` - Ajouter méthodes `/active/`
- `src/tools/active.ts` - Créer nouvel outil
- `src/server/http.ts` - Enregistrer 4 outils

**Code:**
```typescript
// src/client/obsidian.ts - Ajouter ces méthodes
async readActiveFile(): Promise<string> {
  const response = await this.client.get('/active/');
  return response.data;
}

async writeActiveFile(content: string): Promise<void> {
  await this.client.put('/active/', content, {
    headers: { 'Content-Type': 'text/markdown' },
  });
}

async appendActiveFile(content: string): Promise<void> {
  await this.client.post('/active/', content, {
    headers: { 'Content-Type': 'text/markdown' },
  });
}

async patchActiveFile(
  operation: 'append' | 'prepend' | 'replace',
  targetType: 'heading' | 'block' | 'frontmatter',
  target: string,
  content: string
): Promise<void> {
  await this.client.patch('/active/', content, {
    headers: {
      'Content-Type': 'text/markdown',
      'Operation': operation,
      'Target-Type': targetType,
      'Target': target,
    },
  });
}

// src/tools/active.ts - Nouveau fichier
export async function readActiveFile(client: ObsidianClient): Promise<ToolResult> {
  try {
    const content = await client.readActiveFile();
    return {
      success: true,
      data: { content },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function editActiveFile(
  client: ObsidianClient,
  args: {
    old_string: string;
    new_string: string;
    replace_all?: boolean;
  }
): Promise<ToolResult> {
  try {
    // Same logic as edit_file but uses readActiveFile/writeActiveFile
    const content = await client.readActiveFile();

    // Count occurrences
    const occurrences = content.split(args.old_string).length - 1;

    if (occurrences === 0) {
      return {
        success: false,
        error: 'old_string not found in active file',
      };
    }

    if (!args.replace_all && occurrences > 1) {
      return {
        success: false,
        error: `Found ${occurrences} occurrences. Use replace_all=true or add more context.`,
      };
    }

    // Replace
    const newContent = args.replace_all
      ? content.replaceAll(args.old_string, args.new_string)
      : content.replace(args.old_string, args.new_string);

    await client.writeActiveFile(newContent);

    return {
      success: true,
      data: {
        occurrences_replaced: args.replace_all ? occurrences : 1,
        message: 'Active file edited successfully',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function patchActiveFile(
  client: ObsidianClient,
  args: {
    operation: 'append' | 'prepend' | 'replace';
    target_type: 'heading' | 'block' | 'frontmatter';
    target: string;
    content: string;
  }
): Promise<ToolResult> {
  try {
    await client.patchActiveFile(
      args.operation,
      args.target_type,
      args.target,
      args.content
    );

    return {
      success: true,
      data: {
        message: `Active file patched successfully`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function writeActiveFile(
  client: ObsidianClient,
  args: {
    content: string;
    mode?: 'overwrite' | 'append' | 'prepend';
  }
): Promise<ToolResult> {
  try {
    const mode = args.mode || 'overwrite';

    if (mode === 'append') {
      await client.appendActiveFile(args.content);
    } else if (mode === 'prepend') {
      const existing = await client.readActiveFile();
      await client.writeActiveFile(args.content + '\n' + existing);
    } else {
      await client.writeActiveFile(args.content);
    }

    return {
      success: true,
      data: {
        mode,
        message: `Active file ${mode}d successfully`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

**Tool Schemas:**
```typescript
// read_active_file
{
  name: 'read_active_file',
  description: 'Read content of the currently active/open file in Obsidian. No path needed. Use when user says "this file", "current file", "open file".',
  inputSchema: {
    type: 'object',
    properties: {},
  },
}

// edit_active_file
{
  name: 'edit_active_file',
  description: 'Edit the currently active file using pattern matching. No path needed. Use when user says "edit this file".',
  inputSchema: {
    type: 'object',
    properties: {
      old_string: { type: 'string', description: 'Exact text to replace' },
      new_string: { type: 'string', description: 'Replacement text' },
      replace_all: { type: 'boolean', description: 'Replace all occurrences' }
    },
    required: ['old_string', 'new_string'],
  },
}

// patch_active_file
{
  name: 'patch_active_file',
  description: 'Patch structured content in active file (headings/frontmatter/blocks). No path needed.',
  inputSchema: {
    type: 'object',
    properties: {
      operation: { type: 'string', enum: ['append', 'prepend', 'replace'] },
      target_type: { type: 'string', enum: ['heading', 'block', 'frontmatter'] },
      target: { type: 'string', description: 'Target identifier' },
      content: { type: 'string', description: 'Content to insert/replace' }
    },
    required: ['operation', 'target_type', 'target', 'content'],
  },
}

// write_active_file
{
  name: 'write_active_file',
  description: 'Write to active file. No path needed. Modes: overwrite (replace all), append (add to end), prepend (add to beginning).',
  inputSchema: {
    type: 'object',
    properties: {
      content: { type: 'string', description: 'Content to write' },
      mode: { type: 'string', enum: ['overwrite', 'append', 'prepend'], description: 'Write mode (default: overwrite)' }
    },
    required: ['content'],
  },
}
```

**Tests:**
```typescript
// read_active_file: Test 1-2
// edit_active_file: Test 3-6
// patch_active_file: Test 7-10
// write_active_file: Test 11-14
```

**Impact:**
- ✅ 50% réduction tokens (pas besoin find path)
- ✅ UX naturelle ("edit this file")
- ✅ Moins d'erreurs (pas de path invalide)

**Effort:** 3h (120 lignes code + 40 lignes tests)

**Risque:** 🟢 Faible (API stable core)

**Priorité:** 🟡 **IMPORTANT** (après Phase 1)

---

### Phase 3: Fonctionnalités Avancées ⏰

**Objectif:** Optimisations supplémentaires

#### 3.1 Partial Read File

**Outil modifié:** `read_file`

**API étendue:**
```typescript
read_file({
  path: string,
  offset?: number,    // Ligne de début
  limit?: number      // Nombre de lignes
})
```

**Use case:**
```typescript
// Lire lignes 100-120 d'un gros fichier
read_file({
  path: "large-file.md",
  offset: 100,
  limit: 20
})
// Au lieu de lire 5000 lignes complètes
```

**Impact:**
- ✅ 94% réduction tokens pour grands fichiers
- ✅ Preview rapide de sections

**Effort:** 2h

**Priorité:** ⏰ **OPTIONNEL** (v1.2)

---

#### 3.2 List Tags (Attendre PR #199)

**Condition:** Attendre merge de PR #199

**Outil nouveau:** `list_tags`

**API:**
```typescript
list_tags()  // Retourne tous les tags du vault
```

**Use case:**
- Suggestions tags pour nouvelles notes
- Exploration vault

**Effort:** 1h (après merge PR)

**Priorité:** ⏳ **EN ATTENTE** (v1.3+)

---

#### 3.3 Commands API

**Outils nouveaux:**
- `list_commands` - Liste commandes disponibles
- `execute_command` - Exécute commande Obsidian

**Use cases:**
- Automatisation workflows
- Intégration templates
- Export PDF

**Effort:** 3h

**Priorité:** ⏰ **OPTIONNEL** (v2.0)

---

#### 3.4 Periodic Notes

**Outils nouveaux:**
- `get_daily_note` - Note du jour
- `create_periodic_note` - Créer note périodique

**Use cases:**
- Journaling automatisé
- Notes hebdo/mensuelles

**Effort:** 4h

**Priorité:** ⏰ **OPTIONNEL** (v2.0, si demandé users)

---

## ⚠️ Risques & Mitigations

### Risque 1: edit_file - Unicité old_string 🟡

**Description:** old_string peut apparaître plusieurs fois

**Impact:** Échec édition, retry AI nécessaire

**Probabilité:** Moyenne (30%)

**Mitigation:**
1. Messages d'erreur détaillés:
   ```
   Found 5 occurrences. Either:
   1. Use replace_all=true, OR
   2. Include more context in old_string
   ```
2. Documentation claire avec exemples
3. Flag `replace_all` bien documenté

**Sévérité après mitigation:** 🟢 Faible

---

### Risque 2: PATCH API - Target not found 🟢

**Description:** Heading/block spécifié n'existe pas

**Impact:** Erreur retournée par API Obsidian

**Probabilité:** Faible (10%)

**Mitigation:**
1. Erreur propagée clairement à AI
2. AI retry avec target différent
3. Suggestion: "Use find_files or read_file to verify target exists"

**Sévérité après mitigation:** 🟢 Très faible

---

### Risque 3: Search API - Regex invalide 🟢

**Description:** Query regex malformée

**Impact:** Erreur API

**Probabilité:** Faible (5%)

**Mitigation:**
1. Try-catch dans tool
2. Message clair: "Invalid regex pattern"
3. Fallback: recherche littérale

**Sévérité après mitigation:** 🟢 Très faible

---

### Risque 4: Active File - Aucun fichier ouvert ⚠️

**Description:** User n'a pas de fichier actif dans Obsidian

**Impact:** Erreur 404 ou vide

**Probabilité:** Moyenne (20%)

**Mitigation:**
1. Erreur claire: "No active file. Please open a file in Obsidian."
2. Documentation: "Works only when a file is open in Obsidian"
3. Fallback suggestion: "Use regular edit_file with path instead"

**Sévérité après mitigation:** 🟢 Faible

---

### Risque 5: Breaking Changes - Backward Compat 🟢

**Description:** Nouvelles fonctionnalités cassent ancien code

**Impact:** Régression

**Probabilité:** Très faible (2%)

**Mitigation:**
1. Tous les anciens tools inchangés
2. Nouveaux tools = ajouts purs
3. Tests de régression complets
4. Versioning sémantique strict

**Sévérité après mitigation:** 🟢 Très faible

---

### Risque 6: Performance Régression 🟢

**Description:** Nouvelles features dégradent perfs

**Impact:** Latence accrue

**Probabilité:** Très faible (1%)

**Mitigation:**
1. Benchmarks avant/après
2. Cache existant préservé
3. Tests performance automatisés
4. Rollback plan si régression >10%

**Sévérité après mitigation:** 🟢 Très faible

---

## 📊 Timeline & Effort

### Phase 0: Correctifs Critiques

| Tâche | Effort | Priorité | Risque |
|-------|--------|----------|--------|
| 0.1 Fix Search API | 2h | 🔴 CRITIQUE | 🟢 Faible |
| **Total Phase 0** | **2h** | - | - |

**Délai:** 1 jour

---

### Phase 1: Token Optimization Core

| Tâche | Effort | Priorité | Risque |
|-------|--------|----------|--------|
| 1.1 edit_file | 4h | 🔥 URGENT | 🟡 Moyen |
| 1.2 patch_file | 4h | 🔥 URGENT | 🟢 Faible |
| 1.3 write_file prepend | 1h | 🟡 BONUS | 🟢 Faible |
| Tests intégration | 1h | 🔥 URGENT | - |
| **Total Phase 1** | **10h** | - | - |

**Délai:** 2 jours

---

### Phase 2: Active File Support

| Tâche | Effort | Priorité | Risque |
|-------|--------|----------|--------|
| 2.1 Active File Tools (x4) | 3h | 🟡 IMPORTANT | 🟢 Faible |
| Tests | 1h | 🟡 IMPORTANT | - |
| **Total Phase 2** | **4h** | - | - |

**Délai:** 1 jour

---

### Phase 3: Fonctionnalités Avancées (Optionnel)

| Tâche | Effort | Priorité | Risque |
|-------|--------|----------|--------|
| 3.1 Partial read_file | 2h | ⏰ OPTIONNEL | 🟢 Faible |
| 3.2 list_tags (après PR) | 1h | ⏳ EN ATTENTE | 🟢 Faible |
| 3.3 Commands API | 3h | ⏰ OPTIONNEL | 🟢 Faible |
| 3.4 Periodic Notes | 4h | ⏰ OPTIONNEL | 🟢 Faible |
| **Total Phase 3** | **10h** | - | - |

**Délai:** 2 jours (si tout implémenté)

---

### Documentation & Release

| Tâche | Effort | Priorité |
|-------|--------|----------|
| Mise à jour README.md | 1h | 🔥 URGENT |
| Mise à jour TECHNICAL.md | 1h | 🔥 URGENT |
| CHANGELOG.md | 0.5h | 🔥 URGENT |
| Exemples d'usage | 0.5h | 🟡 IMPORTANT |
| **Total Doc** | **3h** | - |

---

### TOTAL EFFORT

| Phase | Effort | Statut |
|-------|--------|--------|
| Phase 0 (Critique) | 2h | 🔴 Obligatoire |
| Phase 1 (Core) | 10h | 🔴 Obligatoire |
| Phase 2 (Active) | 4h | 🟡 Recommandé |
| Phase 3 (Avancé) | 10h | ⏰ Optionnel |
| Documentation | 3h | 🔴 Obligatoire |
| **MINIMUM VIABLE** | **15h** | Phase 0+1+Doc |
| **RECOMMANDÉ** | **19h** | Phase 0+1+2+Doc |
| **COMPLET** | **29h** | Toutes phases |

---

## 🎯 Ordre d'Exécution Recommandé

### Sprint 1 (6h) - Fondations Critiques
1. **Phase 0:** Fix Search (2h) 🔴
2. **Phase 1.1:** edit_file (4h) 🔥

**Livrables:** Search optimisé + edit_file fonctionnel

**Impact immédiat:**
- 95% performance search
- 98% réduction tokens édition

---

### Sprint 2 (5h) - Compléter Core
1. **Phase 1.2:** patch_file (4h) 🔥
2. **Tests intégration** (1h) 🔥

**Livrables:** Suite complète édition + tests

**Impact immédiat:**
- Édition structurée native
- Frontmatter support

---

### Sprint 3 (4h) - Active File
1. **Phase 2:** Active File Tools (3h) 🟡
2. **Tests** (1h) 🟡

**Livrables:** Support fichier actif

**Impact immédiat:**
- 50% réduction tokens contexte actif
- UX améliorée

---

### Sprint 4 (3h) - Documentation & Release
1. **Documentation** (3h) 🔴
2. **Release v1.1.0**

**Livrables:**
- README, TECHNICAL, CHANGELOG mis à jour
- Release GitHub + npm

---

### Sprints Optionnels (10h+)
- **Phase 3:** Features avancées selon besoins
- **Phase 3.2:** Attendre merge PR #199 pour tags

---

## 📈 Métriques de Succès

### KPIs Phase 0 (Search)
- ✅ Temps recherche: <200ms (actuellement 2-3s)
- ✅ API calls search: 1 (actuellement 1000+)
- ✅ Tests passent: 100%

### KPIs Phase 1 (Token Optimization)
- ✅ Tokens AI édition: <500 (actuellement 10,000)
- ✅ Réduction tokens: >95%
- ✅ Taux succès edit_file: >90%
- ✅ Tests coverage: >80%

### KPIs Phase 2 (Active File)
- ✅ Tokens AI (edit actif): <300 (actuellement 1000+)
- ✅ API calls: 1 (actuellement 3-4)
- ✅ Tests passent: 100%

### KPIs Globaux
- ✅ Aucune régression performance
- ✅ Backward compatibility: 100%
- ✅ Documentation complète
- ✅ Zero breaking changes

---

## 🔄 Stratégie de Release

### v1.1.0 - Token Optimization (Recommandé)

**Inclut:**
- Phase 0 (Search fix)
- Phase 1 (edit_file + patch_file)
- Documentation

**Changelog:**
```markdown
## v1.1.0 - Token Optimization (2025-11-XX)

### 🚀 New Features
- **edit_file**: Surgical file editing with pattern matching (98% token reduction)
- **patch_file**: Native structured editing (headings/frontmatter/blocks)
- **write_file**: Added prepend mode

### 🔧 Improvements
- **search**: Now uses native /search/simple/ API (95% faster)
- API calls reduced by 99% for search operations

### 📊 Performance
- Search: 2-3s → 100ms (95% improvement)
- Edit tokens: 10,000 → 200 (98% reduction)

### 🐛 Bug Fixes
- None (pure feature additions)

### ⚠️ Breaking Changes
- None (backward compatible)
```

---

### v1.2.0 - Active File Support (Optionnel)

**Inclut:**
- Phase 2 (Active file tools)

**Changelog:**
```markdown
## v1.2.0 - Active File Support (2025-11-XX)

### 🚀 New Features
- **read_active_file**: Read currently open file (no path needed)
- **edit_active_file**: Edit active file with pattern matching
- **patch_active_file**: Patch structured content in active file
- **write_active_file**: Write to active file with modes

### 📊 Performance
- Active file operations: 50% token reduction (no path lookup needed)
- API calls reduced by 75% for active file workflows

### ⚠️ Breaking Changes
- None (backward compatible)
```

---

### v1.3.0+ - Advanced Features (Futur)

**Inclut:**
- Phase 3 (Partial read, tags, commands, etc.)

**À déterminer** selon feedback utilisateurs

---

## 📝 Checklist Pré-Release

### Code
- [ ] Phase 0: Search fix implémenté
- [ ] Phase 1.1: edit_file implémenté + testé
- [ ] Phase 1.2: patch_file implémenté + testé
- [ ] Phase 1.3: write_file prepend ajouté
- [ ] Tous les tests passent (npm run test)
- [ ] TypeScript compile sans erreurs (npx tsc --noEmit)
- [ ] Aucune régression (tests anciens tools)

### Documentation
- [ ] README.md mis à jour (nouveaux tools)
- [ ] TECHNICAL.md mis à jour (specs API)
- [ ] CHANGELOG.md complété
- [ ] Exemples d'usage ajoutés
- [ ] ROADMAP.md mis à jour (marquer v1.1 comme complété)

### Tests
- [ ] Tests unitaires edit_file (8 tests min)
- [ ] Tests unitaires patch_file (8 tests min)
- [ ] Tests intégration Phase 0+1
- [ ] Tests performance (benchmarks search)
- [ ] Tests backward compatibility

### Quality
- [ ] Code review complet
- [ ] Pas de console.log debug restants
- [ ] Gestion erreurs robuste
- [ ] Messages erreurs clairs pour AI

### Release
- [ ] Version bump package.json
- [ ] Git tag créé
- [ ] npm publish
- [ ] GitHub release notes
- [ ] Annonce communauté (si applicable)

---

## 🔗 Références

### Documentation Obsidian Local REST API
- **OpenAPI Spec:** https://coddingtonbear.github.io/obsidian-local-rest-api/openapi.yaml
- **GitHub Repo:** https://github.com/coddingtonbear/obsidian-local-rest-api
- **Releases:** https://github.com/coddingtonbear/obsidian-local-rest-api/releases

### Versions API Clés
- **v3.2.0** (Mai 2024): /openapi.yaml endpoint
- **v3.1.0** (Mars 2024): Periodic notes dates arbitraires
- **v3.0.1** (Nov 2023): PATCH v2 (heading/block/frontmatter)

### PRs à Surveiller
- **#199** - Tags endpoint (nov 2025) - Attendre merge
- **#195** - HTML rendering (nov 2025) - Évaluer intérêt
- **#191** - File move (oct 2025) - Discussions en cours

### Autres Serveurs MCP (Référence)
- mcp-obsidian: https://github.com/MarkusPfundstein/mcp-obsidian
- obsidian-mcp-rest: https://github.com/PublikPrinciple/obsidian-mcp-rest

---

## 📞 Contact & Questions

Pour questions sur cette implémentation:
1. Créer issue GitHub
2. Référencer ce document: `IMPLEMENTATION_PLAN.md`
3. Taguer avec label approprié: `enhancement`, `question`, `help wanted`

---

**Document Version:** 1.0
**Dernière mise à jour:** 2025-11-14
**Auteur:** Claude (AI Assistant)
**Statut:** ✅ Ready for Implementation
