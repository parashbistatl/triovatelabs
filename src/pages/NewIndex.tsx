import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";

const NewIndex = () => {
    usePageSeo({
        title: "Triovate Labs | Websites, Marketing & Custom Software",
        description:
            "Websites, marketing systems, and custom software engineered for performance and scale.",
        path: "/new",
        robots: "noindex, follow",
    });
    const [bgColors, setBgColors] = useState({ bg1: "#FFF9E6", bg2: "#FFFBF0" });
    const sectionsRef = useRef<HTMLElement[]>([]);

    // Section configurations
    const sections = [
        {
            id: "about",
            headline: "ABOUT",
            accent: "Our Story",
            description: "We are a systems-minded team crafting human-centered software, automation and strategy that transforms complexity into opportunity.",
            buttonText: "Learn More",
            buttonLink: "/about",
            bgStart: "#FFF9E6", // light gold
            bgEnd: "#FFFBF0"
        },
        {
            id: "services",
            headline: "SERVICES",
            accent: "What We Do",
            description: "Full-stack development, AI automation, and digital strategy engineered to scale. We build systems that empower people and accelerate growth.",
            buttonText: "Explore Services",
            buttonLink: "/services",
            bgStart: "#FFE8E8", // light red
            bgEnd: "#FFF0F0"
        },
        {
            id: "contact",
            headline: "CONTACT",
            accent: "Let's Talk",
            description: "Ready to transform your vision into reality? Get in touch and let's build something extraordinary together.",
            buttonText: "Get Started",
            buttonLink: "/contact",
            bgStart: "#E6F3FF", // light blue
            bgEnd: "#F0F8FF"
        }
    ];

    useEffect(() => {
        let rafId: number | null = null;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                ticking = true;
                rafId = requestAnimationFrame(() => {
                    const scrollPosition = window.scrollY + window.innerHeight / 2;

                    // Find which section is most visible
                    let currentSection = sections[0];
                    let maxVisibility = 0;

                    sectionsRef.current.forEach((section, index) => {
                        if (!section) return;

                        const rect = section.getBoundingClientRect();
                        const sectionTop = rect.top + window.scrollY;
                        const sectionBottom = sectionTop + rect.height;

                        // Calculate visibility percentage
                        const visibleTop = Math.max(sectionTop, window.scrollY);
                        const visibleBottom = Math.min(sectionBottom, window.scrollY + window.innerHeight);
                        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                        const visibility = visibleHeight / window.innerHeight;

                        if (visibility > maxVisibility) {
                            maxVisibility = visibility;
                            currentSection = sections[index];
                        }
                    });

                    setBgColors({
                        bg1: currentSection.bgStart,
                        bg2: currentSection.bgEnd
                    });
                    ticking = false;
                });
            }
        };

        handleScroll(); // Initial call
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div
            className="transition-colors duration-1000 ease-out"
            style={{
                background: `linear-gradient(135deg, ${bgColors.bg1} 0%, ${bgColors.bg2} 100%)`
            }}
        >

            {sections.map((section, index) => (
                <section
                    key={section.id}
                    id={section.id}
                    ref={(el) => {
                        if (el) sectionsRef.current[index] = el;
                    }}
                    className="min-h-[calc(100vh-88px)] flex items-center py-20 px-4 sm:px-6 lg:px-8 scroll-mt-[88px]"
                >
                    <div className="container mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                            {/* Left Column - Visual Placeholder */}
                            <div className="order-1 lg:order-1">
                                <div
                                    className="relative w-full aspect-[4/3] rounded-3xl border-4 border-dashed border-white/40 bg-white/10 backdrop-blur-sm flex items-center justify-center group hover:scale-[1.02] transition-transform duration-500"
                                    style={{
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.05)',
                                        transform: 'perspective(1000px) rotateY(-2deg) rotateX(2deg)'
                                    }}
                                >
                                    {/* Placeholder content */}
                                    <div className="text-center space-y-4 opacity-40 group-hover:opacity-60 transition-opacity">
                                        <div className="w-20 h-20 mx-auto rounded-2xl border-2 border-dashed border-white/60 flex items-center justify-center">
                                            <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-white/60 font-medium">Visual Placeholder</p>
                                        <p className="text-white/40 text-sm">Insert device mockup here</p>
                                    </div>

                                    {/* Decorative elements */}
                                    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-2xl"></div>
                                    <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-tr from-white/15 to-transparent blur-3xl"></div>
                                </div>
                            </div>

                            {/* Right Column - Text Content */}
                            <div className="order-2 lg:order-2 space-y-8">
                                <div className="relative">
                                    {/* Large headline */}
                                    <h2
                                        className="font-bold leading-none tracking-tight"
                                        style={{
                                            fontSize: 'clamp(4rem, 15vw, 10rem)',
                                            color: '#FFFFFF',
                                            textShadow: '0 4px 20px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
                                            WebkitTextStroke: '1px rgba(255,255,255,0.3)'
                                        }}
                                    >
                                        {section.headline}
                                    </h2>

                                    {/* Script accent word */}
                                    <div
                                        className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none"
                                        style={{
                                            fontSize: 'clamp(2rem, 6vw, 4rem)',
                                            fontFamily: 'Georgia, "Times New Roman", serif',
                                            fontStyle: 'italic',
                                            fontWeight: 300,
                                            color: 'rgba(0,0,0,0.25)',
                                            textShadow: '0 2px 10px rgba(255,255,255,0.5)',
                                            mixBlendMode: 'multiply'
                                        }}
                                    >
                                        {section.accent}
                                    </div>
                                </div>

                                {/* Description */}
                                <p
                                    className="text-lg sm:text-xl leading-relaxed max-w-xl"
                                    style={{
                                        color: 'rgba(0,0,0,0.7)'
                                    }}
                                >
                                    {section.description}
                                </p>

                                {/* CTA Button */}
                                <Link to={section.buttonLink}>
                                    <button
                                        className="px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                        style={{
                                            background: 'rgba(255,255,255,0.9)',
                                            color: '#0A1628',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        {section.buttonText}
                                    </button>
                                </Link>
                            </div>

                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
};

export default NewIndex;//*
