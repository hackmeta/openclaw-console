'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';

type VerificationState = 'verifying' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<VerificationState>('verifying');
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setState('error');
      setError('Invalid verification link: missing token');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      await api.verifyEmail(token);
      setState('success');
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Verification failed');
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.resendVerification();
      setError('');
      alert('Verification email sent! Please check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">OpenClaw</h1>
          <p className="text-gray-400">Email Verification</p>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
          {state === 'verifying' && (
            <div className="text-center">
              <div className="inline-flex h-16 w-16 animate-spin rounded-full border-4 border-gray-700 border-t-purple-600 mb-4"></div>
              <p className="text-lg text-white">Verifying your email...</p>
              <p className="text-sm text-gray-400 mt-2">Please wait a moment</p>
            </div>
          )}

          {state === 'success' && (
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-4">
                <svg
                  className="h-8 w-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-white mb-2">Email verified!</p>
              <p className="text-sm text-gray-400 mb-6">
                Your email has been successfully verified. You can now access all features.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex w-full justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {state === 'error' && (
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-4">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-white mb-2">Verification failed</p>
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 mb-6">
                {error}
              </div>
              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {resending ? 'Sending...' : 'Resend verification email'}
              </button>
              <div className="mt-4 text-center text-sm text-gray-400">
                <Link
                  href="/login"
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">OpenClaw</h1>
              <p className="text-gray-400">Email Verification</p>
            </div>
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 animate-spin rounded-full border-4 border-gray-700 border-t-purple-600 mb-4"></div>
                <p className="text-lg text-white">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
