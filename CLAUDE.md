# CLAUDE.md - Context pour futures sessions

## Projet: Obsidian HTTP MCP Server

**Vision**: Premier et unique serveur MCP HTTP-natif pour Obsidian. Résout le bug stdio #3071 de Claude Code CLI.

**Problème résolu**: Tous les 150+ MCP Obsidian existants utilisent stdio → BrokenPipeError. Ce projet utilise HTTP pur.

**Objectif ROI**:

- GitHub stars (métrique #1)
- npm downloads (métrique #2)
- SEO ultra-boosté ("first and only HTTP-native")

## User Role

**Tu es le créateur, user te laisse carte blanche pour sortir un MCP exceptionnel en qualité**. Moi (user) j'en tire les bénéfices (stars, dons, etc).

**Philosophie**: Sessions futures = perte de mémoire → d'où docs complètes.

## Stack Technique

- Node.js/npm (pas Bun - compatibilité future Community Plugin)
- Hono (HTTP léger)
- @modelcontextprotocol/sdk officiel
- axios (Obsidian REST API port 27123)

## 7 Tools à implémenter

1. list_dir
2. list_files
3. read_file
4. write_file (modes: create/overwrite/append)
5. search (grep-like + regex)
6. move_file
7. delete_file (avec confirm safety)

## État actuel

- ✅ Documentation complète (README, PRD, TECHNICAL, ROADMAP)
- ✅ package.json configuré
- ⏳ Création structure src/ + implémentation core

## Instructions

**TOUJOURS lire en premier**:

1. `AGENTS.md` - Comment utiliser les agents efficacement
2. `STRUCTURE.md` - Architecture du projet
3. `TECHNICAL.md` - Spécifications détaillées

**Puis**: Continuer le développement où ça s'est arrêté.

**Style**: Pragmatique, concis, focus résultats.
