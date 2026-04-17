import { useState, useEffect, useRef, RefObject } from "react";

/**
 * Reusable scroll-based tilt effect hook
 * Extracted from Services page for consistency across Home & About
 *
 * Creates subtle parallax/3D rotation based on scroll position
 * @param sectionRefs - Array of section references to track
 * @returns Array of tilt values (-35 to 35 degrees) for each section
 */
export function useScrollTilt(sectionRefs: RefObject<HTMLElement[]>): number[] {
  const [imageTilts, setImageTilts] = useState<number[]>([]);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(() => {
          const newTilts: number[] = [];

          if (sectionRefs.current) {
            sectionRefs.current.forEach((section) => {
              if (!section) return;

              const rect = section.getBoundingClientRect();
              const sectionTop = rect.top + window.scrollY;
              const sectionMiddle = sectionTop + rect.height / 2;
              const viewportMiddle = window.scrollY + window.innerHeight / 2;
              const distanceFromMiddle =
                (viewportMiddle - sectionMiddle) / (window.innerHeight / 2);

              // Clamp tilt between -35 and 35 degrees for subtle effect
              const tilt = Math.max(-35, Math.min(35, distanceFromMiddle * 35));
              newTilts.push(tilt);
            });
          }

          setImageTilts(newTilts);
          ticking = false;
        });
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [sectionRefs]);

  return imageTilts;
}

/**
 * Single section scroll tilt hook
 * Simplified version for pages with one animated image
 * @param sectionRef - Single section reference
 * @returns Tilt value (-35 to 35 degrees)
 */
export function useScrollTiltSingle(sectionRef: RefObject<HTMLElement>): number {
  const [imageTilt, setImageTilt] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false;
            return;
          }

          const section = sectionRef.current;
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          const sectionMiddle = sectionTop + rect.height / 2;
          const viewportMiddle = window.scrollY + window.innerHeight / 2;
          const distanceFromMiddle =
            (viewportMiddle - sectionMiddle) / (window.innerHeight / 2);

          // Clamp tilt between -35 and 35 degrees
          const tilt = Math.max(-35, Math.min(35, distanceFromMiddle * 35));
          setImageTilt(tilt);
          ticking = false;
        });
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [sectionRef]);

  return imageTilt;
}
