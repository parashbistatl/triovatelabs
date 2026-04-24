import Link from "next/link";

/*
 * HeroTopCap — site-wide structural header: white strip + medallion.
 *
 * ┌──────────────────────────────────────────────┐
 * │           THIN WHITE STRIP (~68–100px)       │
 * │                 ┌─────────┐                  │
 * └─────────────────┤         ├──────────────────┘
 *                   │  LOGO   │  ← medallion protrudes below
 *                   │         │
 *                   └─────────┘
 *
 * Strip and medallion share the same #fff fill.
 * The medallion's center is anchored at the strip's bottom edge
 * via translate(-50%, -50%), so the top half merges with the strip
 * (white-on-white = no seam) and the bottom half protrudes.
 *
 * On light pages the cap blends into the background; on dark pages
 * and video backgrounds it provides clear contrast.
 *
 * Hidden on mobile — the fixed nav bar owns the logo there.
 */

const HeroTopCap = () => (
  <>
    {/* Strip — shallow off-white band across full width */}
    <div
      className="absolute top-0 left-0 right-0 z-[16] hidden sm:block"
      style={{
        height: 'clamp(68px, 8vh, 100px)',
        background: 'var(--hero-logo-bg)',
      }}
    />

    {/* Medallion — circle straddling the strip's bottom edge.
        Sized so the logo reads clearly, not tiny. */}
      <div
      className="absolute z-[17] hidden sm:flex items-center justify-center"
      style={{
        top: 'clamp(68px, 8vh, 100px)',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'clamp(130px, 15vh, 190px)',
        height: 'clamp(130px, 15vh, 190px)',
        borderRadius: '50%',
          background: 'var(--hero-logo-bg)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.07)',
      }}
    >
      {/* Logo — fills 80% of the medallion for clear readability */}
      <Link
        href="/"
        className="flex items-center justify-center w-4/5 h-4/5"
        aria-label="Triovate Labs — Home"
      >
        <img
          src="/triovate.png"
          alt="Triovate Labs"
          className="max-h-full max-w-full w-auto h-auto object-contain"
        />
      </Link>
    </div>
  </>
);

export default HeroTopCap;
