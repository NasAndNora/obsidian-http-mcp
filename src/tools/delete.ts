import type { ObsidianClient } from '../client/obsidian.js';
import type { ToolResult } from '../types/index.js';
import { invalidateFilesCache } from './find.js';

export async function deleteFile(
  client: ObsidianClient,
  args: { path: string; confirm?: boolean }
): Promise<ToolResult> {
  try {
    if (!args.path) {
      return {
        success: false,
        error: 'path parameter is required',
      };
    }

    if (!args.confirm) {
      return {
        success: false,
        error: 'confirm=true is required to delete a file (safety check)',
      };
    }

    const exists = await client.fileExists(args.path);
    if (!exists) {
      return {
        success: false,
        error: `File not found: ${args.path}`,
      };
    }

    await client.deleteFile(args.path);

    // Invalidate cache so deleted file is immediately removed from search results
    invalidateFilesCache();

    return {
      success: true,
      data: {
        deleted_path: args.path,
        message: 'File deleted successfully',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
