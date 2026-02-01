'use server';

import { db } from '@/lib/db';
import { CommandBlock } from '@/lib/types';

/**
 * Server action to save a command block to the database
 */
export async function saveCommandBlockAction(
  block: Omit<CommandBlock, 'id'>
): Promise<CommandBlock> {
  try {
    const saved = await db.saveCommandBlock(block);
    return saved;
  } catch (error) {
    console.error('[v0] Error saving command block:', error);
    throw new Error('Failed to save command block');
  }
}

/**
 * Server action to fetch command history
 */
export async function getCommandHistoryAction(limit: number = 50): Promise<CommandBlock[]> {
  try {
    const history = await db.getCommandHistory(limit);
    return history;
  } catch (error) {
    console.error('[v0] Error fetching command history:', error);
    throw new Error('Failed to fetch command history');
  }
}

/**
 * Server action to search commands
 */
export async function searchCommandsAction(query: string): Promise<CommandBlock[]> {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const results = await db.searchCommands(query);
    return results;
  } catch (error) {
    console.error('[v0] Error searching commands:', error);
    throw new Error('Failed to search commands');
  }
}

/**
 * Server action to delete a command
 */
export async function deleteCommandAction(id: string): Promise<boolean> {
  try {
    const deleted = await db.deleteCommand(id);
    return deleted;
  } catch (error) {
    console.error('[v0] Error deleting command:', error);
    throw new Error('Failed to delete command');
  }
}

/**
 * Server action to clear all history
 */
export async function clearHistoryAction(): Promise<boolean> {
  try {
    const cleared = await db.clearHistory();
    return cleared;
  } catch (error) {
    console.error('[v0] Error clearing history:', error);
    throw new Error('Failed to clear history');
  }
}
