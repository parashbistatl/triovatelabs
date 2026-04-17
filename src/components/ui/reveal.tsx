import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { useInView } from "@/hooks/useInView";

type RevealProps = PropsWithChildren<{
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    offsetY?: number;
    delayMs?: number;
}>;

export function Reveal({ as = "div", className, children, offsetY = 16, delayMs = 0 }: RevealProps) {
    const [ref, inView] = useInView({ rootMargin: "0px 0px -10% 0px", threshold: 0.15, once: true });
    const Tag = as as any;

    return (
        <Tag
            ref={ref}
            style={{ transitionDelay: `${delayMs}ms` }}
            className={cn(
                "will-change-transform opacity-0 translate-y-[var(--reveal-offset,16px)] transition-opacity transition-transform duration-500 ease-out",
                inView && "opacity-100 translate-y-0",
                className
            )}
            data-allow-motion
        >
            <style>{`:root { --reveal-offset: ${offsetY}px; }`}</style>
            {children}
        </Tag>
    );
}

export default Reveal;

