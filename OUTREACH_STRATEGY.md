# MCP Listicles Outreach Strategy

**Goal**: Get obsidian-http-mcp featured in "Best MCP Servers 2025" listicles and directories

**Date Created**: 2025-11-03

---

## 🎯 Target Sites (Priority Order)

### 1. **Glama.ai** ⭐⭐⭐ ULTRA-PRIORITY

- **URL**: <https://glama.ai/mcp/servers>
- **Type**: Largest MCP directory (9,000+ servers indexed)
- **Features**: One-click deployment, hosting, ranking, isolated VMs
- **Action**: Click "Add Server" → configure Dockerfile → auto-deploy
- **Contact**: Web UI submission form
- **Priority**: 🔥🔥🔥 HIGHEST - Biggest registry + hosting platform

### 2. **Smithery.ai** ⭐⭐ CRITICAL

- **URL**: <https://smithery.ai/>
- **Type**: Central hub with official SDK (2,373-4,000+ tools)
- **Features**: Standardized interfaces, CLI installer, TypeScript/Python SDK
- **Action**: Create GitHub repo + smithery.yaml config + SDK integration
- **Docs**: <https://github.com/smithery-ai/docs>
- **Priority**: 🔥🔥 HIGHEST - Official hub, enterprise adoption

### 3. **GitHub Official MCP Registry** ⭐⭐ CRITICAL

- **URL**: <https://github.com/modelcontextprotocol/registry>
- **Type**: Official Anthropic/GitHub registry
- **Integration**: Copilot JetBrains/Eclipse/Xcode
- **Action**: Use CLI tool for publishing (`make build`)
- **Priority**: 🔥🔥 HIGHEST - Official source, enterprise visibility

### 4. **PulseMCP** ⭐ HIGH PRIORITY

- **URL**: <https://www.pulsemcp.com/servers>
- **Type**: Automated MCP directory (6,490+ servers, updated daily)
- **Current Status**: Has "Obsidian Notes" category but lists other servers
- **Action**: Auto-discovery via npm publish (24-48h)
- **Priority**: 🔥 HIGH - Daily traffic, auto-indexing

### 5. **Awesome MCP Servers (punkpeye)**

- **URL**: <https://github.com/punkpeye/awesome-mcp-servers>
- **Maintainer**: [@punkpeye](https://github.com/punkpeye)
- **Stars**: 67.2k ⭐ (MASSIVE visibility)
- **Type**: Curated GitHub awesome list
- **Action**: Submit PR to add obsidian-http-mcp
- **Priority**: 🔥 HIGH - Most starred MCP resource

### 6. **MCPMarket.com**

- **URL**: <https://mcpmarket.com/>
- **Type**: Daily updated "Top MCP Servers" leaderboard
- **Action**: Auto-discovery via npm publish
- **Priority**: 🔥 HIGH - Daily traffic, SEO juice

### 7. **MCP Server Finder**

- **URL**: <https://www.mcpserverfinder.com/>
- **Type**: Directory with guides, compatibility checks, reviews
- **Features**: Step-by-step guides, troubleshooting resources
- **Action**: Submit via their discovery system (likely npm-based)
- **Priority**: MEDIUM - Education/onboarding focus

### 8. **ClaudeLog.com Awesome MCP Servers**

- **URL**: <https://www.claudelog.com/claude-code-mcps/awesome-mcp-servers/>
- **Type**: Mirror of punkpeye's awesome list with web interface
- **Action**: Will auto-sync once added to punkpeye's repo
- **Priority**: LOW (automatic once #5 done)

### 9. **Sean Kochel (YouTube - 24k subs)**

- **Platform**: YouTube + Twitter/X
- **Video**: "9 MCP Servers That'll Make Vibe Coders Cry Tears Of Joy" (42k views)
- **Twitter**: [@IAmSeanKochel](https://x.com/IAmSeanKochel)
- **Action**: DM on Twitter with demo + unique value prop
- **Priority**: MEDIUM (influencer reach)

### 10. **ClickUp Blog**

- **URL**: <https://clickup.com/blog/hub/ai/mcp/best-servers/>
- **Article**: "Best MCP Servers for Agentic AI Beginners"
- **Contact**: Corporate blog (no individual author contact)
- **Action**: Use ClickUp support/marketing contact form
- **Priority**: LOW (hard to reach, corporate)

---

## 🎁 Unique Value Props (Why We Deserve Inclusion)

### Key Differentiators

1. **ONLY HTTP-native Obsidian MCP** - 150+ stdio-based servers fail with Claude Code CLI bug #3071
2. **Proven solution** - Solves BrokenPipeError plaguing entire ecosystem
3. **Universal compatibility** - Works with Claude Code CLI, Claude Desktop, Codex, Gemini
4. **Performance** - <200ms response, 70% fewer API calls via intelligent cache
5. **Production-ready** - 9 tools, soft delete, fuzzy search, emoji support
6. **Open source** - MIT license, clean TypeScript architecture

### Stats (For Pitches)

- 9 MCP tools implemented
- <200ms avg response time
- 70% fewer API calls (intelligent cache)
- Soft delete protection (`.trash-http-mcp/`)
- Fuzzy search with Levenshtein distance
- Emoji/special character support

---

## 📝 Pitch Templates

### Template 1: GitHub PR (Awesome MCP Servers)

```markdown
## Add obsidian-http-mcp - First HTTP-native Obsidian MCP Server

### Description
The first and only HTTP-native MCP server for Obsidian that solves the stdio bug (#3071) plaguing 150+ existing Obsidian MCP servers. Works seamlessly with Claude Code CLI, Claude Desktop, Codex, and Gemini.

### Category
📝 Notes / 🗄️ Databases (whichever fits your structure)

### Key Features
- HTTP-native (bypasses stdio BrokenPipeError completely)
- 9 tools: list_dir, list_files, find_files, read_file, write_file, search, move_file, delete_file, delete_folder
- Performance: <200ms response, 70% fewer API calls via intelligent cache
- Smart fuzzy search (emoji/special char support)
- Safe soft delete (`.trash-http-mcp/`)
- Universal compatibility (Claude CLI/Desktop, Codex, Gemini)

### Links
- npm: https://www.npmjs.com/package/obsidian-http-mcp
- GitHub: https://github.com/[your-username]/obsidian-http-mcp
- Solves: https://github.com/anthropics/claude-code/issues/3071

### Installation

```bash
npm install -g obsidian-http-mcp
```

**Why this matters**: This is the ONLY working HTTP-native solution for Obsidian MCP on Claude Code CLI. Every other server (150+) uses stdio and hits the BrokenPipeError bug.

---

### Template 2: Twitter DM (Sean Kochel)

```text

Hey Sean! Loved your "9 MCP Servers" video (42k views 🔥).

Built something you might find interesting: obsidian-http-mcp - the FIRST HTTP-native Obsidian MCP that actually works with Claude Code CLI.

Solves the stdio bug (#3071) that breaks 150+ existing Obsidian servers.

Key features:

- HTTP-native (no BrokenPipeError)
- <200ms response, 70% fewer API calls
- 9 tools (fuzzy search, soft delete, emoji support)
- Works with Claude CLI/Desktop, Codex, Gemini

npm: <https://www.npmjs.com/package/obsidian-http-mcp>

Would love to hear your thoughts! Think it'd fit in a future video? Happy to chat more or demo it.

- Nas

```

---

### Template 3: Smithery.ai Submission (smithery.yaml)

**File**: `smithery.yaml` (root of repo)

```yaml
name: obsidian-http-mcp
version: 1.0.0
description: First HTTP-native MCP server for Obsidian - solves stdio bug #3071
author: [your-username]
repository: https://github.com/[your-username]/obsidian-http-mcp
license: MIT

# Docker configuration for Smithery hosting
docker:
  build: .
  port: 3000

# Environment variables required
env:
  - OBSIDIAN_API_KEY
  - OBSIDIAN_BASE_URL
  - PORT

# MCP capabilities
capabilities:
  tools:
    - list_dir
    - list_files
    - find_files
    - read_file
    - write_file
    - search
    - move_file
    - delete_file
    - delete_folder

tags:
  - obsidian
  - notes
  - knowledge-management
  - http-native
  - claude-code
```

---

### Template 4: GitHub Official Registry Submission

**Steps**:

1. Fork <https://github.com/modelcontextprotocol/registry>
1. Add entry to `data/seed.json`:

```json
{
  "name": "obsidian-http-mcp",
  "description": "First HTTP-native MCP server for Obsidian - solves stdio bug #3071",
  "repository": "https://github.com/[your-username]/obsidian-http-mcp",
  "package": "obsidian-http-mcp",
  "registry": "npm",
  "version": "1.0.0",
  "author": "[your-username]",
  "license": "MIT",
  "transport": "http",
  "categories": ["notes", "knowledge-management"],
  "tags": ["obsidian", "http-native", "claude-code"]
}
```

1. Submit PR with title: "Add obsidian-http-mcp - First HTTP-native Obsidian MCP"

---

### Template 5: Generic Outreach Email

**Subject**: HTTP-native Obsidian MCP - Solves stdio bug #3071

```text
Hi [Name],

I saw your article/directory on [Best MCP Servers / MCP Tools] and wanted to share a project that solves a critical pain point in the MCP ecosystem.

**obsidian-http-mcp** is the first HTTP-native MCP server for Obsidian. It solves the BrokenPipeError (Claude Code CLI bug #3071) that affects 150+ stdio-based Obsidian MCP servers.

Why it matters:
- ONLY working HTTP-native solution for Obsidian + Claude Code CLI
- <200ms response, 70% fewer API calls via intelligent cache
- 9 production-ready tools (fuzzy search, soft delete, emoji support)
- Universal compatibility (Claude CLI/Desktop, Codex, Gemini)

Quick install: `npm install -g obsidian-http-mcp`

Links:
- npm: https://www.npmjs.com/package/obsidian-http-mcp
- GitHub: https://github.com/[your-username]/obsidian-http-mcp
- Bug it solves: https://github.com/anthropics/claude-code/issues/3071

Would you consider adding it to your [directory/article]? Happy to provide more details or answer questions.

Best,
Nas
```

---

## 🚀 Action Plan (Step-by-Step)

### Phase 1: Prerequisites (Day 1)

1. ✅ **Publish to npm** (prerequisite for ALL auto-discovery)

   ```bash
   npm publish
   ```

2. ✅ **Create Dockerfile** (required for Glama.ai and Smithery.ai)
   - Base image with Node.js
   - Copy package files + install deps
   - EXPOSE 3000
   - CMD ["npm", "start"]

### Phase 2: TOP 3 Critical Registries (Week 1)

1. **Submit to Glama.ai** 🔥🔥🔥
   - Go to <https://glama.ai/mcp/servers>
   - Click "Add Server"
   - Configure Dockerfile
   - Wait for checks + deployment

1. **Submit to Smithery.ai** 🔥🔥
   - Create `smithery.yaml` (use Template 3)
   - Push to GitHub
   - Follow Smithery docs for submission
   - SDK integration (TypeScript)

1. **Submit to GitHub Official Registry** 🔥🔥
   - Fork <https://github.com/modelcontextprotocol/registry>
   - Add entry to `data/seed.json` (use Template 4)
   - Submit PR
   - Target: Copilot JetBrains/Eclipse/Xcode integration

### Phase 3: Automated Discovery (Week 1)

1. ✅ **Verify PulseMCP pickup** (wait 24-48h for auto-indexing)
   - Check: <https://www.pulsemcp.com/servers?q=obsidian-http-mcp>

1. ✅ **Verify MCPMarket pickup** (check daily leaderboard)
   - Check: <https://mcpmarket.com/>

1. ✅ **Verify MCP Server Finder pickup**
   - Check: <https://www.mcpserverfinder.com/>

### Phase 4: Manual Submissions (Week 1-2)

1. **Submit PR to punkpeye/awesome-mcp-servers**
   - Fork repo
   - Add entry under appropriate category
   - Use Template 1
   - Tag @punkpeye in PR description

1. **DM Sean Kochel on Twitter**
   - Use Template 2
   - Include npm link + demo GIF if possible

### Phase 5: Corporate Outreach (Week 2-3)

1. **Contact ClickUp marketing/blog team**
   - Find contact form on clickup.com
   - Use Template 5
   - Pitch as "solution to common Claude Code CLI pain point"

---

## 📊 Success Metrics

**Short-term (Week 1-2)**:

- ✅ Listed on Glama.ai (manual submit)
- ✅ Listed on Smithery.ai (manual submit)
- ✅ PR submitted to GitHub Official Registry
- ✅ Listed on PulseMCP (auto)
- ✅ Listed on MCPMarket (auto)
- ✅ PR merged into awesome-mcp-servers

**Medium-term (Month 1)**:

- Listed in GitHub Copilot registry (JetBrains/Eclipse/Xcode)
- Response from Sean Kochel (Twitter)
- 10+ GitHub stars
- 50+ npm downloads/week

**Long-term (Month 2-3)**:

- Featured in listicle article (ClickUp or similar)
- 100+ GitHub stars
- 200+ npm downloads/week
- Top 100 on PulseMCP leaderboard

---

## 🛡️ Risk Mitigation

**Risk**: Auto-discovery fails (PulseMCP/MCPMarket don't pick up)
**Mitigation**: Manually reach out to site admins via GitHub/email

**Risk**: punkpeye rejects PR (quality standards)
**Mitigation**: Ensure npm package has 100% complete README, MIT license, proper package.json metadata

**Risk**: No response from influencers (Sean Kochel)
**Mitigation**: Focus on automated listings first (guaranteed visibility)

---

## 📌 Prerequisites Before Outreach

- ✅ npm publish with complete package.json metadata
- ✅ GitHub repo with MIT license
- ✅ README with Quick Facts + Quick Start
- ✅ ROADMAP.md and TECHNICAL.md for transparency
- ⏳ **Dockerfile** (CRITICAL for Glama.ai + Smithery.ai)
- ⏳ **smithery.yaml** (required for Smithery.ai)
- ⏳ Demo GIF/video (optional but helps)
- ⏳ Replace `[your-username]` with actual GitHub username in templates

---

## 📋 Quick Reference Summary

**Total Targets**: 10 directories/platforms
**Critical (Manual Submit)**: 3 (Glama, Smithery, GitHub Registry)
**Auto-Discovery**: 4 (PulseMCP, MCPMarket, MCP Server Finder, ClaudeLog)
**Manual PR**: 1 (Awesome MCP Servers)
**Influencer**: 1 (Sean Kochel)
**Corporate**: 1 (ClickUp)

**Estimated Time Investment**:

- Phase 1 (Prerequisites): 2-4 hours
- Phase 2 (TOP 3 registries): 4-6 hours
- Phase 3 (Auto-discovery): 0 hours (automated)
- Phase 4 (Manual submissions): 2-3 hours
- Phase 5 (Corporate outreach): 1 hour

**Total**: ~10-15 hours spread over 2-3 weeks

---

**Next Steps**:

1. Create Dockerfile
2. Create smithery.yaml
3. npm publish
4. Submit to TOP 3 (Glama, Smithery, GitHub Registry)
5. Wait 24-48h for auto-discovery
6. Manual submissions to remaining targets
