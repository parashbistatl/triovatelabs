// HERO DESIGN CONTRACT (do not violate)
//
// - One hero layout across the site
// - Max readable width: 720px
// - Strict vertical rhythm (8px base)
// - Headline always 2 lines max
// - Supporting copy ≤ 3 lines
// - CTA always separated by visual pause
//
// If content exceeds limits → rewrite, not resize

type HeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  variant?: "light" | "dark";
};

export default function Hero({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  variant = "light",
}: HeroProps) {
  return (
    <section
      className={[
        "relative flex items-center justify-center min-h-[calc(100vh-88px)]",
        "px-6 sm:px-8 py-20",
        variant === "dark"
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white"
          : "bg-white text-slate-900",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-[720px] text-center">
        {eyebrow && (
          <p className="mb-4 text-sm font-medium tracking-wide uppercase text-amber-500">
            {eyebrow}
          </p>
        )}

        <h1 className="mb-6 text-balance text-4xl font-semibold leading-tight sm:text-5xl">
          {title}
        </h1>

        <p className="mx-auto mb-10 max-w-[640px] text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
          {description}
        </p>

        <a
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-amber-400"
        >
          {ctaLabel}
          <span className="ml-2">→</span>
        </a>
      </div>
    </section>
  );
}
