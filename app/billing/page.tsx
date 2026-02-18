'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function BillingPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing</h1>
          <p className="text-gray-400 mt-1">Manage your subscription and billing</p>
        </div>

        {/* Current Plan */}
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Current Plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">Free Plan</p>
              <p className="text-gray-400 mt-1">1 instance, 1000 messages/month</p>
            </div>
            <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Usage */}
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Usage This Month</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Messages</span>
                <span className="text-white">234 / 1,000</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '23.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Instances</span>
                <span className="text-white">1 / 1</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="rounded-lg border border-gray-800 bg-gray-900">
          <div className="border-b border-gray-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Billing History</h2>
          </div>
          <div className="p-6">
            <p className="text-center text-gray-400 py-8">
              No billing history yet
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>
          <p className="text-gray-400 mb-4">No payment method added</p>
          <button className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
            Add Payment Method
          </button>
        </div>

        {/* Info */}
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
          <p className="text-sm text-blue-400">
            💡 Stripe integration coming soon. This page is a placeholder.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
