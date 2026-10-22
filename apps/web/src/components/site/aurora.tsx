/**
 * The glowing backdrop behind every page: three blurred colour blobs that drift slowly.
 * Fixed and GPU-composited (transform only), so it costs nothing while scrolling.
 */
export function Aurora() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden>
      <div className="absolute -left-[15vw] -top-[20vh] size-[60vw] max-h-[720px] max-w-[720px] rounded-full bg-brass opacity-[0.55] blur-[120px] [animation:drift-a_26s_ease-in-out_infinite]" />
      <div className="absolute -right-[10vw] top-[10vh] size-[50vw] max-h-[640px] max-w-[640px] rounded-full bg-violet opacity-[0.6] blur-[120px] [animation:drift-b_32s_ease-in-out_infinite]" />
      <div className="absolute -bottom-[25vh] left-[25vw] size-[55vw] max-h-[680px] max-w-[680px] rounded-full bg-flame opacity-[0.4] blur-[130px] [animation:drift-c_38s_ease-in-out_infinite]" />
      {/* soft vignette keeps text contrast high at the edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(12_10_20/0.55)_100%)]" />
    </div>
  );
}
