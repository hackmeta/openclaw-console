'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { friendlyError } from '@/lib/error';
import { canCreateInstance, isModelAvailable, getRemainingSlots, getSuggestedUpgrade, getPlan } from '@/lib/billing';
import { PricingModal } from '@/components/pricing-modal';
import { DeployProgress } from '@/components/deploy-progress';
import type { ModelType, ChannelType, PlanTier } from '@/types';

const modelDefaults: Record<PlanTier, ModelType> = {
  free: 'yunwu/gpt-4o-mini',
  pro: 'anthropic/claude-sonnet-4-5',
  business: 'anthropic/claude-sonnet-4-5',
};

const modelDisplayNames: Record<ModelType, string> = {
  'yunwu/gpt-4o-mini': 'GPT-4o Mini',
  'yunwu/gpt-4o': 'GPT-4o',
  'anthropic/claude-sonnet-4-5': 'Claude Sonnet 4.5',
};

const models: ModelType[] = [
  'yunwu/gpt-4o-mini',
  'yunwu/gpt-4o',
  'anthropic/claude-sonnet-4-5',
];

const channelOptions: Array<{ type: ChannelType; label: string; icon: string }> = [
  { type: 'telegram', label: 'Telegram', icon: '✈️' },
  { type: 'discord', label: 'Discord', icon: '🎮' },
  { type: 'whatsapp', label: 'WhatsApp', icon: '💬' },
];

interface DeployCardProps {
  currentPlan: PlanTier;
  instanceCount: number;
  onDeployed?: () => void;
}

export function DeployCard({ currentPlan, instanceCount, onDeployed }: DeployCardProps) {
  const router = useRouter();
  const [botToken, setBotToken] = useState('');
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  
  // Deploy progress
  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [deployedInstanceId, setDeployedInstanceId] = useState<string | null>(null);
  const [deployError, setDeployError] = useState('');

  // Advanced options with defaults
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<ChannelType>('telegram');
  const [model, setModel] = useState<ModelType>(modelDefaults[currentPlan]);

  const getAutoName = () => {
    return `my-bot-${String(instanceCount + 1).padStart(3, '0')}`;
  };

  const handleDeploy = async () => {
    setError('');
    setDeployError('');

    if (!botToken.trim()) {
      setError('Please paste your Bot Token');
      return;
    }

    // Check instance limit
    if (!canCreateInstance(currentPlan, instanceCount)) {
      setShowPricingModal(true);
      return;
    }

    // Check model availability
    if (!isModelAvailable(currentPlan, model)) {
      setShowPricingModal(true);
      return;
    }

    setDeploying(true);
    setDeployStep(1);

    try {
      const instanceName = name.trim() || getAutoName();
      const [provider, ...modelParts] = model.split('/');
      const modelName = modelParts.join('/');

      // Step 1: Creating instance
      setDeployStep(1);
      await new Promise(r => setTimeout(r, 500));

      // Step 2: Create instance
      setDeployStep(2);
      const instance = await api.createInstance({
        name: instanceName,
        type: 'channel',
        llm_provider: provider,
        llm_model: modelName,
        channel_type: channel,
        channel_config: {
          bot_token: botToken.trim(),
        },
        vm_template: 'openclaw-template',
        vm_cpu: 2,
        vm_memory_mb: 4096,
        vm_disk_gb: 10,
      });

      // Step 3: Auto-start (creates VM + installs OpenClaw)
      setDeployStep(3);
      await api.startInstance(instance.id);

      // Step 4: Connecting channel (wait for VM boot)
      setDeployStep(4);
      // Poll instance status until running or timeout
      const startTime = Date.now();
      const timeout = 120000; // 2 min
      let isRunning = false;
      while (Date.now() - startTime < timeout) {
        await new Promise(r => setTimeout(r, 3000));
        try {
          const status = await api.getInstance(instance.id);
          if (status.status === 'running') {
            isRunning = true;
            break;
          }
          if (status.status === 'error' || status.status === 'stopped') {
            throw new Error('Instance failed to start');
          }
        } catch (pollErr: any) {
          if (pollErr.message === 'Instance failed to start') throw pollErr;
          // ignore transient poll errors
        }
      }

      // Step 5: Bot online
      setDeployStep(5);
      setDeployedInstanceId(instance.id);
      if (!isRunning) {
        setDeployError('Instance is taking longer than expected. Check the instance page for status.');
      }

    } catch (err) {
      setDeployError(friendlyError(err));
    }
  };

  // Show deploy progress
  if (deploying) {
    return (
      <DeployProgress
        step={deployStep}
        error={deployError}
        instanceId={deployedInstanceId}
        onViewInstance={() => {
          if (deployedInstanceId) {
            router.push(`/instances/${deployedInstanceId}`);
          }
        }}
        onBackToDashboard={() => {
          setDeploying(false);
          setDeployStep(0);
          setDeployedInstanceId(null);
          setBotToken('');
          onDeployed?.();
        }}
      />
    );
  }

  return (
    <>
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 mb-4">
            <span className="text-3xl">🤖</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Deploy your first bot</h2>
          <p className="text-gray-400 mt-2">Get your AI bot running in 30 seconds</p>
        </div>

        {/* BotFather Guide */}
        <div className="mb-6">
          <div className="flex items-start gap-3 text-sm text-gray-400">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">1</span>
                <span>Open Telegram, search <span className="text-blue-400 font-medium">@BotFather</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">2</span>
                <span>Send <code className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 text-xs">/newbot</code> and follow the prompts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">3</span>
                <span>Copy the token and paste it below</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="mt-3 text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            {showGuide ? '▾ Hide detailed guide' : '▸ Show detailed guide'}
          </button>
          {showGuide && (
            <div className="mt-3 rounded-lg bg-gray-800/50 border border-gray-700 p-4 text-xs text-gray-400 space-y-2">
              <p>1. Open Telegram and search for <span className="text-blue-400">@BotFather</span></p>
              <p>2. Send <code className="px-1 py-0.5 rounded bg-gray-800 text-gray-300">/newbot</code></p>
              <p>3. Choose a display name (e.g. &quot;My AI Assistant&quot;)</p>
              <p>4. Choose a username ending in &quot;bot&quot; (e.g. &quot;my_ai_assistant_bot&quot;)</p>
              <p>5. BotFather will send you a token like: <code className="px-1 py-0.5 rounded bg-gray-800 text-gray-300">7123456789:AAHfiqksKZ8WmR2zMfghSh...</code></p>
              <p>6. Copy the entire token and paste it in the field below</p>
            </div>
          )}
        </div>

        {/* Bot Token Input */}
        <div className="mb-4">
          <input
            type="text"
            value={botToken}
            onChange={(e) => { setBotToken(e.target.value); setError(''); }}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-sm"
            placeholder="Paste your Bot Token here"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Deploy Button */}
        <button
          onClick={handleDeploy}
          disabled={!botToken.trim()}
          className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          🚀 Deploy Now
        </button>

        {/* Advanced Options */}
        <div className="mt-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            {showAdvanced ? '▾ Hide advanced options' : '▸ Advanced options'}
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 rounded-lg border border-gray-800 bg-gray-800/30 p-4">
              {/* Instance Name */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Instance Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder={getAutoName()}
                />
              </div>

              {/* Channel */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Channel
                </label>
                <div className="flex gap-2">
                  {channelOptions.map((ch) => (
                    <button
                      key={ch.type}
                      type="button"
                      onClick={() => setChannel(ch.type)}
                      disabled={ch.type !== 'telegram'}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        channel === ch.type
                          ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                          : ch.type === 'telegram'
                          ? 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                          : 'border-gray-800 bg-gray-900 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <span>{ch.icon}</span>
                      <span>{ch.label}</span>
                      {ch.type !== 'telegram' && <span className="text-gray-600 text-[10px]">Soon</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  AI Model
                </label>
                <div className="flex gap-2 flex-wrap">
                  {models.map((m) => {
                    const available = isModelAvailable(currentPlan, m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => available && setModel(m)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          model === m
                            ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                            : available
                            ? 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                            : 'border-gray-800 bg-gray-900 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {modelDisplayNames[m]}
                        {!available && ' 🔒'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        currentPlan={currentPlan}
        highlightPlan={getSuggestedUpgrade(currentPlan) || 'pro'}
        reason="Upgrade to create more instances or access more models."
      />
    </>
  );
}
