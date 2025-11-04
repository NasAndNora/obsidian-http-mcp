#!/usr/bin/env node

import { VERSION } from './utils/version.js';

interface CliArgs {
  apiKey?: string;
  port?: number;
  help?: boolean;
  version?: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--version' || arg === '-v') {
      args.version = true;
    } else if (arg === '--api-key' && i + 1 < argv.length) {
      args.apiKey = argv[++i];
    } else if (arg === '--port' && i + 1 < argv.length) {
      args.port = parseInt(argv[++i], 10);
    }
  }

  return args;
}

export function showHelp(): void {
  console.log(`
Obsidian HTTP MCP Server

USAGE:
  obsidian-http-mcp [OPTIONS]

OPTIONS:
  --api-key <key>    Obsidian REST API key (or set OBSIDIAN_API_KEY env var)
  --port <number>    Server port (default: 3000, or set PORT env var)
  --help, -h         Show this help message
  --version, -v      Show version

EXAMPLES:
  obsidian-http-mcp --api-key YOUR_API_KEY --port 3000
  OBSIDIAN_API_KEY=xxx obsidian-http-mcp

For more info: https://github.com/yourusername/obsidian-http-mcp
  `);
}

export function showVersion(): void {
  console.log(`obsidian-http-mcp v${VERSION}`);
}
