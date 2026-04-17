import { Link } from "react-router-dom";
import Reveal from "@/components/ui/reveal";

interface CanonicalHeroProps {
  eyebrow?: string;
  headline: string;
  description: string;
  accentColor: string;
  logoSrc?: string;
  /** true = white text on dark panel (blue/red), false = dark text on light panel (gold) */
  lightText?: boolean;
}

export default function CanonicalHero({
  eyebrow,
  headline,
  description,
  accentColor,
  logoSrc = "/triovate1.png",
  lightText = true,
}: CanonicalHeroProps) {
  const textColor = lightText ? "text-white" : "text-[#0A1628]";
  const descColor = lightText ? "text-white/70" : "text-[#0A1628]/70";
  const eyebrowColor = lightText ? "text-white/60" : "text-[#0A1628]/50";

  return (
    <section
      className="relative overflow-hidden scroll-mt-[88px] pt-16 pb-10 sm:pt-20 sm:pb-12 lg:pt-0 lg:pb-0"
      style={{ backgroundColor: accentColor }}
    >
      <div className="flex flex-col lg:grid lg:grid-cols-[42%_58%] lg:min-h-[280px]">

        {/* Left panel — off-white logo panel (desktop only) */}
        <div
          className="canonical-hero-white relative z-10 hidden lg:flex items-center px-6 sm:px-10 lg:px-14 py-5 lg:py-0"
          style={{ backgroundColor: "var(--hero-logo-bg)" }}
        >
          <Link to="/" aria-label="Triovate Labs — Home">
            <img
              src={logoSrc}
              alt="Triovate Labs"
              className="h-40 xl:h-44 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right panel — accent color, headline + subtext */}
        <div className="flex items-center px-4 sm:px-10 lg:pl-16 lg:pr-14 py-8 lg:py-0">
          <div className="space-y-3 max-w-xl">

            {eyebrow && (
              <Reveal>
                <p className={`text-sm sm:text-base font-medium tracking-[0.2em] uppercase ${eyebrowColor}`}>
                  {eyebrow}
                </p>
              </Reveal>
            )}

            <Reveal
              delayMs={eyebrow ? 40 : 0}
              as="h1"
              className={`text-3xl sm:text-4xl md:text-5xl font-bold leading-tight ${textColor}`}
            >
              {headline}
            </Reveal>

            <Reveal delayMs={eyebrow ? 70 : 60}>
              <p
                className={`text-base sm:text-lg md:text-xl leading-relaxed max-w-lg ${descColor}`}
              >
                {description}
              </p>
            </Reveal>

          </div>
        </div>

      </div>

      {/* Diagonal cut — desktop only */}
      <style>{`
        @media (min-width: 1024px) {
          .canonical-hero-white {
            clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
            padding-right: 4rem;
            filter: drop-shadow(3px 0 6px rgba(0,0,0,0.06));
          }
        }
      `}</style>
    </section>
  );
}
