import type { ObsidianClient } from '../client/obsidian.js';
import type { ToolResult } from '../types/index.js';

export async function listDir(
  client: ObsidianClient,
  args: { path?: string }
): Promise<ToolResult> {
  try {
    const { folders } = await client.listVault(args.path || '');
    return {
      success: true,
      data: { directories: folders },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function listFiles(
  client: ObsidianClient,
  args: { path?: string; extension?: string }
): Promise<ToolResult> {
  try {
    const { files } = await client.listVault(args.path || '');

    let filteredFiles = files;
    if (args.extension) {
      filteredFiles = files.filter((f) => f.endsWith(args.extension!));
    }

    return {
      success: true,
      data: { files: filteredFiles },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
