import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="kicker">404</p>
      <h1 className="mt-3 font-display text-5xl text-white">Page not found</h1>
      <p className="text-mbm-muted mt-3">The page you requested could not be found.</p>
      <Link href="/" className="btn-theme mt-6">
        Return Home
      </Link>
    </div>
  );
}
