'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { useState } from 'react';

const sections = [
  { id: 'getting-started', title: 'Getting Started' },
  { id: 'managing-instances', title: 'Managing Instances' },
  { id: 'models', title: 'Models' },
  { id: 'billing', title: 'Billing' },
  { id: 'channels', title: 'Channels' },
  { id: 'faq', title: 'FAQ' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex gap-8">
        {/* Left sidebar - Table of Contents */}
        <aside className="w-64 shrink-0">
          <div className="sticky top-8">
            <h2 className="text-lg font-semibold text-white mb-4">Documentation</h2>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                    ${
                      activeSection === section.id
                        ? 'bg-gray-800 text-white font-medium'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }
                  `}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 max-w-4xl">
          <div className="prose prose-invert max-w-none">
            {/* Getting Started */}
            <section id="getting-started" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl font-bold text-white mb-6">Getting Started</h2>
              
              <h3 className="text-xl font-semibold text-white mt-8 mb-4">What is OpenClaw Hosting?</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                OpenClaw Hosting is a managed platform for running AI agents powered by large language models. 
                Deploy your bot instances with support for multiple channels like Telegram, Discord, and WhatsApp.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Each instance runs independently with its own configuration, model selection, and channel connections. 
                Focus on building your bot's logic while we handle infrastructure, scaling, and uptime.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Creating Your First Instance</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-4">
                <li>Navigate to the <strong className="text-white">Instances</strong> page from the sidebar</li>
                <li>Click <strong className="text-white">Create New Instance</strong></li>
                <li>Choose your preferred model (GPT-4o-mini, GPT-4o, or Claude Sonnet)</li>
                <li>Select a plan (Free, Pro, or Business)</li>
                <li>Click <strong className="text-white">Create Instance</strong></li>
              </ol>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your instance will start automatically and be ready to connect within seconds.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Connecting Telegram Bot</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-4">
                <li>Create a bot using <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">@BotFather</a> on Telegram</li>
                <li>Copy the bot token provided by BotFather</li>
                <li>Go to your instance settings in the OpenClaw Console</li>
                <li>Navigate to the <strong className="text-white">Channels</strong> tab</li>
                <li>Paste your bot token and click <strong className="text-white">Connect</strong></li>
                <li>Your bot is now live! Send a message to test it</li>
              </ol>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 my-6">
                <p className="text-gray-400 text-sm mb-2">📸 Screenshot placeholder:</p>
                <div className="bg-gray-900 rounded border border-gray-700 h-48 flex items-center justify-center text-gray-600">
                  Telegram bot connection interface
                </div>
              </div>
            </section>

            {/* Managing Instances */}
            <section id="managing-instances" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl font-bold text-white mb-6">Managing Instances</h2>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Starting and Stopping</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Control your instance state from the dashboard:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
                <li><strong className="text-white">Start:</strong> Click the play button (▶️) to start a stopped instance</li>
                <li><strong className="text-white">Stop:</strong> Click the stop button (⏹️) to gracefully shut down</li>
                <li><strong className="text-white">Auto-start:</strong> Instances on paid plans start automatically after system updates</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Viewing Logs</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Access real-time logs to debug and monitor your instance:
              </p>
              <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
                <li>Click on your instance from the dashboard</li>
                <li>Navigate to the <strong className="text-white">Logs</strong> tab</li>
                <li>Filter by log level (Info, Warning, Error)</li>
                <li>Use search to find specific events</li>
              </ol>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-xs text-gray-400 my-6">
                <div>[2026-02-19 16:08:32] INFO: Instance started successfully</div>
                <div>[2026-02-19 16:08:35] INFO: Connected to Telegram</div>
                <div>[2026-02-19 16:08:40] INFO: Received message from user @johndoe</div>
              </div>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Restarting</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Restart your instance to apply configuration changes or recover from errors:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
                <li>Click the restart button (🔄) from the instance actions menu</li>
                <li>The instance will stop gracefully and restart with the latest config</li>
                <li>Downtime is typically less than 10 seconds</li>
              </ul>
            </section>

            {/* Models */}
            <section id="models" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl font-bold text-white mb-6">Models</h2>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Available Models</h3>
              <div className="space-y-6 mb-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                  <h4 className="text-lg font-semibold text-white mb-2">GPT-4o-mini</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Fast and cost-effective model for general-purpose conversations. 
                    Great for chatbots, customer support, and simple automation tasks.
                  </p>
                  <div className="text-xs text-gray-400">
                    <span className="bg-gray-900 px-2 py-1 rounded">Fast</span>
                    <span className="bg-gray-900 px-2 py-1 rounded ml-2">Affordable</span>
                  </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                  <h4 className="text-lg font-semibold text-white mb-2">GPT-4o</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Advanced reasoning and multimodal capabilities. Ideal for complex tasks, 
                    creative writing, and detailed analysis.
                  </p>
                  <div className="text-xs text-gray-400">
                    <span className="bg-gray-900 px-2 py-1 rounded">Powerful</span>
                    <span className="bg-gray-900 px-2 py-1 rounded ml-2">Multimodal</span>
                  </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                  <h4 className="text-lg font-semibold text-white mb-2">Claude Sonnet</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Anthropic's balanced model with strong reasoning and safety features. 
                    Excellent for nuanced conversations and ethical AI applications.
                  </p>
                  <div className="text-xs text-gray-400">
                    <span className="bg-gray-900 px-2 py-1 rounded">Balanced</span>
                    <span className="bg-gray-900 px-2 py-1 rounded ml-2">Safe</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Switching Models</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
                <li>Go to your instance settings</li>
                <li>Click the <strong className="text-white">Model</strong> dropdown</li>
                <li>Select your preferred model</li>
                <li>Click <strong className="text-white">Save Changes</strong></li>
                <li>Restart the instance to apply the new model</li>
              </ol>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Model Pricing Differences</h3>
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden my-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold">Model</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold">Input (per 1M tokens)</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold">Output (per 1M tokens)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="px-4 py-3 text-white">GPT-4o-mini</td>
                      <td className="px-4 py-3 text-gray-300">$0.15</td>
                      <td className="px-4 py-3 text-gray-300">$0.60</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-white">GPT-4o</td>
                      <td className="px-4 py-3 text-gray-300">$2.50</td>
                      <td className="px-4 py-3 text-gray-300">$10.00</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-white">Claude Sonnet</td>
                      <td className="px-4 py-3 text-gray-300">$3.00</td>
                      <td className="px-4 py-3 text-gray-300">$15.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Billing */}
            <section id="billing" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl font-bold text-white mb-6">Billing</h2>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Plans Overview</h3>
              <div className="grid gap-6 mb-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                  <div className="flex items-baseline gap-3 mb-3">
                    <h4 className="text-lg font-semibold text-white">Free</h4>
                    <span className="text-2xl font-bold text-white">$0</span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>✓ 1 instance</li>
                    <li>✓ GPT-4o-mini only</li>
                    <li>✓ 100 messages/day</li>
                    <li>✓ Community support</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-lg p-5">
                  <div className="flex items-baseline gap-3 mb-3">
                    <h4 className="text-lg font-semibold text-white">Pro</h4>
                    <span className="text-2xl font-bold text-white">$29</span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>✓ 5 instances</li>
                    <li>✓ All models</li>
                    <li>✓ Unlimited messages</li>
                    <li>✓ Priority support</li>
                    <li>✓ Custom domains</li>
                  </ul>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                  <div className="flex items-baseline gap-3 mb-3">
                    <h4 className="text-lg font-semibold text-white">Business</h4>
                    <span className="text-2xl font-bold text-white">$99</span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>✓ Unlimited instances</li>
                    <li>✓ All models</li>
                    <li>✓ Unlimited messages</li>
                    <li>✓ Dedicated support</li>
                    <li>✓ SLA guarantee</li>
                    <li>✓ Team collaboration</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Upgrading and Downgrading</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Change your plan at any time from the Billing page:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
                <li><strong className="text-white">Upgrade:</strong> Takes effect immediately. You'll be charged prorated amount.</li>
                <li><strong className="text-white">Downgrade:</strong> Takes effect at the end of current billing cycle.</li>
                <li>No long-term contracts or commitments required.</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Payment Methods</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We accept the following payment methods:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
                <li>Credit cards (Visa, Mastercard, American Express)</li>
                <li>Debit cards</li>
                <li>PayPal</li>
                <li>Wire transfer (Business plan only, annual billing)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Cancellation Policy</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                You can cancel your subscription at any time:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
                <li>No cancellation fees</li>
                <li>Access continues until the end of your billing period</li>
                <li>All data is retained for 30 days after cancellation</li>
                <li>You can export your data before cancellation</li>
              </ul>
            </section>

            {/* Channels */}
            <section id="channels" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl font-bold text-white mb-6">Channels</h2>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Telegram Setup Guide</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-6">
                <li>
                  <strong className="text-white">Create a bot:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                    <li>Open Telegram and search for <code className="bg-gray-900 px-2 py-0.5 rounded font-mono text-xs">@BotFather</code></li>
                    <li>Send <code className="bg-gray-900 px-2 py-0.5 rounded font-mono text-xs">/newbot</code></li>
                    <li>Follow the prompts to name your bot</li>
                    <li>Copy the API token provided</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-white">Connect to OpenClaw:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                    <li>Go to your instance settings</li>
                    <li>Click the <strong>Channels</strong> tab</li>
                    <li>Paste your bot token</li>
                    <li>Click <strong>Connect</strong></li>
                  </ul>
                </li>
                <li>
                  <strong className="text-white">Test your bot:</strong> Send a message to your bot on Telegram
                </li>
              </ol>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Discord Setup Guide</h3>
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-6">
                <p className="text-yellow-200 text-sm">
                  🚧 <strong>Coming Soon</strong> — Discord integration is currently in development
                </p>
              </div>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">WhatsApp</h3>
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-6">
                <p className="text-yellow-200 text-sm">
                  🚧 <strong>Coming Soon</strong> — WhatsApp integration is currently in development
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl font-bold text-white mb-6">FAQ</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">How to create a Telegram bot?</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Use <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">@BotFather</a> on Telegram. 
                    Send <code className="bg-gray-900 px-2 py-0.5 rounded font-mono text-xs">/newbot</code> and follow the instructions. 
                    You'll receive an API token that you can use to connect to OpenClaw.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Can I use my own API keys?</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Currently, OpenClaw uses shared API keys for all models. 
                    Support for custom API keys (bring your own key) is planned for the Business plan in a future update.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What happens when my instance is down?</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Your bot will be temporarily unavailable and won't respond to messages. 
                    Messages sent during downtime are queued by the platform (Telegram, Discord, etc.) and will be processed once your instance restarts. 
                    Free plan instances need manual restart; Pro and Business instances auto-restart.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">How do I contact support?</h3>
                  <p className="text-gray-300 leading-relaxed">
                    You can reach us at:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 mt-2 ml-4">
                    <li>Email: <a href="mailto:support@openclaw.io" className="text-blue-400 hover:text-blue-300 underline">support@openclaw.io</a></li>
                    <li>Discord: Join our <a href="#" className="text-blue-400 hover:text-blue-300 underline">community server</a></li>
                    <li>Twitter: <a href="https://twitter.com/openclaw" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">@openclaw</a></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="mb-16 scroll-mt-8">
              <h2 className="text-3xl font-bold text-white mb-6">Troubleshooting</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Bot not responding</h3>
                  <p className="text-gray-300 mb-3">If your bot isn't replying to messages:</p>
                  <ol className="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                    <li>Check if your instance is running (Dashboard → Instance status)</li>
                    <li>Verify the bot token is correct in Channel settings</li>
                    <li>Check the logs for error messages</li>
                    <li>Try restarting the instance</li>
                    <li>Ensure your plan hasn't exceeded message limits</li>
                  </ol>
                  <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 mt-4">
                    <p className="text-blue-200 text-sm">
                      💡 <strong>Tip:</strong> Enable debug logging in Settings to see detailed message processing information
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Instance stuck in "starting"</h3>
                  <p className="text-gray-300 mb-3">If your instance won't finish starting:</p>
                  <ol className="list-decimal list-inside text-gray-300 space-y-2 ml-4">
                    <li>Wait 30 seconds – some models take longer to initialize</li>
                    <li>Check system status at <a href="#" className="text-blue-400 hover:text-blue-300 underline">status.openclaw.io</a></li>
                    <li>Try stopping and starting again</li>
                    <li>If issue persists, contact support with your instance ID</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Payment issues</h3>
                  <p className="text-gray-300 mb-3">If you're having trouble with billing:</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li><strong className="text-white">Card declined:</strong> Verify your card details and ensure sufficient funds</li>
                    <li><strong className="text-white">Invoice not received:</strong> Check your spam folder or contact billing@openclaw.io</li>
                    <li><strong className="text-white">Unexpected charges:</strong> Review your usage in the Billing → Usage tab</li>
                    <li><strong className="text-white">Refund request:</strong> Email billing@openclaw.io within 7 days of charge</li>
                  </ul>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-4">
                    <p className="text-gray-300 text-sm">
                      For billing disputes or questions, please email <a href="mailto:billing@openclaw.io" className="text-blue-400 hover:text-blue-300 underline">billing@openclaw.io</a> with:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 text-xs mt-2 ml-4 space-y-1">
                      <li>Your account email</li>
                      <li>Invoice number or transaction ID</li>
                      <li>Detailed description of the issue</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-gray-800 pt-8 mt-16">
              <p className="text-gray-500 text-sm text-center">
                Last updated: February 19, 2026 • 
                <a href="#" className="text-blue-400 hover:text-blue-300 ml-2">Edit this page on GitHub</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
