'use client';

import { useState } from 'react';
import { TerminalComponent } from '@/components/terminal';
import { CommandHistoryEnhanced } from '@/components/command-history-enhanced';
import { AISuggestionPanel } from '@/components/ai-suggestion-panel';
import { CommandBlock, AISuggestion } from '@/lib/types';
import { fetchAISuggestions } from '@/lib/api-client';

export default function Home() {
  const [history, setHistory] = useState<CommandBlock[]>([]);
  const [currentSuggestion, setCurrentSuggestion] = useState<AISuggestion | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');

  const handleCommandInput = async (command: string) => {
    setCurrentCommand(command);
    setIsLoadingSuggestion(true);

    try {
      const suggestion = await fetchAISuggestions(command);
      setCurrentSuggestion(suggestion);
    } catch (error) {
      console.error('[v0] Error fetching suggestions:', error);
      setCurrentSuggestion(null);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  const handleCommandExecute = (command: string) => {
    const newBlock: CommandBlock = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      command,
      output: 'Command executed',
      exitCode: 0,
    };

    setHistory((prev) => [newBlock, ...prev]);
  };

  const handleReplay = (command: string) => {
    handleCommandInput(command);
    handleCommandExecute(command);
  };

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((cmd) => cmd.id !== id));
  };

  return (
    <main className="flex min-h-screen bg-slate-950">
      {/* Main Terminal Area */}
      <div className="flex-1 flex flex-col p-6 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Terminal Copilot</h1>
          <p className="text-slate-400">AI-powered terminal assistant for better commands</p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          {/* Terminal */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex-1 min-h-0">
              <TerminalComponent
                onCommandInput={handleCommandInput}
                onCommandExecute={handleCommandExecute}
              />
            </div>

            {/* History */}
            <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden max-h-48">
              <CommandHistoryEnhanced
                history={history}
                onReplay={handleReplay}
                onDelete={handleDelete}
                onSearch={fetchAISuggestions}
              />
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-slate-300">AI Suggestions</h2>
              {currentCommand && (
                <p className="text-xs text-slate-500 mt-1 truncate">
                  Analyzing: {currentCommand}
                </p>
              )}
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
              <AISuggestionPanel
                suggestion={currentSuggestion}
                isLoading={isLoadingSuggestion}
                onRunCommand={handleCommandExecute}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
