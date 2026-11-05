import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-5xl font-extrabold text-ink">404</h1>
      <p className="mt-3 text-ink-muted">We couldn&apos;t find the page you were looking for.</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-dark"
      >
        Back to homepage
      </Link>
    </div>
  );
}
