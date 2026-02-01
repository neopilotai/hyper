/**
 * API client utilities for communicating with backend
 */

import { CommandBlock, AISuggestion } from './types';

// Mock AI suggestion for development
function mockAISuggestion(command: string): AISuggestion {
  const safe = command.startsWith('ls') || command.startsWith('cat') || command.startsWith('echo');
  const dangerous =
    command.startsWith('rm -rf') || command.startsWith('dd') || command.startsWith(':(){:|:&};:');

  return {
    id: Math.random().toString(36).substr(2, 9),
    understanding: `This command: "${command}" - ${safe ? 'is a safe read operation' : dangerous ? 'could be destructive' : 'performs system operations'}`,
    analysis: `The command "${command}" will ${safe ? 'safely read or display data' : dangerous ? 'potentially delete or modify data' : 'execute system operations'}.`,
    suggestions: [
      {
        id: '1',
        command: safe ? command : `echo "${command}" # Preview before running`,
        explanation: safe ? 'This command is safe to run' : 'Consider previewing before execution',
        riskLevel: dangerous ? 'dangerous' : safe ? 'safe' : 'warning',
        category: 'system',
      },
    ],
    riskAssessment: dangerous ? 'HIGH RISK: This command could be destructive' : safe ? 'LOW RISK: Safe operation' : 'MEDIUM RISK: Review before execution',
    confidence: 0.8,
  };
}

export async function fetchAISuggestions(command: string, context?: string): Promise<AISuggestion> {
  try {
    const response = await fetch('/api/ai/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command, context }),
    });

    if (!response.ok) {
      // Fall back to mock if API not available
      console.log('[v0] API not available, using mock suggestions');
      return mockAISuggestion(command);
    }

    return response.json();
  } catch (error) {
    console.log('[v0] API call failed, using mock suggestions:', error);
    return mockAISuggestion(command);
  }
}

export async function executeCommand(command: string): Promise<CommandBlock> {
  try {
    const response = await fetch('/api/command/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) {
      throw new Error(`Failed to execute command`);
    }

    return response.json();
  } catch (error) {
    // Return mock response
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      command,
      output: 'Command executed (mock)',
      exitCode: 0,
    };
  }
}

export async function getCommandHistory(limit: number = 50): Promise<CommandBlock[]> {
  try {
    const response = await fetch(`/api/history?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch history`);
    }

    return response.json();
  } catch (error) {
    return [];
  }
}

export async function searchHistory(query: string): Promise<CommandBlock[]> {
  try {
    const response = await fetch(`/api/history/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`Failed to search history`);
    }

    return response.json();
  } catch (error) {
    return [];
  }
}
