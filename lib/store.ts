/**
 * Client-side state management for Terminal Copilot
 * Using React hooks for lightweight state management
 */

import { create } from 'zustand';
import { TerminalState, CommandBlock, AISuggestion } from './types';

interface Store extends TerminalState {
  setCurrentCommand: (command: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setAISuggestion: (suggestion: AISuggestion | null) => void;
  addCommandToHistory: (block: CommandBlock) => void;
  setError: (error: string | null) => void;
  clearHistory: () => void;
}

// Note: zustand is not yet installed, this is a placeholder for the store structure
// This will be implemented using React Context + useReducer or a similar pattern initially

export const useTerminalStore = (state: TerminalState) => ({
  isLoading: state.isLoading,
  currentCommand: state.currentCommand,
  commandHistory: state.commandHistory,
  aiSuggestion: state.aiSuggestion,
  error: state.error,

  setCurrentCommand: (command: string) => {
    // Update current command
  },
  setIsLoading: (isLoading: boolean) => {
    // Update loading state
  },
  setAISuggestion: (suggestion: AISuggestion | null) => {
    // Update AI suggestion
  },
  addCommandToHistory: (block: CommandBlock) => {
    // Add to history
  },
  setError: (error: string | null) => {
    // Set error
  },
  clearHistory: () => {
    // Clear history
  },
});
