/* Shared decorative bits used across the site for a consistent premium feel. */

/** Concentric "arcs of protection" — the signature background motif. */
export function Arcs({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={
        className ??
        "pointer-events-none absolute right-[-12rem] top-[-14rem] h-[40rem] w-[40rem] opacity-70 md:right-[-8rem] md:opacity-100"
      }
    >
      <svg viewBox="0 0 600 600" className="h-full w-full">
        {[140, 230, 320, 410, 500].map((r, i) => (
          <circle
            key={r}
            cx="600"
            cy="0"
            r={r}
            fill="none"
            stroke={i === 2 ? "rgba(189,138,61,0.55)" : "rgba(10,79,160,0.12)"}
            strokeWidth={i === 2 ? 2 : 1.25}
          />
        ))}
      </svg>
    </div>
  );
}

/** Five gold stars. */
export function Stars({ size = 15 }: { size?: number }) {
  return (
    <div className="flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.95 6.18 6.8.78-5.04 4.6 1.36 6.72L12 17.77 5.93 20.5l1.36-6.72L2.25 8.96l6.8-.78L12 2z" />
        </svg>
      ))}
    </div>
  );
}
