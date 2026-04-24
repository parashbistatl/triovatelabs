import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type ScaleBlurRevealProps = {
    children: ReactNode;
    className?: string;
    blurAmount?: number;
    scaleFrom?: number;
    direction?: "up" | "down";
};

export function ScaleBlurReveal({
    children,
    className = "",
    blurAmount = 10,
    scaleFrom = 0.8,
    direction = "up",
}: ScaleBlurRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const setLocalRef = (node: HTMLDivElement | null) => {
        (ref as { current: HTMLDivElement | null }).current = node;
    };
    const [inViewRef, inView] = useInView({ threshold: 0.2, once: true });

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        [scaleFrom, 1, 1, scaleFrom]
    );

    const blur = useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        [blurAmount, 0, 0, blurAmount]
    );

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 1],
        [0, 1, 1, 0]
    );

    const y = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        direction === "up" ? [50, 0, -50] : [-50, 0, 50]
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
                scale: inView ? scale : scaleFrom,
                filter: `blur(${inView ? blur : blurAmount}px)`,
                opacity: inView ? opacity : 0,
                y: inView ? y : (direction === "up" ? 50 : -50),
            }}
            data-allow-motion
        >
            {children}
        </motion.div>
    );
}


