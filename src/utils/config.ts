import { config as loadEnv } from 'dotenv';
import type { Config } from '../types/index.js';

loadEnv();

export function loadConfig(): Config {
  const apiKey = process.env.OBSIDIAN_API_KEY;

  if (!apiKey) {
    throw new Error('OBSIDIAN_API_KEY environment variable is required');
  }

  const portStr = process.env.PORT || '3000';
  const port = parseInt(portStr, 10);

  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: ${portStr}. Must be a number between 1 and 65535.`);
  }

  return {
    apiKey,
    baseUrl: process.env.OBSIDIAN_BASE_URL || 'http://127.0.0.1:27123',
    port,
  };
}
