'use client';

import React from "react"

import { useState } from 'react';
import { Copy, Play, Trash2, Search } from 'lucide-react';

interface CommandBlock {
  id: string;
  timestamp: Date;
  command: string;
  output: string;
  exitCode: number;
}

interface AISuggestion {
  id: string;
  understanding: string;
  analysis: string;
  suggestions: Array<{
    id: string;
    command: string;
    explanation: string;
    riskLevel: 'safe' | 'warning' | 'dangerous';
    category: string;
  }>;
  riskAssessment: string;
  confidence: number;
}

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

export default function Home() {
  const [history, setHistory] = useState<CommandBlock[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentSuggestion, setCurrentSuggestion] = useState<AISuggestion | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCommand.trim()) return;

    setCommandHistory([currentCommand, ...commandHistory]);
    setHistoryIndex(-1);

    const newBlock: CommandBlock = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      command: currentCommand,
      output: 'Command executed',
      exitCode: 0,
    };

    setHistory((prev) => [newBlock, ...prev]);

    setIsLoadingSuggestion(true);
    try {
      const suggestion = mockAISuggestion(currentCommand);
      setCurrentSuggestion(suggestion);
    } catch (error) {
      console.log('[v0] Error:', error);
    } finally {
      setIsLoadingSuggestion(false);
    }

    setCurrentCommand('');
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

  const filteredHistory = searchQuery
    ? history.filter((h) => h.command.toLowerCase().includes(searchQuery.toLowerCase()))
    : history;

  const getRiskColor = (level: 'safe' | 'warning' | 'dangerous') => {
    switch (level) {
      case 'safe':
        return 'bg-green-900 text-green-300';
      case 'warning':
        return 'bg-yellow-900 text-yellow-300';
      case 'dangerous':
        return 'bg-red-900 text-red-300';
    }
  };

  return (
    <main className="flex min-h-screen bg-slate-950">
      <div className="flex-1 flex flex-col p-6 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Terminal Copilot</h1>
          <p className="text-slate-400">AI-powered terminal assistant for better commands</p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Terminal */}
            <div className="flex-1 min-h-0 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1">
                <div className="text-slate-300">Welcome to Terminal Copilot</div>
                <div className="text-slate-300">Type your commands below. Press Enter to execute.</div>
                <div className="text-slate-300">AI will provide suggestions for better commands.</div>
                <div className="text-slate-600">&nbsp;</div>
              </div>

              <form onSubmit={handleCommandSubmit} className="border-t border-slate-800 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono">$</span>
                  <input
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

            {/* History */}
            <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden max-h-48 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <h2 className="text-sm font-semibold text-slate-300">Command History</h2>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-slate-400 hover:text-slate-300 p-1"
                  title="Search history"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {showSearch && (
                <div className="px-4 py-2 border-b border-slate-800">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search commands..."
                    className="w-full bg-slate-800 text-slate-300 rounded px-3 py-1 text-sm outline-none"
                  />
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                {filteredHistory.length === 0 ? (
                  <div className="p-4 text-slate-500 text-sm">No commands yet</div>
                ) : (
                  filteredHistory.map((cmd) => (
                    <div key={cmd.id} className="px-4 py-2 border-b border-slate-800 hover:bg-slate-800 flex items-center justify-between group">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500">
                          {cmd.timestamp instanceof Date
                            ? cmd.timestamp.toLocaleTimeString()
                            : new Date(cmd.timestamp).toLocaleTimeString()}
                        </p>
                        <p className="text-slate-300 font-mono text-xs truncate">{cmd.command}</p>
                      </div>
                      <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setCurrentCommand(cmd.command);
                            handleCommandSubmit({ preventDefault: () => {} } as React.FormEvent);
                          }}
                          className="text-slate-400 hover:text-slate-300 p-1"
                          title="Replay"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(cmd.command);
                          }}
                          className="text-slate-400 hover:text-slate-300 p-1"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setHistory((prev) => prev.filter((c) => c.id !== cmd.id))}
                          className="text-slate-400 hover:text-slate-300 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-slate-300">AI Suggestions</h2>
              {currentCommand && (
                <p className="text-xs text-slate-500 mt-1 truncate">Analyzing: {currentCommand}</p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingSuggestion ? (
                <div className="text-slate-400 text-sm">Analyzing command...</div>
              ) : currentSuggestion ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 mb-1">Understanding</h3>
                    <p className="text-xs text-slate-400">{currentSuggestion.understanding}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 mb-1">Analysis</h3>
                    <p className="text-xs text-slate-400">{currentSuggestion.analysis}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 mb-2">Suggestions</h3>
                    {currentSuggestion.suggestions.map((sugg) => (
                      <div key={sugg.id} className="mb-2 p-2 bg-slate-800 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getRiskColor(sugg.riskLevel)}`}>
                            {sugg.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-mono mb-1">{sugg.command}</p>
                        <p className="text-xs text-slate-400">{sugg.explanation}</p>
                        <button
                          onClick={() => {
                            setCurrentCommand(sugg.command);
                            handleCommandSubmit({ preventDefault: () => {} } as React.FormEvent);
                          }}
                          className="mt-2 w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                        >
                          Run Command
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-300 mb-1">Risk Assessment</h3>
                    <p className="text-xs text-slate-400">{currentSuggestion.riskAssessment}</p>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-sm">Enter a command to get AI suggestions</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
