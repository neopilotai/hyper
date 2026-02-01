'use client';

import React from "react"

import { useRef, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TerminalProps {
  onCommandExecute?: (command: string) => void;
  onCommandInput?: (command: string) => void;
}

export function TerminalComponent({ onCommandExecute, onCommandInput }: TerminalProps) {
  const [output, setOutput] = useState<string[]>([
    'Welcome to Terminal Copilot',
    'Type your commands below. Press Enter to execute.',
    'AI will provide suggestions for better commands.',
    '',
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentCommand.trim()) {
      // Add to output
      setOutput((prev) => [...prev, `$ ${currentCommand}`]);

      // Update history
      setCommandHistory((prev) => [currentCommand, ...prev]);
      setHistoryIndex(-1);

      // Notify parent components
      onCommandExecute?.(currentCommand);
      onCommandInput?.(currentCommand);

      // Clear input
      setCurrentCommand('');
    }

    // Auto-scroll to bottom
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = historyIndex + 1;
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex);
        setCurrentCommand(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setCurrentCommand(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  return (
    <div className="h-full w-full bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex flex-col">
      {/* Output Area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1"
      >
        {output.map((line, i) => (
          <div key={i} className="text-slate-300 break-words">
            {line}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a command..."
            className="flex-1 bg-transparent outline-none text-slate-300 font-mono text-sm placeholder-slate-600"
            autoFocus
          />
        </div>
      </form>
    </div>
  );
}
