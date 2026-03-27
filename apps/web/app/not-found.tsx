import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-signal">404</p>
      <h1 className="mt-3 font-display text-5xl text-white">Page not found</h1>
      <p className="mt-3 text-mist">The page you requested could not be found.</p>
      <Link href="/" className="mt-6 rounded-full bg-electric px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500">
        Return Home
      </Link>
    </div>
  );
}
