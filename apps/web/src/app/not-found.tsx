import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 font-display text-6xl sm:text-8xl">This table doesn't exist.</h1>
      <Link href="/" className="btn-primary mt-10">
        Back to The Diner
      </Link>
    </main>
  );
}
