import { PropsWithChildren, useEffect, useRef } from "react";
import { useOptimizedAnimation } from "@/lib/motion";

type MagneticProps = PropsWithChildren<{
    strength?: number; // px offset at center
    radius?: number;   // influence radius in px
    className?: string;
}>;

// Magnetic wrapper: translates child slightly toward the cursor within a radius.
// Respects reduced-motion and removes transforms on blur/leave.
export default function Magnetic({ strength = 12, radius = 140, className, children }: MagneticProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const { canAnimate, registerAnimation, unregisterAnimation } = useOptimizedAnimation();

    useEffect(() => {
        const el = ref.current;
        if (!el || !canAnimate) return;

        registerAnimation();

        let frame = 0;
        const onMove = (e: MouseEvent) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.hypot(dx, dy);
            if (dist > radius) {
                if (!frame) {
                    frame = requestAnimationFrame(() => {
                        el.style.transform = "translate3d(0,0,0)";
                        frame = 0;
                    });
                }
                return;
            }
            const power = 1 - dist / radius;
            const tx = (dx / rect.width) * strength * power;
            const ty = (dy / rect.height) * strength * power;
            if (!frame) {
                frame = requestAnimationFrame(() => {
                    el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
                    frame = 0;
                });
            }
        };

        const reset = () => {
            if (!el) return;
            el.style.transform = "translate3d(0,0,0)";
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        el.addEventListener("mouseleave", reset);
        el.addEventListener("blur", reset);
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener("mousemove", onMove as any);
            el.removeEventListener("mouseleave", reset);
            el.removeEventListener("blur", reset);
            unregisterAnimation();
        };
    }, [strength, radius, canAnimate, registerAnimation, unregisterAnimation]);

    return (
        <div ref={ref} className={className} data-allow-motion>
            {children}
        </div>
    );
}


