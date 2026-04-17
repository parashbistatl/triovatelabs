import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type MorphingGradientBorderProps = {
    children: ReactNode;
    className?: string;
    colors?: string[];
    thickness?: number;
    direction?: "up" | "down";
};

export function MorphingGradientBorder({
    children,
    className = "",
    colors = ["hsl(var(--tech-blue))", "hsl(var(--gold))", "hsl(var(--tech-red))"],
    thickness = 3,
    direction = "down",
}: MorphingGradientBorderProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [inViewRef, inView] = useInView({ threshold: 0.1, once: false });

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Animate gradient position based on scroll
    const gradientPosition = useTransform(
        scrollYProgress,
        [0, 1],
        direction === "down" ? ["0%", "100%"] : ["100%", "0%"]
    );

    // Rotate gradient angle
    const gradientAngle = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [0, 45, 90]
    );

    // Animate border width/thickness
    const borderWidth = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [thickness, thickness * 1.5, thickness]
    );

    return (
        <motion.div
            ref={(node) => {
                ref.current = node;
                if (typeof inViewRef === "function") {
                    inViewRef(node);
                } else if (inViewRef) {
                    (inViewRef as any).current = node;
                }
            }}
            className={cn("relative rounded-3xl", className)}
            data-allow-motion
            style={{
                background: `linear-gradient(${gradientAngle}deg, ${colors.join(", ")})`,
                backgroundSize: "200% 200%",
                backgroundPosition: gradientPosition,
                padding: `${borderWidth}px`,
            }}
        >
            {/* Content with inner background to create border effect */}
            <div className="relative z-10 rounded-3xl h-full w-full bg-card/70">
                {children}
            </div>
        </motion.div>
    );
}

