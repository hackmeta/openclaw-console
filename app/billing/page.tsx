'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { PricingModal } from '@/components/pricing-modal';
import { api } from '@/lib/api';
import { friendlyError } from '@/lib/error';
import { PLANS } from '@/lib/billing';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Subscription, Invoice } from '@/types';

function BillingContent() {
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadBillingData();

    // Check for success parameter
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const loadBillingData = async () => {
    try {
      const [sub, inv] = await Promise.all([
        api.getSubscription(),
        api.getInvoices(),
      ]);
      setSubscription(sub);
      setInvoices(inv);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await api.createBillingPortal();
      window.location.href = response.portal_url;
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      alert(friendlyError(error));
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-400">Loading billing information...</div>
        </div>
      </DashboardLayout>
    );
  }

  const currentPlan = subscription ? PLANS[subscription.plan] : PLANS.free;
  const periodEnd = subscription
    ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing</h1>
          <p className="text-gray-400 mt-1">Manage your subscription and billing</p>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Payment successful! Your subscription has been updated.</span>
            </div>
          </div>
        )}

        {/* Current Plan */}
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Current Plan</h2>
              {subscription?.cancel_at_period_end && (
                <p className="text-sm text-orange-400 mt-1">
                  ⚠️ Your subscription will cancel at the end of the billing period
                </p>
              )}
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                subscription?.status === 'active'
                  ? 'bg-green-500/10 text-green-400'
                  : subscription?.status === 'trialing'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {subscription?.status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{currentPlan.name}</p>
              <p className="text-gray-400 mt-2">
                {currentPlan.displayPrice}
                {currentPlan.price > 0 && '/month'}
              </p>
              {periodEnd && subscription?.plan !== 'free' && (
                <p className="text-sm text-gray-500 mt-1">
                  {subscription?.cancel_at_period_end
                    ? `Access until ${periodEnd}`
                    : `Renews on ${periodEnd}`}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              {subscription?.plan !== 'business' && (
                <button
                  onClick={() => setShowPricing(true)}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                >
                  Upgrade Plan
                </button>
              )}
              {subscription?.plan !== 'free' && (
                <button
                  onClick={handleManageSubscription}
                  className="rounded-lg border border-gray-700 px-6 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Manage Subscription
                </button>
              )}
            </div>
          </div>

          {/* Plan features */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Plan includes:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentPlan.features.features.map((feature, idx) => (
                <div key={idx} className="flex items-center text-sm text-gray-300">
                  <svg
                    className="mr-2 h-4 w-4 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="rounded-lg border border-gray-800 bg-gray-900">
          <div className="border-b border-gray-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Billing History</h2>
          </div>
          <div className="p-6">
            {invoices.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                No billing history yet
              </p>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        ${(invoice.amount / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(invoice.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'text-green-400'
                            : invoice.status === 'open'
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }`}
                      >
                        {invoice.status.toUpperCase()}
                      </span>
                      {invoice.pdf_url && (
                        <a
                          href={invoice.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-400 hover:text-purple-300"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm text-blue-400 font-medium">Payment Processing</p>
              <p className="text-sm text-blue-400/80 mt-1">
                All payments are securely processed through Stripe. We never store your payment information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        currentPlan={subscription?.plan || 'free'}
      />
    </DashboardLayout>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-400">Loading billing information...</div>
        </div>
      </DashboardLayout>
    }>
      <BillingContent />
    </Suspense>
  );
}
