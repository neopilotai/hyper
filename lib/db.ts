/**
 * Database module for Terminal Copilot
 * Handles in-memory command history storage and search
 * 
 * Note: In production, this would connect to SQLite using better-sqlite3.
 * For v0 compatibility, we use an in-memory store with persistence via API.
 */

import { CommandBlock } from './types';

// In-memory store for command history
// In production, this would be replaced with SQLite
let commandHistory: CommandBlock[] = [];

export class TerminalDatabase {
  async saveCommandBlock(block: Omit<CommandBlock, 'id'>): Promise<CommandBlock> {
    const id = Math.random().toString(36).substr(2, 9);
    const commandBlock: CommandBlock = {
      ...block,
      id,
    };

    // Add to in-memory store (newest first)
    commandHistory.unshift(commandBlock);

    // Keep only last 1000 commands in memory
    if (commandHistory.length > 1000) {
      commandHistory = commandHistory.slice(0, 1000);
    }

    return commandBlock;
  }

  async getCommandHistory(limit: number = 50): Promise<CommandBlock[]> {
    // Validate limit
    const validatedLimit = Math.min(Math.max(1, limit), 1000);
    return commandHistory.slice(0, validatedLimit);
  }

  async searchCommands(query: string): Promise<CommandBlock[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchQuery = query.toLowerCase().trim();

    return commandHistory.filter((cmd) => {
      const commandMatch = cmd.command.toLowerCase().includes(searchQuery);
      const outputMatch = cmd.output?.toLowerCase().includes(searchQuery) || false;
      return commandMatch || outputMatch;
    });
  }

  async deleteCommand(id: string): Promise<boolean> {
    const initialLength = commandHistory.length;
    commandHistory = commandHistory.filter((cmd) => cmd.id !== id);
    return commandHistory.length < initialLength;
  }

  async clearHistory(): Promise<boolean> {
    commandHistory = [];
    return true;
  }

  async getAllHistory(): Promise<CommandBlock[]> {
    return [...commandHistory];
  }
}

export const db = new TerminalDatabase();
