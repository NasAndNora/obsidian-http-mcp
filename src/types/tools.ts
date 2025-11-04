// Tool argument type definitions for MCP tool calls

export interface ListDirArgs {
  path?: string;
}

export interface ListFilesArgs {
  path?: string;
  extension?: string;
}

export interface ReadFileArgs {
  path: string;
}

export interface WriteFileArgs {
  path: string;
  content: string;
  mode?: 'create' | 'overwrite' | 'append';
}

export interface SearchArgs {
  query: string;
  case_sensitive?: boolean;
  regex?: boolean;
  max_results?: number;
}

export interface MoveFileArgs {
  source: string;
  destination: string;
  overwrite?: boolean;
}

export interface DeleteFileArgs {
  path: string;
  confirm?: boolean;
  permanent?: boolean;
}

export interface DeleteFolderArgs {
  path: string;
  confirm?: boolean;
  permanent?: boolean;
}

export interface FindFilesArgs {
  query: string;
  fuzzy?: boolean;
  max_results?: number;
}
