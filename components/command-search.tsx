'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { SearchIcon, X } from 'lucide-react';
import { CommandBlock } from '@/lib/types';

interface CommandSearchProps {
  onSearch: (query: string) => Promise<CommandBlock[]>;
  onSelectCommand: (command: string) => void;
}

export function CommandSearch({ onSearch, onSelectCommand }: CommandSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CommandBlock[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      setQuery(searchQuery);

      if (searchQuery.trim().length === 0) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await onSearch(searchQuery);
        setResults(searchResults);
        setIsOpen(true);
      } catch (error) {
        console.error('[v0] Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [onSearch]
  );

  const handleSelectResult = (command: string) => {
    onSelectCommand(command);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search commands..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="w-full pl-9 pr-9 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-600"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {isOpen && (query.length > 0 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded shadow-lg z-50 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-slate-400">Searching...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-400">No commands found</div>
          ) : (
            <ul className="divide-y divide-slate-700">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleSelectResult(result.command)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors text-sm"
                  >
                    <p className="font-mono text-slate-300 truncate">{result.command}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {result.timestamp && new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
