'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ModelType, ChannelType, PlanType } from '@/types';

const models: ModelType[] = ['Claude', 'GPT', 'Gemini', 'Kimi'];
const channels: ChannelType[] = ['Telegram'];
const plans: PlanType[] = ['Free', 'Pro', 'Business'];

const planDetails = {
  Free: { price: '$0', features: ['1 Instance', '1000 messages/month', 'Community support'] },
  Pro: { price: '$29', features: ['5 Instances', '50,000 messages/month', 'Priority support'] },
  Business: { price: '$99', features: ['Unlimited Instances', 'Unlimited messages', '24/7 support'] },
};

export default function NewInstancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    model: 'Claude' as ModelType,
    channel: 'Telegram' as ChannelType,
    botToken: '',
    plan: 'Free' as PlanType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Replace with real API call
      // await api.createInstance({
      //   name: formData.name,
      //   model: formData.model,
      //   channel: formData.channel,
      //   bot_token: formData.botToken,
      //   plan: formData.plan,
      // });
      
      // Mock success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create instance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Create New Instance</h1>
          <p className="text-gray-400 mt-1">
            Deploy a new OpenClaw bot instance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Instance Name */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Instance Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="My Production Bot"
              />
            </div>
          </div>

          {/* Model Selection */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">AI Model</h2>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {models.map((model) => (
                <button
                  key={model}
                  type="button"
                  onClick={() => setFormData({ ...formData, model })}
                  className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    formData.model === model
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                      : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* Channel Configuration */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Channel</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Channel Type
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {channels.map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => setFormData({ ...formData, channel })}
                      className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                        formData.channel === channel
                          ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                          : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="botToken" className="block text-sm font-medium text-gray-300 mb-2">
                  Bot Token
                </label>
                <input
                  id="botToken"
                  type="text"
                  required
                  value={formData.botToken}
                  onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-sm"
                  placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Get your bot token from @BotFather on Telegram
                </p>
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Select Plan</h2>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {plans.map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setFormData({ ...formData, plan })}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    formData.plan === plan
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="text-lg font-semibold text-white">{plan}</div>
                  <div className="mt-1 text-2xl font-bold text-purple-400">
                    {planDetails[plan].price}
                    <span className="text-sm text-gray-500">/mo</span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {planDetails[plan].features.map((feature) => (
                      <li key={feature} className="text-xs text-gray-400">
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Instance'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-700 px-6 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
