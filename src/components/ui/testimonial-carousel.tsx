import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Testimonial = {
    name: string;
    company: string;
    text: string;
    avatarUrl?: string;
};

type Props = {
    items: Testimonial[];
    intervalMs?: number;
    className?: string;
};

const TestimonialCarousel = ({ items, intervalMs = 5000, className }: Props) => {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const next = () => setIndex((i) => (i + 1) % items.length);
    const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

    useEffect(() => {
        if (isPaused || items.length <= 1) return;
        const id = setInterval(next, intervalMs);
        return () => clearInterval(id);
    }, [isPaused, index, items.length, intervalMs]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        el.addEventListener("keydown", onKey);
        return () => el.removeEventListener("keydown", onKey);
    }, []);

    const current = items[index];

    return (
        <div
            ref={containerRef}
            className={cn("relative outline-none", className)}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonials"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            <div className="relative h-full" aria-live="polite">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {[0, 1, 2].map((offset) => {
                        const i = (index + offset - 1 + items.length) % items.length;
                        const t = items[i];
                        const isCenter = offset === 1;
                        const isBlue = i % 2 === 0;
                        return (
                            <div
                                key={i}
                                className={cn(
                                    "transition-all duration-500 rounded-2xl p-6 border bg-card/70 backdrop-blur relative overflow-hidden",
                                    isCenter
                                        ? "shadow-[0_20px_60px_rgba(212,163,18,0.25)] scale-100"
                                        : "opacity-80 scale-95",
                                    isBlue ? "border-tech-blue/30" : "border-tech-red/30"
                                )}
                            >
                                {/* top gradient rule */}
                                <div className={cn("absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r", isBlue ? "from-tech-blue to-gold" : "from-tech-red to-gold")}></div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <img
                                            src={t.avatarUrl || "/Triovate.png"}
                                            alt=""
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <span className={cn("absolute inset-0 rounded-full ring-2", isBlue ? "ring-tech-blue/60" : "ring-tech-red/60")}></span>
                                        <span className="absolute -bottom-1 -right-1 bg-tech-red text-background rounded-full p-0.5">
                                            <CheckCheck className="w-3 h-3" />
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">{t.name}</p>
                                        <p className={cn("text-sm", isBlue ? "text-tech-blue/70" : "text-tech-red/70")}>{t.company}</p>
                                    </div>
                                </div>
                                <p className="text-foreground/80 leading-relaxed">"{t.text}"</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <button
                aria-label="Previous"
                onClick={prev}
                className="absolute -left-3 top-1/2 -translate-y-1/2 p-2 rounded-full border border-gold/30 bg-background/70 hover:bg-gold/10 text-gold"
            >
                <ArrowLeft className="w-4 h-4" />
            </button>
            <button
                aria-label="Next"
                onClick={next}
                className="absolute -right-3 top-1/2 -translate-y-1/2 p-2 rounded-full border border-gold/30 bg-background/70 hover:bg-gold/10 text-gold"
            >
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default TestimonialCarousel;


