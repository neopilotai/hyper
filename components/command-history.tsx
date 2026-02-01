'use client';

import { CommandBlock } from '@/lib/types';
import { format } from 'date-fns';
import { Trash2, Copy, Play } from 'lucide-react';

interface CommandHistoryProps {
  history: CommandBlock[];
  onReplay?: (command: string) => void;
  onDelete?: (id: string) => void;
}

export function CommandHistory({ history, onReplay, onDelete }: CommandHistoryProps) {
  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-300 px-4 py-2">Command History</h3>
      
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-xs text-slate-500 px-4 py-2">No commands yet</p>
        ) : (
          history.map((block) => (
            <div
              key={block.id}
              className="px-4 py-2 hover:bg-slate-800 group transition-colors flex items-start justify-between gap-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-slate-200 truncate">
                  {block.command}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {format(new Date(block.timestamp), 'HH:mm:ss')}
                </p>
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => copyToClipboard(block.command)}
                  className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"
                  title="Copy command"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onReplay?.(block.command)}
                  className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"
                  title="Replay command"
                >
                  <Play className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDelete?.(block.id)}
                  className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400"
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
