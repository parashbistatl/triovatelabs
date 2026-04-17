import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "@/components/sections/Hero";
import SiteFooter from "@/components/ui/site-footer";
import { usePageSeo } from "@/hooks/usePageSeo";

const Index = () => {
  const [bgColors, setBgColors] = useState({ bg1: "#FFF9E6", bg2: "#FFFBF0" });
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [imageTilts, setImageTilts] = useState<number[]>([0, 0, 0]);

  usePageSeo({
    title: "Triovate Labs | Web Development, Digital Marketing & Custom Software",
    description:
      "Triovate Labs builds high-converting websites, performance marketing systems and custom software for growing businesses. Clear scope, fast delivery, measurable results.",
    path: "/",
    ogImagePath: "/triovate1.png",
  });

  // Section configurations - ordered: Website Development, Digital Marketing, Custom Software
  const sections = [
    {
      id: "website",
      headline: "WEBSITE",
      accent: "Development",
      description: "Fast, modern websites and web applications that look great, load instantly and turn visitors into customers.",
      learnMoreLink: "/services#website-development",
      bgStart: "#E2B93B",
      bgEnd: "#E2B93B"
    },
    {
      id: "marketing",
      headline: "DIGITAL",
      accent: "Marketing",
      description: "Performance marketing built to generate qualified leads and sales across ads, SEO and conversion-focused landing pages.",
      learnMoreLink: "/services#digital-marketing",
      bgStart: "#1E3A8A",
      bgEnd: "#3B82F6"
    },
    {
      id: "software",
      headline: "CUSTOM",
      accent: "Software",
      description: "Custom apps and integrations that remove bottlenecks and help your business run more efficiently.",
      learnMoreLink: "/services#custom-software",
      bgStart: "#E63946",
      bgEnd: "#F72C3F"
    }
  ];

  // Performance: Guard expensive scroll handler - load after first paint using requestIdleCallback
  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;
    let idleCallbackId: number | null = null;

    const setupScrollHandler = () => {
      const handleScroll = () => {
        if (!ticking) {
          ticking = true;
          rafId = requestAnimationFrame(() => {
            let currentSection = sections[0];
            let currentSectionIndex = 0;
            const newTilts: number[] = [];
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            sectionsRef.current.forEach((section, index) => {
              if (!section) return;

              const rect = section.getBoundingClientRect();
              const sectionTop = rect.top + window.scrollY;
              const sectionBottom = sectionTop + rect.height;

              // Only change color if we've scrolled past the top of the section
              // (i.e., section top is above the viewport top)
              if (sectionTop <= scrollY) {
                // Check if this section is the most recently scrolled past section
                if (index >= currentSectionIndex) {
                  currentSectionIndex = index;
                  currentSection = sections[index];
                }
              }

              // Calculate tilt based on scroll position within the section
              const sectionMiddle = sectionTop + rect.height / 2;
              const viewportMiddle = scrollY + viewportHeight / 2;
              const distanceFromMiddle = (viewportMiddle - sectionMiddle) / (viewportHeight / 2);
              // Clamp the tilt between -35 and 35 degrees for circular rotation effect
              const tilt = Math.max(-35, Math.min(35, distanceFromMiddle * 35));
              newTilts[index] = tilt;
            });

            setBgColors({
              bg1: currentSection.bgStart,
              bg2: currentSection.bgEnd
            });
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
    };

    // Load scroll handler after first paint to avoid blocking initial render
    if ('requestIdleCallback' in window) {
      idleCallbackId = requestIdleCallback(setupScrollHandler, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(setupScrollHandler, 100);
    }

    return () => {
      if (idleCallbackId && 'cancelIdleCallback' in window) {
        cancelIdleCallback(idleCallbackId);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Logo and Hero fit exactly to viewport - wrapper ensures full width background, inner content is centered */}
      <section className="relative flex flex-col min-h-[calc(100vh-88px)] overflow-hidden">
        <div className="flex-1 w-full flex items-center justify-center">
          <Hero />
        </div>
      </section>

      {/* Services Sections */}
      <div
        className="relative"
        style={{
          background: `linear-gradient(135deg, ${bgColors.bg1} 0%, ${bgColors.bg2} 100%)`,
          transition: 'background 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
          contentVisibility: 'auto',
        }}
      >
        {/* Top transition overlay — gentle blend from hero gold into section */}
        <div
          className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
          style={{
            height: 'clamp(60px, 10vh, 120px)',
            background: `linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.06) 0%,
              rgba(0, 0, 0, 0.03) 40%,
              transparent 100%
            )`,
          }}
          aria-hidden="true"
        />

        {sections.map((section, index) => (
          <section
            key={section.id}
            ref={(el) => {
              if (el) sectionsRef.current[index] = el;
            }}
            className="min-h-screen flex items-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
          >
            <div className="container mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

                <div className={`order-1 ${index === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div
                    className="relative w-full group"
                    style={{
                      filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15)) drop-shadow(0 10px 25px rgba(0,0,0,0.1))',
                      transform: `perspective(1800px) rotateY(${(imageTilts[index] || 0) * 0.7}deg) rotateX(${(imageTilts[index] || 0) * 0.5}deg) translateZ(${Math.abs(imageTilts[index] || 0) * 3}px)`,
                      transition: 'transform 0.7s cubic-bezier(0.22,0.61,0.36,1)',
                      willChange: 'transform',
                      transformStyle: 'preserve-3d' as const
                    }}
                  >
                    {/* Soft glow underneath */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-white/20 to-transparent blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Performance: Lazy load below-fold images with async decoding */}
                    <img
                      src={`/${index === 0 ? '1' : index === 1 ? '3' : '2'}.png`}
                      alt={section.accent}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>

                <div className={`order-2 ${index === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative mb-12">
                    {/* Background oversized word - bold white */}
                    <div
                      className="pointer-events-none select-none"
                      style={{
                        fontSize: 'clamp(4rem, 12vw, 9rem)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        marginBottom: '0.15em'
                      }}
                    >
                      {section.headline}
                    </div>

                    {/* Foreground cursive title - black, center aligned to lower half */}
                    <h2
                      className="relative"
                      style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        color: '#000000',
                        letterSpacing: '0.02em',
                        lineHeight: 1,
                        textAlign: 'center',
                        marginTop: '-0.4em',
                        wordBreak: 'break-word'
                      }}
                    >
                      {section.accent}
                    </h2>
                  </div>

                  <p
                    className="text-base sm:text-lg max-w-xl mx-auto mb-10"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", system-ui, sans-serif',
                      color: 'rgba(255,255,255,0.92)',
                      fontWeight: 450,
                      lineHeight: '1.75',
                      letterSpacing: '-0.01em',
                      textAlign: 'center'
                    }}
                  >
                    {section.description}
                  </p>

                  {/* Button: Learn More */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to={section.learnMoreLink}>
                      <button
                        className="px-8 sm:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base w-full sm:w-auto"
                        style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                          fontWeight: 600,
                          letterSpacing: '-0.02em',
                          background: 'rgba(255,255,255,0.98)',
                          color: 'rgba(0,0,0,0.9)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          transition: 'transform 120ms cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 120ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                        }}
                      >
                        Learn More
                      </button>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </section>
        ))}
      </div>

      {/* About Section - Unique Visual Design - Moved below Services */}
      <section id="about" className="min-h-[calc(100vh-88px)] flex items-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 sm:pt-32 md:pt-56 pb-12 sm:pb-16 md:pb-20 scroll-mt-[88px]" style={{ contentVisibility: 'auto' }}>
        {/* Simplified background - no animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/8 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-6">

            {/* Main heading with artistic layout */}
            <div className="space-y-3">
              <div className="inline-block">
                <span className="text-gold font-semibold text-sm uppercase tracking-widest mb-2 block">ABOUT US</span>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight px-2">
                We Build What Your Business Needs Next.
              </h2>
            </div>

            {/* Description with elegant spacing */}
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-light px-2">
                We design websites, software and create marketing systems that turn complexity into clear, measurable results.
              </p>

              <div className="flex items-center justify-center gap-8 py-4">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/30"></div>
                <div className="w-3 h-3 bg-gold rounded-full"></div>
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/30"></div>
              </div>

              <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Every project starts with a clear plan, ships on schedule, and is handed off with full documentation so your team stays in control.
              </p>
            </div>

            {/* Artistic feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-6 sm:pt-8 max-w-4xl mx-auto">
              <div className="group">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Rapid Delivery</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Move from plan to launch without the chaos</p>
              </div>

              <div className="group">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Creative Direction</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Design that feels premium and converts visitors into customers</p>
              </div>

              <div className="group">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Engineering Quality</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Reliable builds, performance-first, done right</p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden" style={{ contentVisibility: 'auto' }}>
        {/* Simplified gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-96 h-96 bg-gold/8 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Main card - simplified */}
            <div className="relative bg-white rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16 shadow-xl">
              {/* Top accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-yellow-400"></div>

              <div className="relative z-10 text-center space-y-8">
                {/* Heading with enhanced typography */}
                <div className="space-y-4">
                  <div className="inline-block px-6 py-2 bg-gold/10 rounded-full mb-4">
                    <span className="text-gold font-semibold text-sm uppercase tracking-widest">Let's Build Something Amazing</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight px-2">
                    Ready to Transform <br />
                    <span className="text-gold">Your Business?</span>
                  </h2>
                </div>

                {/* Enhanced description */}
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
                  Work with a team that ships fast, communicates clearly and builds digital systems that perform.
                </p>

                {/* CTA button - clean and fast */}
                <div className="pt-6">
                  <Link to="/contact">
                    <button
                      className="px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-3 mx-auto w-full sm:w-auto"
                      style={{
                        background: 'linear-gradient(135deg, #E2B93B 0%, #E2B93B 100%)',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 12px rgba(226, 185, 59, 0.3)',
                        transition: 'transform 120ms cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 120ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(226, 185, 59, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(226, 185, 59, 0.3)';
                      }}
                    >
                      <span>Start Your Project</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
};

export default Index;
