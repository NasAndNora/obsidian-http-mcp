# SUIVI - Obsidian HTTP MCP

**Dernière mise à jour**: 2025-11-02

## Problème initial

Tous les MCP Obsidian existants utilisent stdio → BrokenPipeError avec Claude Code CLI bug #3071.

## Solution implémentée

**Serveur MCP HTTP-natif** utilisant le SDK officiel:

- Express + `StreamableHTTPServerTransport` (@modelcontextprotocol/sdk v1.20.2)
- Pattern stateless (nouveau transport par requête)
- 7 tools: list_dir, list_files, read_file, write_file, search, move_file, delete_file

## Code clé (src/server/http.ts)

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

const mcpServer = new Server({
  name: 'obsidian-http',
  version: '1.0.0',
}, {
  capabilities: { tools: {} }
});

// Enregistrer tools
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [/* 7 tools */]
}));

// Endpoint MCP
app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });
  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, req.body);
});
```

## Status final ✅ FONCTIONNEL

**Tests validés**:
- ✅ Build: `npm run build` OK
- ✅ Serveur: Port 3000 (écoute sur 0.0.0.0)
- ✅ MCP Initialize: Handshake fonctionne
- ✅ tools/list: 7 tools exposés
- ✅ Claude CLI: Connected et tools accessibles dans `/mcp`
- ✅ Integration Obsidian: list_files, read_file testés OK

**Installation**:

```bash
# Setup
npm install
cp .env.example .env
# Éditer .env avec ta clé API Obsidian

# Lancer serveur
npm run dev

# Ajouter à Claude CLI
claude mcp add -s user --transport http obsidian-http http://localhost:3000/mcp

# Vérifier
claude mcp list
# → obsidian-http: http://localhost:3000/mcp (HTTP) - ✓ Connected
```

## Points critiques découverts

### 1. Header Accept requis
**Requis**: `Accept: application/json, text/event-stream`
Sans, erreur: "Not Acceptable: Client must accept both..."

### 2. Trailing slash pour directories (IMPORTANT)
**API Obsidian nécessite**:
- ✅ Directories: `BUSINESS/` (avec slash)
- ✅ Files: `Notes/meeting.md` (sans slash)

**Solution**: Descriptions explicites dans tool schemas pour guider Claude automatiquement.

### 3. Configuration multi-plateforme

**Windows (Obsidian + Serveur MCP)**:
```env
OBSIDIAN_BASE_URL=http://127.0.0.1:27123
```

**WSL2 (Dev + Claude CLI)**:
```typescript
app.listen(3000, '0.0.0.0')  // Écoute sur toutes interfaces
```
```bash
claude mcp add [...] http://172.19.32.1:3000/mcp  # IP Windows depuis WSL2
```

### 4. Node_modules cross-platform
**Attention**: Réinstaller `npm install` après clone entre WSL2↔Windows (binaires natifs différents).

## Environnement validé

- **Dev**: WSL2 ou Windows
- **Obsidian**: Windows (port 27123)
- **MCP Server**: Windows (port 3000, écoute 0.0.0.0)
- **Claude CLI**: WSL2 (appelle 172.19.32.1:3000)
- **Stack**: Node.js 18+, TypeScript, Express, axios
