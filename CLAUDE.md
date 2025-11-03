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
- Express (HTTP server, MCP SDK compatible)
- @modelcontextprotocol/sdk officiel (StreamableHTTPServerTransport)
- axios (Obsidian REST API port 27123)

## 9 Tools implémentés (v1.0 ✅)

1. list_dir - Liste dossiers
2. list_files - Liste fichiers dans dossier
3. find_files - Recherche fichiers par nom (fuzzy matching)
4. read_file - Lit contenu fichier
5. write_file - Crée/met à jour fichier (modes: create/overwrite/append)
6. search - Recherche texte dans vault (grep-like + regex)
7. move_file - Déplace/renomme fichier
8. delete_file - Supprime fichier (soft delete par défaut)
9. delete_folder - Supprime dossier récursivement (soft delete par défaut)

## État actuel

**v1.0 ✅ TERMINÉ** (2025-11-03):

- ✅ 9 core tools implémentés
- ✅ HTTP server avec MCP endpoint
- ✅ Soft delete dans `.trash-http-mcp/`
- ✅ Cache 60s pour find_files (perf)
- ✅ Documentation complète
- ✅ Ready for npm publish

**Prochaine étape: v1.0.1 - Multi-vault Support** (voir ROADMAP.md)

## Instructions

**TOUJOURS lire en premier**:

1. `ROADMAP.md` - Prochaines features (v1.0.1 = multi-vault)
2. `TECHNICAL.md` - Spécifications détaillées des 9 tools
3. `STRUCTURE.md` - Architecture du projet

**Puis**: Continuer selon roadmap.

**Style**: Pragmatique, concis, focus résultats, MVP-first, no overengineering.
