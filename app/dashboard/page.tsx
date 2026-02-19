'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { StatusBadge } from '@/components/status-badge';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Instance, ChannelType } from '@/types';

// Channel icon mapping
const channelIcons: Record<ChannelType, string> = {
  telegram: '✈️',
  discord: '🎮',
  whatsapp: '💬',
};

export default function DashboardPage() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getInstances();
      setInstances(data);
    } catch (err) {
      console.error('Failed to load instances:', err);
      setError(err instanceof Error ? err.message : 'Failed to load instances');
    } finally {
      setLoading(false);
    }
  };

  // Map agent data to instance display format
  const getDisplayModel = (instance: Instance) => {
    return instance.llm_model || instance.model || 'N/A';
  };

  const getDisplayPlan = (instance: Instance) => {
    return instance.plan || 'Free';
  };

  const getDisplayIP = (instance: Instance) => {
    return instance.vm_ip || instance.ip;
  };

  const getChannelIcon = (instance: Instance) => {
    const channelType = instance.channel_type || instance.channel;
    return channelType ? channelIcons[channelType] : '📡';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Instances</h1>
            <p className="text-gray-400 mt-1">
              Manage your OpenClaw bot instances
            </p>
          </div>
          <Link
            href="/instances/new"
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            + New Instance
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="text-sm text-gray-400">Total Instances</div>
            <div className="mt-2 text-3xl font-bold text-white">
              {instances.length}
            </div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="text-sm text-gray-400">Running</div>
            <div className="mt-2 text-3xl font-bold text-green-400">
              {instances.filter((i) => i.status === 'running').length}
            </div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="text-sm text-gray-400">Stopped</div>
            <div className="mt-2 text-3xl font-bold text-gray-400">
              {instances.filter((i) => i.status === 'stopped').length}
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
            <button
              onClick={loadInstances}
              className="ml-4 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Instances List */}
        <div className="rounded-lg border border-gray-800 bg-gray-900">
          <div className="border-b border-gray-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">All Instances</h2>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-gray-400">
              Loading instances...
            </div>
          ) : instances.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 mb-4">No instances yet</p>
              <Link
                href="/instances/new"
                className="inline-flex rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
              >
                Create your first instance
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {instances.map((instance) => (
                <Link
                  key={instance.id}
                  href={`/instances/${instance.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-base">{getChannelIcon(instance)}</span>
                      <h3 className="text-sm font-medium text-white">
                        {instance.name}
                      </h3>
                      <StatusBadge status={instance.status} />
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                      <span>Model: {getDisplayModel(instance)}</span>
                      <span>•</span>
                      <span>Plan: {getDisplayPlan(instance)}</span>
                      {getDisplayIP(instance) && (
                        <>
                          <span>•</span>
                          <span>IP: {getDisplayIP(instance)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-400">→</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
