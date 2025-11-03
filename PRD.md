# Obsidian HTTP MCP Server - Product Requirements Document (PRD)

**Version**: 1.0
**Date**: 2025-11-02
**Status**: Active Development

---

## 🎯 Vision

**Create the only HTTP-native MCP server for Obsidian that solves the stdio bug plaguing Claude Code CLI users.**

### Success Metrics

1. **GitHub Stars**: 10+ (quality over quantity)
2. **npm Downloads**: 20+ weekly
3. **User Satisfaction**: 0 critical bugs
4. **Adoption**: Works out-of-box for 80% users

---

## 🧩 Problem Statement

### Current Pain Points

1. **All 150+ Obsidian MCP servers use stdio**
   - Triggers Claude Code CLI bug #3071
   - BrokenPipeError on connection
   - Users frustrated, abandon MCP

2. **Workarounds are complex**
   - `mcp-remote` bridges add complexity
   - Manual bridging configs confuse users
   - No official solution

3. **Market Gap**
   - Zero HTTP-native Obsidian MCP exists
   - Huge demand (Claude Code CLI user base growing)

---

## 👥 Target Users

### Primary Personas

1. **Claude Code CLI Power User**
   - Uses Claude daily for coding
   - Has Obsidian vault for notes
   - Hit stdio bug, looking for solution

2. **Multi-LLM Developer**
   - Uses Claude + Codex + Gemini
   - Wants unified Obsidian access
   - Values stability over features

3. **Knowledge Worker**
   - Non-technical Obsidian user
   - Wants AI to read/write notes
   - Needs simple installation

---

## 🏆 Core Value Propositions

1. **It Actually Works** - No stdio bugs, period
2. **Dead Simple** - 3 commands to install and run
3. **Universal** - Works with any MCP client (Claude/Codex/Gemini)
4. **Fast** - HTTP is faster than stdio pipes
5. **Maintainable** - Clean architecture, TypeScript, documented

---

## ✨ Features

### MVP (v1.0) ✅ COMPLETED

#### MCP Tools (9 total)

1. **list_dir** - List directories
2. **list_files** - List files in directory
3. **find_files** - Search files by name (fuzzy matching, 60s cache)
4. **read_file** - Read file content
5. **write_file** - Create/update file (modes: create/overwrite/append)
6. **search** - Search text in vault (grep-like + regex, recursive)
7. **move_file** - Move/rename file
8. **delete_file** - Delete file (soft delete by default to `.trash-http-mcp/`)
9. **delete_folder** - Delete folder recursively (soft delete by default)

#### Server Requirements

- HTTP server on configurable port (default: 3000)
- `/mcp` endpoint implementing MCP protocol
- `/health` endpoint for monitoring
- Environment variable configuration
- CLI with `--help`, `--version`, `--port`, `--api-key`

#### Quality Requirements

- **Performance**: < 100ms response time per tool call
- **Reliability**: 99.9% uptime (no crashes)
- **Security**: API key validation, no vault exposure
- **Compatibility**: Node.js 18+, Obsidian REST API 3.0+

### v1.0.1 - Next Priority

**Multi-vault Support** - Manage multiple Obsidian vaults from single server instance

See [ROADMAP.md](./ROADMAP.md) for detailed v1.1+ features (community-driven)

---

## 🎨 User Experience

### Installation Flow

```bash
User → npm install -g obsidian-http-mcp
     → Get API key from Obsidian
     → obsidian-http-mcp --api-key XXX
     → Add to ~/.claude.json
     → claude mcp list
     → ✓ Connected!
```

**Time to value**: < 5 minutes

### Error Handling

- Clear error messages with fix suggestions
- Auto-detect common misconfigurations
- Helpful logs (not verbose unless --debug)

---

## 🏗️ Technical Architecture

### Stack

- **Language**: TypeScript (type safety + maintainability)
- **Runtime**: Node.js (compatibility with npm ecosystem)
- **HTTP Server**: Express (MCP SDK compatible)
- **MCP SDK**: @modelcontextprotocol/sdk v1.20.2 (official, StreamableHTTPServerTransport)
- **HTTP Client**: axios (Obsidian REST API calls)
- **Protocol**: Streamable HTTP (MCP spec 2025-03-26)

### Project Structure

```text
src/
├── index.ts          # Server entry point
├── cli.ts            # CLI argument parsing
├── client/
│   └── obsidian.ts   # Obsidian REST API client
├── server/
│   └── http.ts       # HTTP + MCP endpoint
├── tools/
│   ├── list.ts       # list_dir + list_files
│   ├── read.ts       # read_file
│   ├── write.ts      # write_file
│   ├── search.ts     # search
│   ├── move.ts       # move_file
│   └── delete.ts     # delete_file
├── types/
│   └── index.ts      # Shared types
└── utils/
    └── config.ts     # Config loading
```

### API Design

#### Obsidian REST API Integration

- Base URL: `http://127.0.0.1:27123`
- Auth: API key in `Authorization` header
- Endpoints used:
  - `GET /vault/` - List files
  - `GET /vault/{path}` - Read file
  - `POST /vault/{path}` - Write file
  - `PATCH /vault/{path}` - Update file
  - `DELETE /vault/{path}` - Delete file

---

## 🚦 Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Obsidian REST API changes | High | Low | Pin compatible version, add version check |
| MCP protocol changes | Medium | Medium | Use official SDK, monitor updates |
| Competition launches HTTP MCP | Low | Low | First-mover advantage, quality focus |
| Performance issues at scale | Medium | Low | Implement caching, optimize queries |

---

## 📊 Success Criteria

### v1.0 Launch ✅ ACHIEVED

- ✅ 0 critical bugs
- ✅ Works with Claude Code CLI
- ✅ Complete documentation
- ⏳ 10+ GitHub stars (pending publish)

### Growth Targets

See [ROADMAP.md](./ROADMAP.md) for detailed metrics (quality over quantity approach)

---

## 🗓️ Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed timeline.

---

**Product Owner**: Claude (AI Assistant)
**Stakeholder**: User (GitHub stars + experience benefit)
**Approval Status**: ✅ Approved for development
