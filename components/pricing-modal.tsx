'use client';

import { PLANS, type PlanTier } from '@/lib/billing';
import { api } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: PlanTier;
  highlightPlan?: PlanTier;
  reason?: string;
}

export function PricingModal({
  isOpen,
  onClose,
  currentPlan = 'free',
  highlightPlan,
  reason,
}: PricingModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<PlanTier | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async (plan: PlanTier) => {
    if (plan === 'free') return; // Can't "upgrade" to free

    setLoading(plan);
    try {
      const response = await api.createCheckoutSession(plan as 'pro' | 'business');
      // Redirect to Stripe Checkout (or mock success page)
      window.location.href = response.checkout_url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-800 bg-gray-950 p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white">Choose Your Plan</h2>
          {reason && (
            <p className="mt-2 text-gray-400">{reason}</p>
          )}
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(PLANS).map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const isHighlighted = plan.id === highlightPlan || plan.popular;
            const isUpgrade = plan.price > PLANS[currentPlan].price;

            return (
              <div
                key={plan.id}
                className={`relative rounded-lg border-2 p-6 transition-all ${
                  isHighlighted
                    ? 'border-purple-500 bg-purple-500/5 scale-105'
                    : 'border-gray-800 bg-gray-900'
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-3 py-1 text-xs font-semibold text-white">
                      POPULAR
                    </span>
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrent && (
                  <div className="absolute -top-3 right-4">
                    <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                      CURRENT
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-white">{plan.displayPrice}</span>
                    {plan.price > 0 && <span className="text-gray-400">/month</span>}
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  {plan.features.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-300">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || loading !== null || !isUpgrade}
                  className={`w-full rounded-lg py-3 text-sm font-semibold transition-all ${
                    isCurrent
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : isUpgrade
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg'
                      : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading === plan.id
                    ? 'Loading...'
                    : isCurrent
                    ? 'Current Plan'
                    : isUpgrade
                    ? 'Upgrade Now'
                    : 'Downgrade'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>All plans include a 14-day free trial. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}
