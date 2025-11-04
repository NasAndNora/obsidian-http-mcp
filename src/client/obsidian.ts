import axios, { type AxiosInstance } from 'axios';

export class ObsidianClient {
  private client: AxiosInstance;

  constructor(baseUrl: string, apiKey: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  private validatePath(path: string): void {
    // Decode URL encoding to prevent bypass via %2e%2e
    const decoded = decodeURIComponent(path);
    if (decoded.includes('..') || decoded.startsWith('/') || decoded.includes('//')) {
      throw new Error('Invalid path: traversal not allowed');
    }
  }

  private encodePath(path: string): string {
    // Encode each path segment separately to preserve '/' separators
    // Handles emojis, spaces, special chars (e.g., "🧪Test.md" → "%F0%9F%A7%AATest.md")
    return path.split('/').map(segment =>
      segment ? encodeURIComponent(segment) : ''
    ).join('/');
  }

  async listVault(path: string = ''): Promise<{ files: string[]; folders: string[] }> {
    this.validatePath(path);
    // Add trailing / for directory listing (API requirement)
    const dirPath = path && !path.endsWith('/') ? `${path}/` : path;
    const encoded = this.encodePath(dirPath);
    const response = await this.client.get(`/vault/${encoded}`);

    // Obsidian API returns { files: [...] } where files contains BOTH files and folders
    // Folders end with '/', files do not
    const items: string[] = response.data.files || [];

    const files = items.filter(item => !item.endsWith('/'));
    const folders = items
      .filter(item => item.endsWith('/'))
      .map(folder => folder.slice(0, -1)); // Remove trailing '/'

    return { files, folders };
  }

  async readFile(path: string): Promise<string> {
    this.validatePath(path);
    const encoded = this.encodePath(path);
    const response = await this.client.get(`/vault/${encoded}`);
    return response.data;
  }

  async writeFile(path: string, content: string): Promise<void> {
    this.validatePath(path);
    const encoded = this.encodePath(path);
    await this.client.put(`/vault/${encoded}`, content, {
      headers: { 'Content-Type': 'text/markdown' },
    });
  }

  async appendFile(path: string, content: string): Promise<void> {
    this.validatePath(path);
    const encoded = this.encodePath(path);
    await this.client.patch(`/vault/${encoded}`, content, {
      headers: { 'Content-Type': 'text/markdown' },
    });
  }

  async deleteFile(path: string): Promise<void> {
    this.validatePath(path);
    const encoded = this.encodePath(path);
    await this.client.delete(`/vault/${encoded}`);
  }

  async fileExists(path: string): Promise<boolean> {
    this.validatePath(path);
    const encoded = this.encodePath(path);
    try {
      await this.client.get(`/vault/${encoded}`);
      return true;
    } catch {
      return false;
    }
  }
}
