import Reveal from "@/components/ui/reveal";
import SiteFooter from "@/components/ui/site-footer";
import CanonicalHero from "@/components/ui/canonical-hero";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { usePageSeo } from "@/hooks/usePageSeo";

const Services = () => {
  const location = useLocation();
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [imageTilts, setImageTilts] = useState<number[]>([0, 0, 0]);
  const [bgColors, setBgColors] = useState({
    bg1: "#E2B93B",
    bg2: "#CCA430"
  });

  // Section color configurations - standardized accent colors
  const sectionColors = [
    { bgStart: "#E2B93B", bgEnd: "#CCA430" }, // Standardized Gold - Website Development
    { bgStart: "#1E3A8A", bgEnd: "#3B82F6" }, // Blue - Digital Marketing (2nd)
    { bgStart: "#E63946", bgEnd: "#F72C3F" }  // Red - Custom Software (3rd)
  ];

  usePageSeo({
    title: "Web Development, Digital Marketing & Custom Software | Triovate Labs",
    description:
      "Web development, digital marketing and custom software development for growing businesses. Every project includes clear scope, weekly updates and full ownership of all deliverables.",
    path: "/services",
    ogImagePath: "/triovate1.png",
  });

  // Handle hash navigation - scroll to section when URL contains hash
  useEffect(() => {
    const scrollToHash = () => {
      // Get hash from location (React Router compatible)
      const hash = location.hash.replace('#', '');
      if (hash) {
        // Try multiple times with increasing delays to handle React Router navigation timing
        const attemptScroll = (attempt = 0) => {
          const element = document.getElementById(hash);
          if (element) {
            const headerOffset = 88; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            return true; // Successfully scrolled
          } else if (attempt < 10) {
            // Retry if element not found yet (React Router might still be rendering)
            // Increase retry count and delay for lazy-loaded routes
            setTimeout(() => attemptScroll(attempt + 1), 150 * (attempt + 1));
          }
          return false;
        };
        attemptScroll();
      }
    };

    // Small delay to ensure DOM is ready and ScrollToTop has finished
    const timeoutId = setTimeout(() => {
      scrollToHash();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location.hash, location.pathname]);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(() => {
          let currentSectionIndex = 0;
          let maxVisibility = 0;
          const newTilts: number[] = [];

          sectionsRef.current.forEach((section, index) => {
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionBottom = sectionTop + rect.height;

            const visibleTop = Math.max(sectionTop, window.scrollY);
            const visibleBottom = Math.min(sectionBottom, window.scrollY + window.innerHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibility = visibleHeight / window.innerHeight;

            if (visibility > maxVisibility) {
              maxVisibility = visibility;
              currentSectionIndex = index;
            }

            // Calculate tilt based on scroll position within the section
            const sectionMiddle = sectionTop + rect.height / 2;
            const viewportMiddle = window.scrollY + window.innerHeight / 2;
            const distanceFromMiddle = (viewportMiddle - sectionMiddle) / (window.innerHeight / 2);
            // Clamp the tilt between -35 and 35 degrees for circular rotation effect
            const tilt = Math.max(-35, Math.min(35, distanceFromMiddle * 35));
            newTilts[index] = tilt;
          });

          setBgColors({
            bg1: sectionColors[currentSectionIndex].bgStart,
            bg2: sectionColors[currentSectionIndex].bgEnd
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
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero - Compact two-column split */}
      <CanonicalHero
        headline="Our Services"
        description="Digital solutions that work as hard as you do."
        accentColor="#E63946"
        logoSrc="/triovate1.png"
        lightText={true}
      />

      {/* Services Overview Section */}
      <section id="services-overview" className="py-16 sm:py-20 md:py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6">

          {/* Section Header */}
          <Reveal>
            <div className="max-w-3xl mx-auto text-center mb-14">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#E63946] mb-3">What We Do</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                What We Deliver
              </h2>
              <p className="text-lg text-gray-600 mt-4 max-w-xl mx-auto">
                Pick the service that fits your growth goal.
              </p>
            </div>
          </Reveal>

          {/* Services Grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

            {/* Card 1: Website Development */}
            <Reveal delayMs={60}>
              <a href="#website-development" className="block h-full group">
                <div className="relative bg-white rounded-2xl p-6 sm:p-8 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 hover:border-[#E2B93B]/50 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E2B93B] to-[#CCA430] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <div className="w-10 h-10 rounded-lg bg-[#E2B93B]/10 flex items-center justify-center mb-5">
                    <span className="text-[#E2B93B] font-bold text-sm">01</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Website Development
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    Custom websites and web applications built for performance and scale
                  </p>
                  <div className="text-[#E2B93B] text-sm font-semibold mt-6 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            </Reveal>

            {/* Card 2: Digital Marketing */}
            <Reveal delayMs={120}>
              <a href="#digital-marketing" className="block h-full group">
                <div className="relative bg-white rounded-2xl p-6 sm:p-8 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 hover:border-[#1E3A8A]/40 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <div className="w-10 h-10 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center mb-5">
                    <span className="text-[#1E3A8A] font-bold text-sm">02</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Digital Marketing
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    Data-driven campaigns that build brands and drive growth
                  </p>
                  <div className="text-[#1E3A8A] text-sm font-semibold mt-6 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            </Reveal>

            {/* Card 3: Custom Software */}
            <Reveal delayMs={180}>
              <a href="#custom-software" className="block h-full group">
                <div className="relative bg-white rounded-2xl p-6 sm:p-8 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 hover:border-[#E63946]/40 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E63946] to-[#F72C3F] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <div className="w-10 h-10 rounded-lg bg-[#E63946]/10 flex items-center justify-center mb-5">
                    <span className="text-[#E63946] font-bold text-sm">03</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Custom Software
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    Purpose-built tools that automate and optimize operations
                  </p>
                  <div className="text-[#E63946] text-sm font-semibold mt-6 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            </Reveal>

          </div>
        </div>
      </section>

      {/* Fit Section */}
      <section id="fit" className="py-16 sm:py-20 md:py-24 bg-gray-50 scroll-mt-[88px]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#E63946] mb-3">Compatibility</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  Are We a Strong Fit?
                </h2>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <Reveal delayMs={60}>
                <div className="relative p-8 rounded-2xl bg-white border border-gray-200 hover:border-green-400/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Strong Fit</h3>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed">
                    We're a strong fit if you want clear scope, reliable delivery and systems that are easy to maintain.
                  </p>
                </div>
              </Reveal>

              <Reveal delayMs={120}>
                <div className="relative p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-400/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-400"></div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Not a Fit</h3>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed">
                    We're not a fit if you want the cheapest option or unclear scope with constant last-minute pivots.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* How Projects Run Section */}
      <section id="how-projects-run" className="py-16 sm:py-20 md:py-24 bg-white scroll-mt-[88px]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#E63946] mb-3">Our Process</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  How Projects Run
                </h2>
              </div>
            </Reveal>

            <Reveal delayMs={60}>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
                {["Alignment", "Design / Architecture", "Build / QA / Launch", "Handoff / Support"].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 w-full sm:w-auto">
                    {i > 0 && (
                      <svg className="w-5 h-5 text-[#E63946]/40 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-gray-50 border border-gray-200 w-full sm:w-auto">
                      <div className="w-7 h-7 rounded-full bg-[#E63946] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{i + 1}</div>
                      <span className="font-semibold text-gray-900 text-sm">{step}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delayMs={120}>
              <p className="text-lg text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
                Every project starts with agreed scope and milestones. You get weekly progress updates and demos. Scope changes go through a clear process. At handoff, your team receives full documentation so you stay in control.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Animated Background Wrapper for Service Sections */}
      <div
        className="transition-colors duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{
          background: `linear-gradient(135deg, ${bgColors.bg1} 0%, ${bgColors.bg2} 100%)`,
          transition: 'background 1.2s cubic-bezier(0.22,0.61,0.36,1)'
        }}
      >

        {/* Website Development - Detailed Section */}
        <section
          ref={(el) => { if (el) sectionsRef.current[0] = el; }}
          id="website-development"
          className="py-16 lg:py-20 scroll-mt-[88px]"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

              <div className="order-2 lg:order-1 space-y-6">
                <Reveal>
                  <p className="text-white/60 font-semibold text-sm tracking-[0.15em] uppercase">01 — Website Development</p>
                </Reveal>
                <Reveal delayMs={60}>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Custom Website and Web Applications Built for Performance and Scale
                  </h2>
                </Reveal>
                <Reveal delayMs={120}>
                  <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                    We build full-stack web applications and websites using modern frameworks and proven architecture patterns. Every project starts with understanding your users, your business logic and your growth trajectory. The result is a performant, maintainable platform that solves real problems and scales as you grow.
                  </p>
                </Reveal>
                <Reveal delayMs={180}>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Who This Is For</h3>
                    <p className="text-white/60 leading-relaxed">Best for teams that need trust, speed and conversions</p>
                  </div>
                </Reveal>
                <Reveal delayMs={240}>
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white">What You Get</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/70">
                      {["UX-first page structure", "Conversion-focused structure", "Responsive UI implementation", "Analytics + tracking setup", "Technical SEO foundation", "Launch checklist + QA pass"].map((item) => (
                        <div key={item} className="flex items-center gap-2"><span className="text-white font-bold">✓</span><span>{item}</span></div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>

              <Reveal className="order-1 lg:order-2">
                <div className="relative w-full aspect-square lg:aspect-auto lg:h-[500px] group"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))',
                    transform: `perspective(1800px) rotateY(${(imageTilts[0] || 0) * 0.7}deg) rotateX(${(imageTilts[0] || 0) * 0.5}deg) translateZ(${Math.abs(imageTilts[0] || 0) * 3}px)`,
                    transition: 'transform 0.7s cubic-bezier(0.22,0.61,0.36,1)',
                    willChange: 'transform', transformStyle: 'preserve-3d'
                  }}
                >
                  <img
                    src="/a.png"
                    alt="Website Development"
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* Digital Marketing - Detailed Section */}
        <section
          ref={(el) => { if (el) sectionsRef.current[1] = el; }}
          id="digital-marketing"
          className="py-16 lg:py-20 scroll-mt-[88px]"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

              <Reveal className="order-1 lg:order-1">
                <div className="relative w-full aspect-square lg:aspect-auto lg:h-[500px] group"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))',
                    transform: `perspective(1800px) rotateY(${(imageTilts[1] || 0) * 0.7}deg) rotateX(${(imageTilts[1] || 0) * 0.5}deg) translateZ(${Math.abs(imageTilts[1] || 0) * 3}px)`,
                    transition: 'transform 0.7s cubic-bezier(0.22,0.61,0.36,1)',
                    willChange: 'transform', transformStyle: 'preserve-3d'
                  }}
                >
                  <img
                    src="/c.png"
                    alt="Digital Marketing"
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Reveal>

              <div className="order-2 lg:order-2 space-y-6">
                <Reveal>
                  <p className="text-white/60 font-semibold text-sm tracking-[0.15em] uppercase">02 — Digital Marketing &amp; Growth</p>
                </Reveal>
                <Reveal delayMs={60}>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Data-Driven Campaigns That Build Brands and Drive Growth
                  </h2>
                </Reveal>
                <Reveal delayMs={120}>
                  <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                    We design marketing systems, not just campaigns. Every channel, message and touchpoint is tracked, optimized and aligned with your product roadmap. This creates a scalable acquisition engine with clear, measurable ROI from spend to revenue.
                  </p>
                </Reveal>
                <Reveal delayMs={180}>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Who This Is For</h3>
                    <p className="text-white/60 leading-relaxed">Best for businesses that want consistent inbound and measurable pipeline growth</p>
                  </div>
                </Reveal>
                <Reveal delayMs={240}>
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white">What You Get</h3>
                    <ul className="space-y-2 text-sm text-white/70">
                      {["Offer + positioning alignment", "Landing pages built for conversion", "SEO content system", "Paid ads setup & optimization", "Reporting tied to leads, pipeline and ROI"].map((item) => (
                        <li key={item} className="flex items-start gap-2"><span className="text-white font-bold mt-0.5">✓</span><span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* Custom Software - Detailed Section */}
        <section
          ref={(el) => { if (el) sectionsRef.current[2] = el; }}
          id="custom-software"
          className="py-16 lg:py-20 scroll-mt-[88px]"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

              <div className="order-2 lg:order-1 space-y-6">
                <Reveal>
                  <p className="text-white/60 font-semibold text-sm tracking-[0.15em] uppercase">03 — Custom Software</p>
                </Reveal>
                <Reveal delayMs={60}>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Purpose-Built Tools That Automate and Optimize Operations
                  </h2>
                </Reveal>
                <Reveal delayMs={120}>
                  <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                    We design and build internal systems, workflow automation platforms, and specialized tools that address your unique operational challenges. Each solution is architected around your existing processes, data structures, and team workflows eliminating manual bottlenecks and creating compound efficiency gains.
                  </p>
                </Reveal>
                <Reveal delayMs={180}>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Who This Is For</h3>
                    <p className="text-white/60 leading-relaxed">
                      Operations teams drowning in manual tasks. Companies with unique processes that off-the-shelf software can't handle. Teams where admin work competes with strategic initiatives.
                    </p>
                  </div>
                </Reveal>
                <Reveal delayMs={240}>
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white">What You Get</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/70">
                      {["Custom application or platform", "Integration connectors", "Process documentation", "User training materials", "Admin and monitoring tools", "Deployment automation", "Maintenance runbooks", "Source code + architecture docs"].map((item) => (
                        <div key={item} className="flex items-center gap-2"><span className="text-white font-bold">✓</span><span>{item}</span></div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>

              <Reveal className="order-1 lg:order-2">
                <div className="relative w-full aspect-square lg:aspect-auto lg:h-[500px] group"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))',
                    transform: `perspective(1800px) rotateY(${(imageTilts[2] || 0) * 0.7}deg) rotateX(${(imageTilts[2] || 0) * 0.5}deg) translateZ(${Math.abs(imageTilts[2] || 0) * 3}px)`,
                    transition: 'transform 0.7s cubic-bezier(0.22,0.61,0.36,1)',
                    willChange: 'transform', transformStyle: 'preserve-3d'
                  }}
                >
                  <img
                    src="/b.png"
                    alt="Custom Software"
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Reveal>

            </div>
          </div>
        </section>


      </div> {/* End of Animated Background Wrapper */}

      {/* What Clients Get Every Time Section */}
      <section id="what-clients-get" className="py-16 sm:py-20 md:py-24 bg-white scroll-mt-[88px]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#E63946] mb-3">Delivery Standards</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  What Clients Get Every Time
                </h2>
                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                  Consistent delivery standards across every engagement
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Timely Delivery", desc: "Projects delivered on schedule with clear milestones and deadlines", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                { title: "Weekly Updates + Demos", desc: "Regular progress reports and live demonstrations of completed work", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                { title: "Performance + QA Checks", desc: "Rigorous testing and optimization before launch", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                { title: "Documentation + Clean Handoff", desc: "You receive full source code, architecture docs and a recorded walkthrough so your team owns it completely.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                { title: "Full Ownership of Assets and Code", desc: "Everything built is yours — source code, design files, accounts, and credentials. Zero lock-in, zero ongoing dependency.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              ].map((item, i) => (
                <Reveal key={i} delayMs={i * 60} className="h-full">
                  <div className="group relative p-6 rounded-2xl bg-white border border-gray-200 hover:border-[#E63946]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#E63946] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="w-10 h-10 rounded-lg bg-[#E63946]/10 flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-[#E63946]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section – reuse home page final CTA */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-96 h-96 bg-gold/8 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-yellow-400"></div>

              <div className="relative z-10 text-center space-y-8">
                <div className="space-y-4">
                  <div className="inline-block px-6 py-2 bg-gold/10 rounded-full mb-4">
                    <span className="text-gold font-semibold text-sm uppercase tracking-widest">Let's Build Something Amazing</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight px-2">
                    Ready to Transform <br />
                    <span className="text-gold">Your Business?</span>
                  </h2>
                </div>

                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
                  Work with a team that ships fast, communicates clearly and builds digital systems that perform.
                </p>

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
                      <span>Get Started</span>
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

export default Services;