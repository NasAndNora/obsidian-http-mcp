import type { ObsidianClient } from '../client/obsidian.js';
import type { ToolResult } from '../types/index.js';
import type { SearchOptions } from '../types/search.js';
import { search } from '../utils/search.js';

// Cache configuration
const CACHE_TTL_MS = 60000; // 60 seconds - TTL to avoid N+1 queries on multiple searches

// Cache for vault files
let filesCache: { data: string[]; timestamp: number } | null = null;

// Invalidate cache (called after write/delete/move operations)
export function invalidateFilesCache(): void {
  filesCache = null;
}

// Recursively walk vault tree and collect all file paths
export async function walkVault(client: ObsidianClient, path: string = ''): Promise<string[]> {
  const { files, folders } = await client.listVault(path);

  // Build full paths for files in current directory
  const fullPathFiles = files.map(f => (path ? `${path}/${f}` : f));

  // Recursively walk all subdirectories in parallel (use allSettled for robustness)
  const results = await Promise.allSettled(
    folders.map(folder => walkVault(client, path ? `${path}/${folder}` : folder))
  );

  // Extract successful results
  const subFiles = results
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<string[]>).value)
    .flat();

  // Log failed folder scans (continue with partial results)
  const failedCount = results.filter(r => r.status === 'rejected').length;
  if (failedCount > 0) {
    const firstError = (results.find(r => r.status === 'rejected') as PromiseRejectedResult)?.reason;
    console.error('Failed to scan folders:', {
      totalFolders: folders.length,
      failedCount,
      error: firstError instanceof Error ? firstError.message : firstError,
    });
  }

  return [...fullPathFiles, ...subFiles];
}

// Get all files from vault with cache
async function getAllFiles(client: ObsidianClient): Promise<string[]> {
  // Check cache validity
  if (filesCache && Date.now() - filesCache.timestamp < CACHE_TTL_MS) {
    console.debug('find_files: cache hit (0 API calls)');
    return filesCache.data;
  }

  // Cache miss or expired - scan vault
  console.debug('find_files: cache miss - scanning vault');
  const startTime = Date.now();

  const allFiles = await walkVault(client);

  const scanDuration = Date.now() - startTime;
  console.debug(`find_files: scanned ${allFiles.length} files in ${scanDuration}ms`);

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
    // Log error for debugging (helps diagnose API issues)
    console.error('find_files failed:', {
      query: args.query,
      error: error instanceof Error ? error.message : error,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
