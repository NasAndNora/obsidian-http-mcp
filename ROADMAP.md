# Obsidian HTTP MCP Server - Roadmap

**Last Updated**: 2025-11-02

---

## 🎯 Vision & Goals

**Mission**: Become the standard HTTP-native MCP server for Obsidian, solving stdio bugs for 10,000+ users.

**Key Results** (6 months):

1. 1000+ GitHub stars
2. 5000+ weekly npm downloads
3. Top result for "obsidian mcp claude code"
4. Community-driven feature development

---

## 📅 Release Timeline

### v1.0 - MVP (Week 1) ⏳ IN PROGRESS

**Goal**: Launch with core features, 0 bugs

**Features**:

- ✅ HTTP server with MCP endpoint
- ✅ 7 core tools (list/read/write/search/move/delete)
- ✅ CLI with configuration
- ✅ Environment variable support
- ✅ Complete documentation

**Success Metrics**:

- Installs without errors
- Connects to Claude Code CLI
- All tools work correctly
- 10+ GitHub stars

**Timeline**: 3 hours (2025-11-02)

---

### v1.1 - Refinements (Week 2)

**Goal**: Polish UX, add missing features

**Features**:

- [ ] Frontmatter tools (`get_frontmatter`, `set_frontmatter`)
- [ ] Tag tools (`add_tags`, `remove_tags`, `list_tags`)
- [ ] Better error messages
- [ ] Auto-detect Obsidian REST API URL
- [ ] `--debug` flag for verbose logs

**Success Metrics**:

- 50+ GitHub stars
- 100+ npm downloads
- 0 bug reports

**Timeline**: 1 week

---

### v1.2 - Developer Experience (Week 3-4)

**Goal**: Make it easier to contribute and debug

**Features**:

- [ ] Web UI for testing tools (localhost:3000/ui)
- [ ] Interactive setup wizard
- [ ] Docker support
- [ ] Test suite (unit + integration)
- [ ] CI/CD pipeline

**Success Metrics**:

- 2+ community PRs merged
- 100% test coverage on tools
- 200+ npm downloads/week

**Timeline**: 2 weeks

---

### v2.0 - Advanced Features (Month 2)

**Goal**: Go beyond basic file ops

**Features**:

- [ ] **Semantic search** (embeddings-based)
- [ ] **Graph tools** (backlinks, forward links)
- [ ] **Batch operations** (bulk move/delete/tag)
- [ ] **Template support** (Templater integration)
- [ ] **Daily notes helper** (auto-create, navigate)

**Success Metrics**:

- 300+ GitHub stars
- 1000+ npm downloads/week
- Featured in 5+ blog posts

**Timeline**: 3 weeks

---

### v2.1 - Performance (Month 3)

**Goal**: Handle large vaults (10,000+ notes)

**Features**:

- [ ] In-memory vault cache
- [ ] Incremental indexing
- [ ] Parallel tool execution
- [ ] Response streaming for large files

**Success Metrics**:

- < 50ms avg tool response time
- Handles 10k+ note vaults
- 500+ GitHub stars

**Timeline**: 2 weeks

---

### v3.0 - Plugin Mode (Month 4)

**Goal**: Run as Obsidian Community Plugin

**Features**:

- [ ] Plugin version (no external server)
- [ ] Submit to Obsidian Community Plugins
- [ ] Unified codebase (CLI + Plugin)
- [ ] Settings UI in Obsidian

**Success Metrics**:

- Approved in Community Plugins
- 1000+ GitHub stars
- 10,000+ plugin downloads

**Timeline**: 4 weeks

---

### v3.1 - Ecosystem (Month 5-6)

**Goal**: Build integrations and community

**Features**:

- [ ] VS Code extension (quick access)
- [ ] Raycast extension
- [ ] Obsidian Sync support
- [ ] Public MCP registry listing
- [ ] Video tutorials

**Success Metrics**:

- 20+ community contributors
- 100+ dependent projects
- 5000+ weekly npm downloads

**Timeline**: 6 weeks

---

## 🔮 Future Ideas (Backlog)

### Performance

- [ ] GraphQL-style batch queries
- [ ] WebSocket real-time updates
- [ ] Edge caching for search

### Features

- [ ] AI-powered note summarization
- [ ] Automatic tagging suggestions
- [ ] Duplicate note detection
- [ ] Note merge tool
- [ ] Export to other formats (PDF, HTML)

### Integrations

- [ ] Dataview query support
- [ ] Excalidraw diagram access
- [ ] Canvas file manipulation
- [ ] Tasks plugin integration

### Platform

- [ ] Web version (SaaS option)
- [ ] Mobile support (iOS/Android)
- [ ] Desktop app (Electron)

---

## 🚧 Known Limitations & Future Work

### Current Limitations (v1.0)

1. **No concurrent requests** - Tools run sequentially
2. **No caching** - Each request hits Obsidian API
3. **Limited search** - Text only, no semantic
4. **No real-time sync** - Polling required for changes

### Planned Solutions

- v1.2: Add request queuing
- v2.1: Implement caching layer
- v2.0: Add semantic search
- v3.1: WebSocket for real-time

---

## 📊 Metrics Tracking

### Key Performance Indicators (KPIs)

| Metric | Current | v1.0 Target | v2.0 Target | v3.0 Target |
|--------|---------|-------------|-------------|-------------|
| GitHub Stars | 0 | 10 | 300 | 1000 |
| npm Downloads/week | 0 | 50 | 1000 | 5000 |
| Active Users | 0 | 20 | 500 | 2000 |
| Contributors | 1 | 1 | 5 | 20 |
| Issues Resolved | 0 | 5 | 50 | 200 |

### Quality Metrics

| Metric | Target |
|--------|--------|
| Test Coverage | 80%+ |
| Avg Response Time | < 100ms |
| Uptime | 99.9% |
| Bug Reports | < 5/month |

---

## 🤝 How to Contribute

See [CONTRIBUTING.md](./CONTRIBUTING.md)

**Priority Areas**:

1. Bug reports and fixes
2. Documentation improvements
3. New tool implementations
4. Performance optimizations

---

## 📣 Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas
- **npm**: Package releases
- **Reddit**: r/ObsidianMD announcements
- **Twitter**: @obsidian_http_mcp (planned)

---

**Maintained by**: Claude (AI Assistant)
**License**: MIT
**Status**: 🟢 Active Development
