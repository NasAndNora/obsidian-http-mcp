import type { ObsidianClient } from '../client/obsidian.js';
import type { ToolResult } from '../types/index.js';
import { invalidateFilesCache } from './find.js';

export async function moveFile(
  client: ObsidianClient,
  args: { source: string; destination: string; overwrite?: boolean }
): Promise<ToolResult> {
  try {
    if (!args.source || !args.destination) {
      return {
        success: false,
        error: 'source and destination parameters are required',
      };
    }

    const sourceExists = await client.fileExists(args.source);
    if (!sourceExists) {
      return {
        success: false,
        error: `Source file not found: ${args.source}`,
      };
    }

    const destExists = await client.fileExists(args.destination);
    if (destExists && !args.overwrite) {
      return {
        success: false,
        error: `Destination file already exists: ${args.destination}. Use overwrite=true to replace.`,
      };
    }

    // Read source, write to destination, delete source
    const content = await client.readFile(args.source);
    await client.writeFile(args.destination, content);
    await client.deleteFile(args.source);

    // Invalidate cache so moved file is immediately searchable at new location
    invalidateFilesCache();

    return {
      success: true,
      data: {
        old_path: args.source,
        new_path: args.destination,
        message: 'File moved successfully',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
