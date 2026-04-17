import { PropsWithChildren, useEffect, useRef } from "react";
import { useOptimizedAnimation } from "@/lib/motion";

type ParallaxProps = PropsWithChildren<{
    factor?: number; // positive moves slower than scroll
    className?: string;
}>;

// Lightweight parallax that respects reduced-motion and uses rAF.
export default function Parallax({ factor = 0.1, className, children }: ParallaxProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const { canAnimate, registerAnimation, unregisterAnimation } = useOptimizedAnimation();

    useEffect(() => {
        const el = ref.current;
        if (!el || !canAnimate) return;

        registerAnimation();

        let frame = 0;
        const onScroll = () => {
            if (frame) return; // throttle to rAF
            frame = requestAnimationFrame(() => {
                const y = window.scrollY * factor;
                el.style.transform = `translate3d(0, ${y}px, 0)`;
                frame = 0;
            });
        };

        // Initial position
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            unregisterAnimation();
        };
    }, [factor, canAnimate, registerAnimation, unregisterAnimation]);

    return (
        <div ref={ref} className={`${className} parallax-mobile`} data-allow-motion>
            {children}
        </div>
    );
}


