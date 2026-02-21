'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { StatusBadge } from '@/components/status-badge';
import { DeployCard } from '@/components/deploy-card';
import { api } from '@/lib/api';
import { friendlyError } from '@/lib/error';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Instance, ChannelType, PlanTier } from '@/types';

// Channel icon mapping
const channelIcons: Record<ChannelType, string> = {
  telegram: '✈️',
  discord: '🎮',
  whatsapp: '💬',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [resending, setResending] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanTier>('free');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [data, subscription] = await Promise.all([
        api.getInstances(),
        api.getSubscription(),
      ]);
      setInstances(data);
      setCurrentPlan(subscription.plan);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(friendlyError(err));
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

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await api.resendVerification();
      alert('Verification email sent! Please check your inbox.');
    } catch (err) {
      console.error('Failed to resend verification:', err);
      alert(friendlyError(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Email Verification Banner */}
        {user && user.email_verified === false && (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-4 py-3">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-yellow-200">
                  Your email is not verified. Please check your inbox or{' '}
                  <button
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="underline hover:no-underline font-medium disabled:opacity-50"
                  >
                    {resending ? 'sending...' : 'resend verification email'}
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : error ? (
          /* Error */
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
            <button
              onClick={loadData}
              className="ml-4 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        ) : instances.length === 0 ? (
          /* Empty State: Deploy Card */
          <div className="py-8">
            <DeployCard
              currentPlan={currentPlan}
              instanceCount={0}
              onDeployed={loadData}
            />
          </div>
        ) : (
          /* Has Instances */
          <>
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

            {/* Instances List */}
            <div className="rounded-lg border border-gray-800 bg-gray-900">
              <div className="border-b border-gray-800 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">All Instances</h2>
              </div>

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
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
