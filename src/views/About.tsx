"use client";

import { useRef } from "react";
import Link from "next/link";
import SiteFooter from "@/components/ui/site-footer";
import Reveal from "@/components/ui/reveal";
import CanonicalHero from "@/components/ui/canonical-hero";
import { useScrollTiltSingle } from "@/hooks/useScrollTilt";
import { Target, MessageSquare, Zap, FileText, Settings } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";

const About = () => {
  // Use shared scroll tilt hook for consistency with Services page
  const sectionRef = useRef<HTMLElement>(null);
  const imageTilt = useScrollTiltSingle(sectionRef);

  usePageSeo({
    title: "About Triovate Labs | Web Development, Digital Marketing & Custom Software Agency",
    description:
      "Triovate Labs is a web development, digital marketing, and custom software agency. We build with clear scope, deliver on schedule, and hand off systems your team can own.",
    path: "/about",
    ogImagePath: "/triovate1.png",
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero - Compact two-column split */}
      <CanonicalHero
        headline="About Triovate Labs"
        description="Building systems that drive measurable growth."
        accentColor="#1E3A8A"
        logoSrc="/triovate1.png"
        lightText={true}
      />

      {/* Philosophy Section */}
      <section ref={sectionRef} id="about-section" className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24 scroll-mt-[88px]">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

            {/* Left: Content (image first on mobile, text first on desktop) */}
            <div className="space-y-8 order-2 lg:order-1">
              <Reveal>
                <div>
                  <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#1E3A8A] mb-3">Our Philosophy</p>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    How We Make Decisions
                  </h2>
                </div>
              </Reveal>

              <div className="space-y-6">
                <Reveal delayMs={60}>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center mt-0.5">
                      <span className="text-[#1E3A8A] font-bold text-sm">01</span>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-gray-900">Design the blueprint first</h3>
                      <p className="text-base text-gray-600 leading-relaxed">
                        We define goals, map users, and plan the data flow before writing a single line of code. When design, development, and marketing start from the same blueprint, projects ship faster and cost less to change.
                      </p>
                    </div>
                  </div>
                </Reveal>

                <Reveal delayMs={120}>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center mt-0.5">
                      <span className="text-[#1E3A8A] font-bold text-sm">02</span>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-gray-900">Clarity is Key</h3>
                      <p className="text-base text-gray-600 leading-relaxed">
                        Clean UX, clean code, clean communication. We document everything, how the system works, interfaces and decisions so teams can understand, maintain and extend what we build without unnecessary dependency.
                      </p>
                    </div>
                  </div>
                </Reveal>

                <Reveal delayMs={180}>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center mt-0.5">
                      <span className="text-[#1E3A8A] font-bold text-sm">03</span>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-gray-900">Launch, Measure, Improve</h3>
                      <p className="text-base text-gray-600 leading-relaxed">
                        We ship the right version first, then track what actually moves revenue. Post-launch improvements are driven by real data.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Right: Floating Image (first on mobile, right on desktop) */}
            <Reveal className="relative flex items-center justify-center order-1 lg:order-2">
              <img
                src="/think.png"
                alt="Systems Thinking"
                className="w-full h-auto max-w-md lg:max-w-none"
                loading="lazy"
                decoding="async"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.12))',
                  transform: `perspective(1800px) rotateY(${imageTilt * 0.7}deg) rotateX(${imageTilt * 0.5}deg) translateZ(${Math.abs(imageTilt) * 3}px)`,
                  transition: 'transform 0.7s cubic-bezier(0.22,0.61,0.36,1)',
                  willChange: 'transform',
                  transformStyle: 'preserve-3d'
                }}
              />
            </Reveal>

          </div>
        </div>
      </section>

      {/* How Projects Actually Run Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">

            <Reveal>
              <div className="text-center mb-14">
                <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#E2B93B] mb-3">Our Process</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  How Projects Actually Run
                </h2>
              </div>
            </Reveal>

            {/* Timeline */}
            <div className="relative">
              <div className="hidden lg:block absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-[#E2B93B] via-[#E2B93B]/40 to-transparent"></div>

              <div className="space-y-10 lg:space-y-12">
                {[
                  { num: "01", title: "Alignment First", desc: "We make sure everyone's clear on goals, users, constraints and success metrics before we start. Scope, milestones and expectations are set early which makes delivery stay on track." },
                  { num: "02", title: "Design & Architecture", desc: "We design for conversion, usability and maintainability. System structure, interfaces and content flow are defined early to prevent rework and surprises later." },
                  { num: "03", title: "Build, QA, Launch", desc: "We develop in iterations with quality checks on performance, responsiveness and stability. Progress is visible and changes are controlled." },
                  { num: "04", title: "Handoff & Support", desc: "You get detailed docs, clear ownership transfer and the option for continued support to keep the system evolving without chaos." },
                ].map((step, i) => (
                  <Reveal key={step.num} delayMs={i * 60}>
                    <div className="flex items-start gap-6 lg:gap-8">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#E2B93B] flex items-center justify-center relative z-10">
                        <span className="text-sm font-bold text-gray-900">{step.num}</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-base text-gray-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What Clients Can Expect Section */}
      <section id="method-section" className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">

            <Reveal>
              <div className="text-center mb-14">
                <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#1E3A8A] mb-3">What To Expect</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  What Clients Can Expect
                </h2>
                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                  Working with Triovate Labs means:
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Target, label: "Clear scope and milestones" },
                { icon: MessageSquare, label: "Structured communication and progress updates" },
                { icon: Zap, label: "Performance-focused builds" },
                { icon: FileText, label: "Documentation and clean handoff" },
                { icon: Settings, label: "Systems your team can maintain and evolve" },
              ].map((item, i) => (
                <Reveal key={i} delayMs={i * 60} className="h-full">
                  <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#1E3A8A]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#1E3A8A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-[#1E3A8A]" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 pt-1.5">{item.label}</h3>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section – reuse home page final CTA */}
      <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
        {/* Simplified gradient background */}
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
                  <Link href="/contact">
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

export default About;
