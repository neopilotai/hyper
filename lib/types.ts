/**
 * Core types for Terminal Copilot
 */

export interface CommandBlock {
  id: string;
  timestamp: Date;
  command: string;
  output: string;
  exitCode?: number;
  aiSuggestion?: AISuggestion;
}

export interface AISuggestion {
  id: string;
  understanding: string;
  analysis: string;
  suggestions: CommandSuggestion[];
  riskAssessment: string;
  confidence: number;
}

export interface CommandSuggestion {
  id: string;
  command: string;
  explanation: string;
  riskLevel: 'safe' | 'warning' | 'dangerous';
  category: string;
}

export interface TerminalState {
  isLoading: boolean;
  currentCommand: string;
  commandHistory: CommandBlock[];
  aiSuggestion: AISuggestion | null;
  error: string | null;
}

export interface ExecutionResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  duration: number;
}
