import Link from "next/link";

/*
 * LogoBadge — white-backed logo mark for use over busy backgrounds.
 *
 * Why this improves visibility:
 * A solid white pill guarantees contrast against any backdrop (video,
 * gradient, image). Unlike drop-shadows or blurred glows — which shift
 * in effectiveness frame-to-frame — a physical backing is unconditionally
 * legible regardless of what the video is showing.
 *
 * Why it fits a premium, outcome-driven brand:
 * Luxury and enterprise brands present their mark on clean, uncluttered
 * fields. It signals confidence — the logo doesn't need visual tricks
 * to be seen. The pill form, hairline border, and minimal shadow keep
 * it architectural and integrated, not decorative or "sticker-like."
 */
const LogoBadge = ({ className = "" }: { className?: string }) => (
  <Link
    href="/"
    className={`inline-flex items-center justify-center ${className}`}
    aria-label="Triovate Labs — Home"
  >
    <div
      className="
        bg-white
        rounded-full
        px-5 py-2.5
        sm:px-7 sm:py-3
      "
      style={{
        /* Hairline border: just enough structure to define the edge
           without creating a heavy outline */
        border: '1px solid rgba(0, 0, 0, 0.06)',
        /* Two-layer shadow: soft ambient lift + tight contact shadow.
           Reads as "this element is on top" without drawing attention. */
        boxShadow:
          '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
      }}
    >
      <img
        src="/triovate.png"
        alt="Triovate Labs"
        className="h-8 sm:h-10 md:h-12 w-auto object-contain"
      />
    </div>
  </Link>
);

export default LogoBadge;
