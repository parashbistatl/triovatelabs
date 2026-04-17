import Reveal from "@/components/ui/reveal";
import BrandMark from "@/components/ui/brand-mark";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useCallback, useState, useEffect } from "react";

const FLASH_IN_MS = 100;
const FLASH_OUT_MS = 180;
const FLASH_PEAK_OPACITY = 0.38;
const CUE_BEFORE_END_S = 0.45;

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    if (mobile) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const conn = (navigator as any).connection;
    if (conn?.saveData) return;
    if (['slow-2g', '2g'].includes(conn?.effectiveType ?? '')) return;

    const startVideo = () => {
      setVideoSrc('/videos/hero-desktop.mp4');
      setShowVideo(true);
    };
    if (document.readyState === 'complete') {
      startVideo();
    } else {
      window.addEventListener('load', startVideo, { once: true });
    }
  }, []);

  const vid1Ref = useRef<HTMLVideoElement>(null);
  const vid2Ref = useRef<HTMLVideoElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<1 | 2>(1);
  const crossfadingRef = useRef(false);

  const crossfade = useCallback(() => {
    if (crossfadingRef.current) return;
    crossfadingRef.current = true;
    const isAActive = activeRef.current === 1;
    const outgoing = isAActive ? vid1Ref.current : vid2Ref.current;
    const incoming = isAActive ? vid2Ref.current : vid1Ref.current;
    const flash = flashRef.current;
    if (!outgoing || !incoming) return;
    incoming.currentTime = 0;
    incoming.play().catch(() => {});
    if (flash) {
      flash.style.transition = `opacity ${FLASH_IN_MS}ms ease-in`;
      flash.style.opacity = String(FLASH_PEAK_OPACITY);
    }
    setTimeout(() => {
      outgoing.style.opacity = "0";
      incoming.style.opacity = "1";
      if (flash) {
        flash.style.transition = `opacity ${FLASH_OUT_MS}ms ease-out`;
        flash.style.opacity = "0";
      }
      setTimeout(() => {
        activeRef.current = isAActive ? 2 : 1;
        crossfadingRef.current = false;
      }, FLASH_OUT_MS);
    }, FLASH_IN_MS);
  }, []);

  const handleTimeUpdate = useCallback((which: 1 | 2) => {
    if (activeRef.current !== which || crossfadingRef.current) return;
    const video = (which === 1 ? vid1Ref : vid2Ref).current;
    if (!video || !video.duration) return;
    if (video.currentTime >= video.duration - CUE_BEFORE_END_S) crossfade();
  }, [crossfade]);

  const videoStyle: React.CSSProperties = {
    position: "absolute", inset: 0, width: "100%", height: "100%",
    objectFit: "cover", pointerEvents: "none",
  };

  return (
    <section
      className="relative h-[100svh] overflow-hidden w-full bg-white md:bg-black"
      style={{ contain: 'strict' }}
    >

      {/* ── DESKTOP BACKGROUND ── */}
      <div className="hidden md:block absolute inset-0 z-0">
        <img
          src="/triovate1.png" alt="" aria-hidden="true"
          fetchPriority="high" loading="eager" decoding="sync"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" }}
        />
        {showVideo && (
          <>
            <video ref={vid1Ref} src={videoSrc} autoPlay muted playsInline preload="auto"
              poster="/videos/hero-poster.webp" width={1920} height={1080} aria-hidden="true"
              style={{ ...videoStyle, opacity: 1 }} onTimeUpdate={() => handleTimeUpdate(1)} />
            <video ref={vid2Ref} src={videoSrc} muted playsInline preload="none"
              poster="/videos/hero-poster.webp" width={1920} height={1080} aria-hidden="true"
              style={{ ...videoStyle, opacity: 0 }} onTimeUpdate={() => handleTimeUpdate(2)} />
          </>
        )}
        <div ref={flashRef} aria-hidden="true" style={{ position:"absolute", inset:0, backgroundColor:"black", opacity:0, zIndex:1, pointerEvents:"none" }} />
        <div className="absolute inset-0 bg-black/[0.48]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      </div>

      {/* ── MOBILE BACKGROUND — plain white with subtle gold glow ── */}
      <div className="md:hidden absolute inset-0 z-0" aria-hidden="true">
        <div style={{
          position: "absolute", top: "22%", left: "50%", transform: "translateX(-50%)",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(226,185,59,0.12) 0%, transparent 70%)",
          filter: "blur(24px)",
        }} />
      </div>

      {/* Desktop top gradient */}
      <div className="hidden md:block absolute top-0 left-0 right-0 z-40 pointer-events-none"
        style={{ height:"160px", background:"linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)" }} />

      {/* ── MAIN LAYOUT ── */}
      <div className="relative z-10 flex flex-col h-full pt-16 pb-10 sm:pt-20 sm:pb-14 lg:pt-0 lg:pb-0">

        {/* Logo */}
        <div className="flex justify-center">
          <div className="md:hidden">
            <Link to="/" aria-label="Triovate Labs — Home" className="inline-flex items-center">
              <img src="/triovate1.png" alt="Triovate Labs" width={160} height={160}
                fetchPriority="high" className="h-24 w-auto object-contain" />
            </Link>
          </div>
          <div className="hidden md:block">
            <BrandMark mode="onMedia" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8">
          <div className="max-w-4xl w-full flex flex-col items-center text-center gap-0">

            {/* Eyebrow — same on both */}
            <Reveal>
              <p className="text-sm sm:text-base text-gray-500 md:text-white/60 font-medium tracking-[0.2em] uppercase animate-popup">
                Web Development &middot; Digital Marketing &middot; Custom Software
              </p>
            </Reveal>

            {/* Headline
                Mobile: 7.5vw viewport-scaled so both lines fit on one line at every phone width.
                Desktop: fixed rem steps. */}
            <Reveal
              delayMs={40}
              as="h1"
              className="mt-2 md:mt-4 text-[7.5vw] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.06] tracking-[-0.03em] text-gray-950 md:text-white animate-popup"
              data-animation-delay="0.1s"
            >
              <span className="block whitespace-nowrap">Build Better Systems.</span>
              <span className="block whitespace-nowrap">Grow Faster Online.</span>
            </Reveal>

            {/* Description */}
            <Reveal delayMs={70}>
              <p className="mt-4 md:mt-3 text-base sm:text-lg md:text-xl leading-relaxed max-w-sm md:max-w-xl mx-auto animate-popup text-gray-600 md:text-white/50"
                style={{ animationDelay:"0.18s" }}>
                Websites, marketing systems and custom software engineered for performance and scale.
              </p>
            </Reveal>

            {/* CTA */}
            <Reveal delayMs={100}>
              <div className="mt-7 md:mt-6 sm:mt-8 animate-popup" style={{ animationDelay:"0.28s" }}>
                <Link to="/contact#start">
                  <button
                    className="group relative px-10 py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 flex items-center gap-3 overflow-hidden"
                    style={{ background:"linear-gradient(135deg, #E2B93B 0%, #CCA430 100%)", color:"#0A1628", boxShadow:"0 4px 24px rgba(226,185,59,0.35), 0 1px 4px rgba(0,0,0,0.10)" }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(226,185,59,0.45), 0 2px 8px rgba(0,0,0,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="translateY(0) scale(1)"; e.currentTarget.style.boxShadow="0 4px 24px rgba(226,185,59,0.35), 0 1px 4px rgba(0,0,0,0.10)"; }}
                  >
                    <span className="relative z-10 font-bold">Talk to an expert</span>
                    <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </Reveal>

            {/* Micro-trust */}
            <Reveal delayMs={130}>
              <p className="mt-3 text-sm font-medium animate-popup text-gray-400 md:text-white/30" style={{ animationDelay:"0.35s" }}>
                Trusted by teams building scalable solutions
              </p>
            </Reveal>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-16 sm:pb-20">
          <button
            className="animate-scroll-hint cursor-pointer transition-colors duration-200 text-gray-300 md:text-white/40 hover:text-gray-500 md:hover:text-white/70"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior:"smooth" })}
            aria-label="Scroll down"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

      </div>

      {/* Bottom gold gradient — shared desktop + mobile, blends into services section */}
      <div className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none" aria-hidden="true"
        style={{ height:"clamp(150px, 25vh, 300px)", background:`linear-gradient(to bottom, transparent 0%, rgba(226,185,59,0.03) 15%, rgba(226,185,59,0.10) 35%, rgba(226,185,59,0.25) 55%, rgba(226,185,59,0.45) 75%, rgba(226,185,59,0.65) 90%, rgba(226,185,59,0.80) 100%)` }} />

      <style>{`
        @keyframes popup {
          0% { opacity: 0; transform: scale(0.96) translateY(14px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-popup { opacity: 0; animation: popup 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes scrollHint {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 0.85; transform: translateY(5px); }
        }
        .animate-scroll-hint { animation: scrollHint 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          video { display: none; }
          .animate-popup { animation: none; opacity: 1; }
          .animate-scroll-hint { animation: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
