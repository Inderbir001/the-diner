import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-start justify-center pt-32">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 max-w-3xl font-display text-6xl leading-none sm:text-8xl">This table doesn't exist.</h1>
      <p className="mt-6 max-w-md text-lg text-sand">The page you're after may have moved. Here's where most people head next:</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">Home</Link>
        <Link href="/menu" className="btn-ghost">Menu</Link>
        <Link href="/reserve" className="btn-ghost">Book a table</Link>
      </div>
    </section>
  );
}
