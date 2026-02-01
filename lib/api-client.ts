/**
 * API client utilities for communicating with backend
 */

import { CommandBlock, AISuggestion } from './types';

export async function fetchAISuggestions(command: string, context?: string): Promise<AISuggestion> {
  const response = await fetch('/api/ai/suggestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ command, context }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch AI suggestions: ${response.statusText}`);
  }

  return response.json();
}

export async function executeCommand(command: string): Promise<CommandBlock> {
  const response = await fetch('/api/command/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ command }),
  });

  if (!response.ok) {
    throw new Error(`Failed to execute command: ${response.statusText}`);
  }

  return response.json();
}

export async function getCommandHistory(limit: number = 50): Promise<CommandBlock[]> {
  const response = await fetch(`/api/history?limit=${limit}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.statusText}`);
  }

  return response.json();
}

export async function searchHistory(query: string): Promise<CommandBlock[]> {
  const response = await fetch(`/api/history/search?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error(`Failed to search history: ${response.statusText}`);
  }

  return response.json();
}
