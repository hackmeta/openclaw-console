'use client';

const steps = [
  { id: 1, label: 'Creating instance' },
  { id: 2, label: 'Starting virtual machine' },
  { id: 3, label: 'Installing OpenClaw' },
  { id: 4, label: 'Connecting to Telegram' },
  { id: 5, label: 'Bot online' },
];

interface DeployProgressProps {
  step: number;
  error?: string;
  instanceId?: string | null;
  onViewInstance?: () => void;
  onBackToDashboard?: () => void;
}

export function DeployProgress({ step, error, instanceId, onViewInstance, onBackToDashboard }: DeployProgressProps) {
  const isComplete = step >= 5 && !error;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        {isComplete ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Your bot is live!</h2>
            <p className="text-gray-400 mt-2">Open Telegram and start chatting with your bot</p>
          </>
        ) : error ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Deploy failed</h2>
            <p className="text-red-400 mt-2">{error}</p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 mb-4 animate-pulse">
              <span className="text-3xl">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Deploying your bot...</h2>
            <p className="text-gray-400 mt-2">This usually takes about 30 seconds</p>
          </>
        )}
      </div>

      {/* Progress Steps */}
      <div className="space-y-3 mb-8">
        {steps.map((s) => {
          const isDone = step > s.id;
          const isCurrent = step === s.id && !error;
          const isPending = step < s.id;

          return (
            <div key={s.id} className="flex items-center gap-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isCurrent ? (
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-600" />
                  </div>
                )}
              </div>

              {/* Label */}
              <span className={`text-sm ${
                isDone ? 'text-green-400' : isCurrent ? 'text-white font-medium' : 'text-gray-600'
              }`}>
                {s.label}
                {isCurrent && !error && '...'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      {!error && !isComplete && (
        <div className="mb-8">
          <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      {isComplete && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={onViewInstance}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            View Instance
          </button>
          <button
            onClick={onBackToDashboard}
            className="rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {error && (
        <div className="flex justify-center">
          <button
            onClick={onBackToDashboard}
            className="rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
