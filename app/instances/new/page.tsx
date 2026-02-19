'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { PricingModal } from '@/components/pricing-modal';
import { api } from '@/lib/api';
import { friendlyError } from '@/lib/error';
import { canCreateInstance, isModelAvailable, getRemainingSlots, getSuggestedUpgrade, getPlan } from '@/lib/billing';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ModelType, ChannelType, PlanTier, ChannelConfig } from '@/types';

const models: ModelType[] = [
  'yunwu/gpt-4o-mini',
  'yunwu/gpt-4o',
  'anthropic/claude-sonnet-4-5',
];

const modelDisplayNames: Record<ModelType, string> = {
  'yunwu/gpt-4o-mini': 'GPT-4o Mini',
  'yunwu/gpt-4o': 'GPT-4o',
  'anthropic/claude-sonnet-4-5': 'Claude Sonnet 4.5',
};

const channels: Array<{ 
  type: ChannelType; 
  label: string; 
  icon: string; 
  color: string; 
  disabled?: boolean;
  comingSoon?: boolean;
}> = [
  { type: 'telegram', label: 'Telegram', icon: '✈️', color: 'blue' },
  { type: 'discord', label: 'Discord', icon: '🎮', color: 'purple', comingSoon: true },
  { type: 'whatsapp', label: 'WhatsApp', icon: '💬', color: 'green', disabled: true, comingSoon: true },
];

export default function NewInstancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPlan, setCurrentPlan] = useState<PlanTier>('free');
  const [instanceCount, setInstanceCount] = useState(0);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingReason, setPricingReason] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: 'yunwu/gpt-4o-mini' as ModelType,
    channel: 'telegram' as ChannelType,
    // Channel-specific configs
    botToken: '',
    guildId: '',
    phoneNumber: '',
  });

  useEffect(() => {
    loadUserPlanAndInstances();
  }, []);

  const loadUserPlanAndInstances = async () => {
    try {
      const [subscription, instances] = await Promise.all([
        api.getSubscription(),
        api.getInstances(),
      ]);
      setCurrentPlan(subscription.plan);
      setInstanceCount(instances.length);
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  const handleModelSelect = (model: ModelType) => {
    // Check if model is available for current plan
    if (!isModelAvailable(currentPlan, model)) {
      const suggestedPlan = getSuggestedUpgrade(currentPlan);
      if (suggestedPlan) {
        setPricingReason(`${modelDisplayNames[model]} is only available on ${getPlan(suggestedPlan).name} plan or higher.`);
        setShowPricingModal(true);
      }
      return;
    }
    setFormData({ ...formData, model });
  };

  const handleChannelSelect = (channel: ChannelType) => {
    setFormData({ ...formData, channel });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check instance limit
    if (!canCreateInstance(currentPlan, instanceCount)) {
      const suggestedPlan = getSuggestedUpgrade(currentPlan);
      if (suggestedPlan) {
        setPricingReason(`You've reached the instance limit for ${getPlan(currentPlan).name} plan. Upgrade to create more instances.`);
        setShowPricingModal(true);
      } else {
        setError("You've reached your plan limit. Upgrade to create more instances.");
      }
      return;
    }

    // Check model availability
    if (!isModelAvailable(currentPlan, formData.model)) {
      const suggestedPlan = getSuggestedUpgrade(currentPlan);
      if (suggestedPlan) {
        setPricingReason(`${modelDisplayNames[formData.model]} is not available on your current plan.`);
        setShowPricingModal(true);
      }
      return;
    }

    // Show warning for Discord (coming soon)
    if (formData.channel === 'discord') {
      if (!confirm('Discord support is coming soon. The instance will be created but may not work until backend support is added. Continue?')) {
        return;
      }
    }

    setLoading(true);

    try {
      // Parse model string to get provider and model
      const [provider, ...modelParts] = formData.model.split('/');
      const model = modelParts.join('/');

      // Build channel config based on channel type
      const channelConfig: ChannelConfig = {};
      if (formData.channel === 'telegram') {
        channelConfig.bot_token_secret_id = formData.botToken;
      } else if (formData.channel === 'discord') {
        channelConfig.bot_token_secret_id = formData.botToken;
        channelConfig.guild_id = formData.guildId;
      } else if (formData.channel === 'whatsapp') {
        channelConfig.phone_number = formData.phoneNumber;
      }

      await api.createInstance({
        name: formData.name,
        description: formData.description,
        type: 'channel',
        llm_provider: provider,
        llm_model: model,
        channel_type: formData.channel,
        channel_config: channelConfig,
        vm_template: 'openclaw-template',
        vm_cpu: 2,
        vm_memory_mb: 2048,
        vm_disk_gb: 10,
      });
      
      router.push('/dashboard');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const remainingSlots = getRemainingSlots(currentPlan, instanceCount);
  const planInfo = getPlan(currentPlan);

  // Get current channel info
  const selectedChannelInfo = channels.find((ch) => ch.type === formData.channel);

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Create New Instance</h1>
          <p className="text-gray-400 mt-1">
            Deploy a new OpenClaw bot instance
          </p>
        </div>

        {/* Plan Status Banner */}
        <div className="mb-6 rounded-lg border border-gray-800 bg-gray-900 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-500/10 p-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {planInfo.name} Plan - {instanceCount} / {planInfo.features.maxInstances} instances used
                </p>
                <p className="text-xs text-gray-400">
                  {remainingSlots > 0
                    ? `${remainingSlots} slot${remainingSlots > 1 ? 's' : ''} remaining`
                    : 'No slots remaining'}
                </p>
              </div>
            </div>
            {remainingSlots === 0 && (
              <button
                onClick={() => {
                  setPricingReason('Upgrade to create more instances');
                  setShowPricingModal(true);
                }}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Upgrade Plan
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Instance Name */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
            
            <div className="space-y-4">
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
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="A brief description of this bot instance"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">AI Model</h2>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {models.map((model) => {
                const isAvailable = isModelAvailable(currentPlan, model);
                const isSelected = formData.model === model;

                return (
                  <button
                    key={model}
                    type="button"
                    onClick={() => handleModelSelect(model)}
                    className={`relative rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : isAvailable
                        ? 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                        : 'border-gray-800 bg-gray-900 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {modelDisplayNames[model]}
                    {!isAvailable && (
                      <div className="absolute -top-2 -right-2">
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {!isModelAvailable(currentPlan, formData.model) && (
              <p className="mt-3 text-xs text-yellow-400">
                🔒 Some models require a higher plan tier
              </p>
            )}
          </div>

          {/* Channel Configuration */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Channel</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Channel Type
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {channels.map((channel) => {
                    const isSelected = formData.channel === channel.type;
                    const isDisabled = channel.disabled;

                    return (
                      <button
                        key={channel.type}
                        type="button"
                        onClick={() => !isDisabled && handleChannelSelect(channel.type)}
                        disabled={isDisabled}
                        className={`relative rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                          isSelected
                            ? `border-${channel.color}-500 bg-${channel.color}-500/10 text-${channel.color}-400`
                            : isDisabled
                            ? 'border-gray-800 bg-gray-900 text-gray-600 cursor-not-allowed'
                            : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                        }`}
                        style={
                          isSelected
                            ? {
                                borderColor: channel.color === 'blue' ? '#3b82f6' : channel.color === 'purple' ? '#a855f7' : '#22c55e',
                                backgroundColor: channel.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : channel.color === 'purple' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                color: channel.color === 'blue' ? '#60a5fa' : channel.color === 'purple' ? '#c084fc' : '#4ade80',
                              }
                            : {}
                        }
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className={isDisabled ? 'grayscale' : ''}>{channel.icon}</span>
                          <span>{channel.label}</span>
                        </div>
                        {channel.comingSoon && (
                          <span className="mt-1 block text-xs text-gray-500">Coming Soon</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Telegram Config */}
              {formData.channel === 'telegram' && (
                <div>
                  <label htmlFor="botToken" className="block text-sm font-medium text-gray-300 mb-2">
                    Bot Token Secret ID
                  </label>
                  <input
                    id="botToken"
                    type="text"
                    required
                    value={formData.botToken}
                    onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-sm"
                    placeholder="secret-id-from-secret-manager"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the secret ID for your bot token stored in the secret manager
                  </p>
                </div>
              )}

              {/* Discord Config */}
              {formData.channel === 'discord' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="discordBotToken" className="block text-sm font-medium text-gray-300 mb-2">
                      Bot Token Secret ID
                    </label>
                    <input
                      id="discordBotToken"
                      type="text"
                      required
                      value={formData.botToken}
                      onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-sm"
                      placeholder="secret-id-for-discord-bot-token"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Discord bot token stored in the secret manager
                    </p>
                  </div>
                  <div>
                    <label htmlFor="guildId" className="block text-sm font-medium text-gray-300 mb-2">
                      Server ID (Guild ID)
                    </label>
                    <input
                      id="guildId"
                      type="text"
                      required
                      value={formData.guildId}
                      onChange={(e) => setFormData({ ...formData, guildId: e.target.value })}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-sm"
                      placeholder="123456789012345678"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Your Discord server ID (enable Developer Mode to copy it)
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 px-4 py-3 text-sm text-purple-400">
                    ⚠️ Discord support is coming soon. Backend integration in progress.
                  </div>
                </div>
              )}

              {/* WhatsApp Config */}
              {formData.channel === 'whatsapp' && (
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    disabled
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-500 placeholder-gray-600 cursor-not-allowed font-mono text-sm"
                    placeholder="+1234567890"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    WhatsApp integration coming soon
                  </p>
                </div>
              )}
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
              disabled={loading || remainingSlots === 0}
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

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        currentPlan={currentPlan}
        highlightPlan={getSuggestedUpgrade(currentPlan) || 'pro'}
        reason={pricingReason}
      />
    </DashboardLayout>
  );
}
