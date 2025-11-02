import type { ObsidianClient } from '../client/obsidian.js';
import type { ToolResult } from '../types/index.js';
import type { SearchOptions } from '../types/search.js';
import { search } from '../utils/search.js';

// Cache for vault files (60s TTL to avoid N+1 queries on multiple searches)
let filesCache: { data: string[]; timestamp: number } | null = null;
const CACHE_TTL = 60000; // 60 seconds

// Recursively walk vault tree and collect all file paths
async function walkVault(client: ObsidianClient, path: string = ''): Promise<string[]> {
  const { files, folders } = await client.listVault(path);

  // Build full paths for files in current directory
  const fullPathFiles = files.map(f => (path ? `${path}/${f}` : f));

  // Recursively walk all subdirectories in parallel
  const subFiles = await Promise.all(
    folders.map(folder => walkVault(client, path ? `${path}/${folder}` : folder))
  );

  return [...fullPathFiles, ...subFiles.flat()];
}

// Get all files from vault with 60s cache
async function getAllFiles(client: ObsidianClient): Promise<string[]> {
  // Check cache validity
  if (filesCache && Date.now() - filesCache.timestamp < CACHE_TTL) {
    return filesCache.data;
  }

  // Cache miss or expired - scan vault
  const allFiles = await walkVault(client);

  // Update cache
  filesCache = { data: allFiles, timestamp: Date.now() };

  return allFiles;
}

export async function findFiles(
  client: ObsidianClient,
  args: {
    query: string;
    fuzzy?: boolean;
    max_results?: number;
  }
): Promise<ToolResult> {
  try {
    if (!args.query) {
      return {
        success: false,
        error: 'query parameter is required',
      };
    }

    // Get all files recursively (with cache)
    const allFiles = await getAllFiles(client);

    // Search with fuzzy matching
    const matches = search(
      {
        query: args.query,
        fuzzy: args.fuzzy ?? true,  // Fuzzy by default
        maxResults: args.max_results ?? 10,
      },
      allFiles
    );

    return {
      success: true,
      data: {
        query: args.query,
        total_matches: matches.length,
        matches: matches.map(m => ({
          path: m.path,
          score: m.score,
          match_type: m.matchType,
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
