import type { ObsidianClient } from '../client/obsidian.js';
import type { ToolResult } from '../types/index.js';
import type { SearchOptions } from '../types/search.js';
import { search } from '../utils/search.js';

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

    // Get all files from vault root (recursive)
    const { files } = await client.listVault('');

    // Search with fuzzy matching
    const matches = search(
      {
        query: args.query,
        fuzzy: args.fuzzy ?? true,  // Fuzzy by default
        maxResults: args.max_results ?? 10,
      },
      files
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
