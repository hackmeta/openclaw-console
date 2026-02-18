'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { StatusBadge } from '@/components/status-badge';
import { mockInstances, mockLogs } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Instance, LogEntry } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function InstanceDetailPage({ params }: Props) {
  const router = useRouter();
  const [instance, setInstance] = useState<Instance | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    // TODO: Replace with real API calls
    // Promise.all([api.getInstance(id), api.getLogs(id)])
    //   .then(([inst, logs]) => {
    //     setInstance(inst);
    //     setLogs(logs);
    //   })
    //   .finally(() => setLoading(false));

    setTimeout(() => {
      const found = mockInstances.find((i) => i.id === id);
      if (found) {
        setInstance(found);
        setLogs(mockLogs.filter((l) => l.instance_id === id));
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAction = async (action: 'start' | 'stop' | 'restart' | 'delete') => {
    if (!instance) return;

    if (action === 'delete') {
      if (!confirm('Are you sure you want to delete this instance?')) return;
    }

    setActionLoading(true);

    try {
      // TODO: Replace with real API calls
      // if (action === 'delete') {
      //   await api.deleteInstance(instance.id);
      //   router.push('/dashboard');
      // } else {
      //   const updated = await api[`${action}Instance`](instance.id);
      //   setInstance(updated);
      // }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (action === 'delete') {
        router.push('/dashboard');
      } else {
        const newStatus =
          action === 'start' ? 'running' : action === 'stop' ? 'stopped' : instance.status;
        setInstance({ ...instance, status: newStatus });
      }
    } catch (error) {
      console.error('Action failed:', error);
      alert('Action failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-400 py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!instance) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Instance not found</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-purple-400 hover:text-purple-300"
          >
            ← Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-400 hover:text-white mb-4 inline-flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{instance.name}</h1>
              <p className="text-gray-400 mt-1">Instance ID: {instance.id}</p>
            </div>
            <StatusBadge status={instance.status} />
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Configuration</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-400">Model</dt>
                <dd className="text-sm font-medium text-white mt-1">{instance.model}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Channel</dt>
                <dd className="text-sm font-medium text-white mt-1">{instance.channel}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Plan</dt>
                <dd className="text-sm font-medium text-white mt-1">{instance.plan}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Bot Token</dt>
                <dd className="text-sm font-mono text-white mt-1">
                  {instance.bot_token.slice(0, 10)}...
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Runtime Info</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-400">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={instance.status} />
                </dd>
              </div>
              {instance.ip && (
                <div>
                  <dt className="text-sm text-gray-400">IP Address</dt>
                  <dd className="text-sm font-mono text-white mt-1">{instance.ip}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-gray-400">Created</dt>
                <dd className="text-sm text-white mt-1">
                  {new Date(instance.created_at).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Last Updated</dt>
                <dd className="text-sm text-white mt-1">
                  {new Date(instance.updated_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleAction('start')}
              disabled={actionLoading || instance.status === 'running'}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Start
            </button>
            <button
              onClick={() => handleAction('stop')}
              disabled={actionLoading || instance.status === 'stopped'}
              className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Stop
            </button>
            <button
              onClick={() => handleAction('restart')}
              disabled={actionLoading || instance.status !== 'running'}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Restart
            </button>
            <button
              onClick={() => handleAction('delete')}
              disabled={actionLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="rounded-lg border border-gray-800 bg-gray-900">
          <div className="border-b border-gray-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Recent Logs</h2>
          </div>
          <div className="p-6">
            {logs.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No logs available</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 rounded-lg bg-gray-800 px-4 py-3 font-mono text-xs"
                  >
                    <span
                      className={`font-medium ${
                        log.level === 'error'
                          ? 'text-red-400'
                          : log.level === 'warn'
                          ? 'text-yellow-400'
                          : 'text-green-400'
                      }`}
                    >
                      [{log.level.toUpperCase()}]
                    </span>
                    <span className="text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-gray-300 flex-1">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
