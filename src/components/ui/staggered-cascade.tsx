import { motion } from "framer-motion";
import { useRef, ReactNode, Children, isValidElement } from "react";
import { useInView } from "@/hooks/useInView";

type StaggeredCascadeProps = {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    direction?: "left" | "right" | "up" | "down" | "diagonal";
    duration?: number;
};

const directionMap = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 },
    diagonal: { x: -30, y: 30 },
};

export function StaggeredCascade({
    children,
    className = "",
    staggerDelay = 0.1,
    direction = "left",
    duration = 0.6,
}: StaggeredCascadeProps) {
    const [ref, inView] = useInView({ threshold: 0.1, once: true });
    const offset = directionMap[direction];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            x: offset.x,
            y: offset.y,
            scale: 0.8,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: {
                duration,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            data-allow-motion
        >
            {Children.map(children, (child, index) => {
                if (isValidElement(child)) {
                    return (
                        <motion.div key={index} variants={itemVariants}>
                            {child}
                        </motion.div>
                    );
                }
                return child;
            })}
        </motion.div>
    );
}


