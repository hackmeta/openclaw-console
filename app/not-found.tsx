import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-purple-500 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-2">Page not found</h2>
          <p className="text-gray-400">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-950 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-gray-800 border border-gray-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-950 transition-colors"
          >
            Go to Console
          </Link>
        </div>
      </div>
    </div>
  );
}
