import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type MagneticScrollProps = {
    children: ReactNode;
    className?: string;
    intensity?: number;
    direction?: "up" | "down";
};

export function MagneticScroll({
    children,
    className = "",
    intensity = 0.15,
    direction = "down"
}: MagneticScrollProps) {
    const ref = useRef<HTMLDivElement>(null);
    const setLocalRef = (node: HTMLDivElement | null) => {
        (ref as { current: HTMLDivElement | null }).current = node;
    };
    const [inViewRef, inView] = useInView({ threshold: 0.1, once: false });

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Smooth spring animation
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Calculate rotation based on scroll position
    const rotateX = useTransform(
        smoothProgress,
        [0, 0.5, 1],
        direction === "down"
            ? [15 * intensity, 0, -15 * intensity]
            : [-15 * intensity, 0, 15 * intensity]
    );

    const rotateY = useTransform(
        smoothProgress,
        [0, 0.5, 1],
        [-10 * intensity, 0, 10 * intensity]
    );

    const scale = useTransform(
        smoothProgress,
        [0, 0.5, 1],
        [0.95, 1, 0.95]
    );

    const opacity = useTransform(
        smoothProgress,
        [0, 0.2, 0.8, 1],
        [0.3, 1, 1, 0.3]
    );

    return (
        <motion.div
            ref={(node) => {
                setLocalRef(node);
                if (inViewRef) {
                    (inViewRef as any).current = node;
                }
            }}
            className={className}
            style={{
                rotateX: inView ? rotateX : 0,
                rotateY: inView ? rotateY : 0,
                scale: inView ? scale : 1,
                opacity: inView ? opacity : 1,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            data-allow-motion
        >
            {children}
        </motion.div>
    );
}
