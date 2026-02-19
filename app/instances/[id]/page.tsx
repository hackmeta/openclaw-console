'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { StatusBadge } from '@/components/status-badge';
import { LogViewer } from '@/components/log-viewer';
import { api } from '@/lib/api';
import { friendlyError } from '@/lib/error';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Instance, LogEntry, ChannelType } from '@/types';

// Channel icon and color mapping
const channelInfo: Record<ChannelType, { icon: string; color: string; label: string }> = {
  telegram: { icon: '✈️', color: 'blue', label: 'Telegram' },
  discord: { icon: '🎮', color: 'purple', label: 'Discord' },
  whatsapp: { icon: '💬', color: 'green', label: 'WhatsApp' },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function InstanceDetailPage({ params }: Props) {
  const router = useRouter();
  const [instance, setInstance] = useState<Instance | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [id, setId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'logs'>('overview');

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    loadInstanceData();
  }, [id]);

  const loadInstanceData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const inst = await api.getInstance(id);
      setInstance(inst);
      
      // Load logs if on logs tab
      if (activeTab === 'logs') {
        await loadLogs();
      }
    } catch (error) {
      console.error('Failed to load instance:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    if (!id) return;
    
    try {
      setLogsLoading(true);
      const instanceLogs = await api.getInstanceLogs(id);
      setLogs(instanceLogs);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  // Load logs when switching to logs tab
  useEffect(() => {
    if (activeTab === 'logs' && id && logs.length === 0) {
      loadLogs();
    }
  }, [activeTab, id]);

  const handleAction = async (action: 'start' | 'stop' | 'restart' | 'delete') => {
    if (!instance) return;

    if (action === 'delete') {
      if (!confirm('Are you sure you want to delete this instance?')) return;
    }

    setActionLoading(true);

    try {
      if (action === 'delete') {
        await api.deleteInstance(instance.id);
        router.push('/dashboard');
      } else {
        let updated: Instance;
        if (action === 'start') {
          updated = await api.startInstance(instance.id);
        } else if (action === 'stop') {
          updated = await api.stopInstance(instance.id);
        } else {
          updated = await api.restartInstance(instance.id);
        }
        setInstance(updated);
      }
    } catch (error) {
      console.error('Action failed:', error);
      const message = action === 'start' 
        ? 'Failed to start instance. Please try again.'
        : action === 'stop' 
        ? 'Failed to stop instance.'
        : friendlyError(error);
      alert(message);
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

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                activeTab === 'logs'
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Logs
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <>
            {/* Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Configuration</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-400">Model</dt>
                <dd className="text-sm font-medium text-white mt-1">
                  {instance.llm_model || instance.model || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Provider</dt>
                <dd className="text-sm font-medium text-white mt-1">
                  {instance.llm_provider || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Channel</dt>
                <dd className="text-sm font-medium text-white mt-1">
                  {instance.channel_type || instance.channel ? (
                    <span className="inline-flex items-center gap-2">
                      <span>{channelInfo[instance.channel_type || instance.channel!]?.icon}</span>
                      <span>{channelInfo[instance.channel_type || instance.channel!]?.label}</span>
                    </span>
                  ) : 'N/A'}
                </dd>
              </div>
              {instance.description && (
                <div>
                  <dt className="text-sm text-gray-400">Description</dt>
                  <dd className="text-sm text-white mt-1">{instance.description}</dd>
                </div>
              )}
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
              {(instance.vm_ip || instance.ip) && (
                <div>
                  <dt className="text-sm text-gray-400">IP Address</dt>
                  <dd className="text-sm font-mono text-white mt-1">
                    {instance.vm_ip || instance.ip}
                  </dd>
                </div>
              )}
              {instance.vm_cpu && (
                <div>
                  <dt className="text-sm text-gray-400">CPU</dt>
                  <dd className="text-sm text-white mt-1">{instance.vm_cpu} cores</dd>
                </div>
              )}
              {instance.vm_memory_mb && (
                <div>
                  <dt className="text-sm text-gray-400">Memory</dt>
                  <dd className="text-sm text-white mt-1">{instance.vm_memory_mb} MB</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-gray-400">Created</dt>
                <dd className="text-sm text-white mt-1">
                  {new Date(instance.created_at).toLocaleString()}
                </dd>
              </div>
              {instance.started_at && (
                <div>
                  <dt className="text-sm text-gray-400">Started</dt>
                  <dd className="text-sm text-white mt-1">
                    {new Date(instance.started_at).toLocaleString()}
                  </dd>
                </div>
              )}
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
          </>
        ) : (
          /* Logs Tab */
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Instance Logs</h2>
            <LogViewer
              instanceId={id}
              logs={logs}
              onRefresh={loadLogs}
              loading={logsLoading}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
