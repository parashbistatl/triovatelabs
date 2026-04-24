"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname() ?? "/";

    // Auto scroll to top when route changes, but skip if there's a hash (let hash navigation handle it)
    useEffect(() => {
        // Don't scroll to top if URL has a hash - let the target page handle hash navigation
        if (typeof window !== "undefined" && !window.location.hash) {
            window.scrollTo({
                top: 0,
                behavior: "auto",
            });
        }
    }, [pathname]);

    useEffect(() => {
        let rafId: number | null = null;
        let ticking = false;

        const toggleVisibility = () => {
            if (!ticking) {
                ticking = true;
                rafId = requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset;
                    if (scrollTop > 300) {
                        setIsVisible(true);
                    } else {
                        setIsVisible(false);
                    }
                    ticking = false;
                });
            }
        };

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    const scrollToTop = () => {
        // Instant scroll for snappier UX
        window.scrollTo({ top: 0, behavior: "auto" });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-[9999] group">
            {/* Enhanced futuristic corner brackets */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-gold/60 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-gold/60 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-gold/60 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-gold/60 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"></div>

            {/* Main button with enhanced animations */}
            <Button
                onClick={scrollToTop}
                className="relative w-14 h-14 rounded-full shadow-2xl hover:shadow-gold transition-all duration-500 hover:scale-110 bg-gold text-white border-2 border-gold hover:border-gold/80 overflow-hidden group animate-float-gentle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                size="icon"
            >
                {/* Icon with enhanced animation */}
                <ArrowUp className="w-6 h-6 relative z-10 group-hover:animate-bounce group-hover:scale-110 transition-transform duration-300" />

                {/* Ripple effect on click */}
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-active:opacity-100 group-active:scale-150 transition-all duration-300"></div>
            </Button>


            {/* Floating particles around button */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold/40 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gold/40 rounded-full animate-ping animation-delay-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
    );
};

export default ScrollToTop;
