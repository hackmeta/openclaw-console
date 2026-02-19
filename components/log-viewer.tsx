'use client';

import { useState, useEffect, useRef } from 'react';
import type { LogEntry } from '@/types';

interface LogViewerProps {
  instanceId: string;
  logs: LogEntry[];
  onRefresh: () => void;
  loading?: boolean;
}

export function LogViewer({ instanceId, logs, onRefresh, loading = false }: LogViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Filter logs based on search query and level
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.component?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    
    return matchesSearch && matchesLevel;
  });

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/\//g, '-');
  };

  // Get level color
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
      default:
        return 'text-white';
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Level Filter */}
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as any)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="all">All Levels</option>
          <option value="info">INFO</option>
          <option value="warn">WARN</option>
          <option value="error">ERROR</option>
        </select>

        {/* Auto Scroll Toggle */}
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            autoScroll
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Auto Scroll
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Log Count */}
      <div className="text-sm text-gray-400">
        Showing {filteredLogs.length} of {logs.length} logs
      </div>

      {/* Log Container */}
      <div
        ref={logContainerRef}
        className="h-[600px] overflow-y-auto rounded-lg border border-gray-800 bg-gray-950 p-4 font-mono text-sm"
        style={{ scrollBehavior: autoScroll ? 'smooth' : 'auto' }}
      >
        {filteredLogs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            {searchQuery || levelFilter !== 'all' ? 'No matching logs found' : 'No logs available'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex gap-3 hover:bg-gray-900 px-2 py-1 rounded transition-colors"
              >
                {/* Timestamp */}
                <span className="text-gray-500 whitespace-nowrap">
                  [{formatTimestamp(log.timestamp)}]
                </span>
                
                {/* Level */}
                <span className={`font-bold whitespace-nowrap ${getLevelColor(log.level)}`}>
                  {log.level.toUpperCase().padEnd(5)}
                </span>
                
                {/* Component */}
                {log.component && (
                  <span className="text-cyan-400 whitespace-nowrap">
                    [{log.component}]
                  </span>
                )}
                
                {/* Message */}
                <span className="text-gray-300 break-all">
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
