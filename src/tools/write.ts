import type { ObsidianClient } from '../client/obsidian.js';
import type { ToolResult } from '../types/index.js';
import { invalidateFilesCache } from './find.js';

export async function writeFile(
  client: ObsidianClient,
  args: { path: string; content: string; mode?: 'create' | 'overwrite' | 'append' }
): Promise<ToolResult> {
  try {
    if (!args.path || args.content === undefined) {
      return {
        success: false,
        error: 'path and content parameters are required',
      };
    }

    const mode = args.mode || 'create';
    const fileExists = await client.fileExists(args.path);

    if (mode === 'create' && fileExists) {
      return {
        success: false,
        error: `File already exists: ${args.path}. Use mode='overwrite' to replace.`,
      };
    }

    if (mode === 'append') {
      await client.appendFile(args.path, args.content);
    } else {
      await client.writeFile(args.path, args.content);
    }

    // Invalidate cache so new/modified file is immediately discoverable
    invalidateFilesCache();

    return {
      success: true,
      data: {
        path: args.path,
        message: `File ${mode === 'append' ? 'appended' : 'written'} successfully`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
