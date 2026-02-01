'use client';

import { CommandBlock } from '@/lib/types';
import { Trash2, Copy, Play, Search } from 'lucide-react';
import { useState } from 'react';
import { CommandSearch } from './command-search';
import { format } from 'date-fns';

interface CommandHistoryEnhancedProps {
  history: CommandBlock[];
  onReplay?: (command: string) => void;
  onDelete?: (id: string) => void;
  onSearch?: (query: string) => Promise<CommandBlock[]>;
}

export function CommandHistoryEnhanced({
  history,
  onReplay,
  onDelete,
  onSearch,
}: CommandHistoryEnhancedProps) {
  const [showSearch, setShowSearch] = useState(false);

  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  const handleSearch = async (query: string) => {
    if (onSearch) {
      return onSearch(query);
    }
    // Fallback: search in local history
    const lowerQuery = query.toLowerCase();
    return history.filter(
      (cmd) =>
        cmd.command.toLowerCase().includes(lowerQuery) ||
        cmd.output?.toLowerCase().includes(lowerQuery)
    );
  };

  const formatTime = (timestamp: Date) => {
    return format(timestamp, 'yyyy-MM-dd HH:mm:ss');
  };

  return (
    <div className="space-y-3">
      {/* Header with search toggle */}
      <div className="flex items-center justify-between px-4 py-2">
        <h3 className="text-sm font-semibold text-slate-300">Command History</h3>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-300 transition-colors"
          title="Toggle search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="px-4 pb-2">
          <CommandSearch onSearch={handleSearch} onSelectCommand={onReplay || (() => {})} />
        </div>
      )}

      {/* History list */}
      <div className="space-y-1 max-h-48 overflow-y-auto px-2">
        {history.length === 0 ? (
          <p className="text-xs text-slate-500 px-2 py-2">No commands yet</p>
        ) : (
          history.map((block) => (
            <div
              key={block.id}
              className="px-2 py-1 hover:bg-slate-800 group transition-colors flex items-start justify-between gap-2 rounded"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-slate-200 truncate">{block.command}</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {block.timestamp && formatTime(block.timestamp)}
                </p>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => copyToClipboard(block.command)}
                  className="p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-slate-200"
                  title="Copy command"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onReplay?.(block.command)}
                  className="p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-slate-200"
                  title="Replay command"
                >
                  <Play className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDelete?.(block.id)}
                  className="p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-red-400"
                  title="Delete command"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
