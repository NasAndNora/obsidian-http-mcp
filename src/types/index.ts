// Core types for Obsidian HTTP MCP Server

export interface Config {
  apiKey: string;
  baseUrl: string;
  port: number;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface SearchMatch {
  file: string;
  line: number;
  content: string;
  context_before?: string;
  context_after?: string;
}

export interface MCPToolCallParams {
  name: string;
  arguments: Record<string, unknown>;
}
