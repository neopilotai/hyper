'use client';

import { AISuggestion } from '@/lib/types';
import { AlertCircle, CheckCircle, AlertTriangle, Copy } from 'lucide-react';

interface AISuggestionPanelProps {
  suggestion: AISuggestion | null;
  isLoading?: boolean;
  onRunCommand?: (command: string) => void;
}

function getRiskIcon(riskLevel: 'safe' | 'warning' | 'dangerous') {
  switch (riskLevel) {
    case 'safe':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'dangerous':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
  }
}

function getRiskColor(riskLevel: 'safe' | 'warning' | 'dangerous') {
  switch (riskLevel) {
    case 'safe':
      return 'bg-green-50 border-green-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'dangerous':
      return 'bg-red-50 border-red-200';
  }
}

export function AISuggestionPanel({ suggestion, isLoading, onRunCommand }: AISuggestionPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!suggestion) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p className="text-sm">Enter a command to get AI suggestions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 overflow-y-auto max-h-full">
      {/* Understanding */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Understanding</h4>
        <p className="text-sm text-slate-600">{suggestion.understanding}</p>
      </div>

      {/* Analysis */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Analysis</h4>
        <p className="text-sm text-slate-600">{suggestion.analysis}</p>
      </div>

      {/* Risk Assessment */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Risk Assessment</h4>
        <p className="text-sm text-slate-600">{suggestion.riskAssessment}</p>
        <div className="text-xs text-slate-500">
          Confidence: {(suggestion.confidence * 100).toFixed(0)}%
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Suggested Commands</h4>
        
        {suggestion.suggestions.map((cmd) => (
          <div
            key={cmd.id}
            className={`p-3 border rounded space-y-2 ${getRiskColor(cmd.riskLevel)}`}
          >
            <div className="flex items-start gap-2">
              {getRiskIcon(cmd.riskLevel)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs font-mono bg-slate-200 px-2 py-1 rounded truncate flex-1">
                    {cmd.command}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(cmd.command)}
                    className="p-1 hover:bg-slate-300 rounded flex-shrink-0"
                    title="Copy command"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-slate-700">{cmd.explanation}</p>
            
            <div className="flex gap-2 pt-1">
              <span className="text-xs bg-slate-300 text-slate-800 px-2 py-1 rounded">
                {cmd.category}
              </span>
              <span className="text-xs text-slate-600">
                Risk: {cmd.riskLevel}
              </span>
            </div>

            <button
              onClick={() => onRunCommand?.(cmd.command)}
              className="mt-2 w-full px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Run Command
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
