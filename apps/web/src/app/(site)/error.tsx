"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-32">
      <p className="eyebrow">Something spilled</p>
      <h1 className="mt-5 font-display text-5xl sm:text-7xl">We dropped a plate.</h1>
      <p className="mt-6 max-w-md text-sand">Something went wrong loading this page. Give it another go.</p>
      <button type="button" onClick={reset} className="btn-primary mt-8">
        Try again
      </button>
    </section>
  );
}
