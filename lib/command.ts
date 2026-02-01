/**
 * Command execution and validation module
 */

import { ExecutionResult } from './types';

// List of dangerous commands that should warn users
const DANGEROUS_COMMANDS = [
  'rm -rf',
  'mkfs',
  'dd if=',
  ':(){:|:&};:',
  'fork',
  'chmod 777',
];

// Commands that are safe to execute
const SAFE_COMMAND_PATTERNS = [
  /^ls/,
  /^pwd/,
  /^echo/,
  /^cat/,
  /^grep/,
  /^find/,
  /^ps/,
  /^top/,
  /^whoami/,
  /^date/,
  /^curl/,
  /^wget/,
];

export function validateCommand(command: string): { valid: boolean; riskLevel: 'safe' | 'warning' | 'dangerous' } {
  const trimmed = command.trim().toLowerCase();

  // Check for dangerous patterns
  for (const dangerous of DANGEROUS_COMMANDS) {
    if (trimmed.includes(dangerous)) {
      return { valid: true, riskLevel: 'dangerous' };
    }
  }

  // Check for safe patterns
  const isSafe = SAFE_COMMAND_PATTERNS.some((pattern) => pattern.test(trimmed));
  if (isSafe) {
    return { valid: true, riskLevel: 'safe' };
  }

  // Default to warning for unknown commands
  return { valid: true, riskLevel: 'warning' };
}

export function parseCommandOutput(output: string): { stdout: string; stderr: string } {
  // This is a placeholder - in a real implementation, you would separate stdout/stderr
  return { stdout: output, stderr: '' };
}

export function formatCommandForDisplay(command: string): string {
  return command.trim();
}
