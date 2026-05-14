import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0f1a] px-6 text-white">
      <div className="max-w-xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
          404 Error
        </p>

        <h1 className="mb-6 text-5xl font-black md:text-7xl">
          Page not found.
        </h1>

        <p className="mb-8 leading-7 text-gray-300">
          The page you are trying to open does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block rounded-xl bg-indigo-500 px-7 py-4 font-bold transition hover:bg-indigo-400"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}