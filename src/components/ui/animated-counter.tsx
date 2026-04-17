import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

type AnimatedCounterProps = {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
};

export default function AnimatedCounter({
    end,
    duration = 2000,
    suffix = "",
    prefix = "",
    className = ""
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const [ref, inView] = useInView({ threshold: 0.5, once: true });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!inView || hasAnimated.current) return;

        hasAnimated.current = true;
        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (end - startValue) * easeOutCubic);

            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [inView, end, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}