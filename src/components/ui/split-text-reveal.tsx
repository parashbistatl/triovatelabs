import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type SplitTextRevealProps = {
    text: string;
    className?: string;
    splitBy?: "word" | "character";
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
};

const directionMap = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
};

export function SplitTextReveal({
    text,
    className = "",
    splitBy = "word",
    delay = 0.05,
    direction = "up",
}: SplitTextRevealProps) {
    const [ref, inView] = useInView({ threshold: 0.2, once: true });
    const offset = directionMap[direction];

    const words = splitBy === "word"
        ? text.split(" ")
        : text.split("").filter(char => char !== " ");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: delay,
                delayChildren: 0.1,
            },
        },
    };

    const wordVariants = {
        hidden: {
            opacity: 0,
            y: offset.y,
            x: offset.x,
            rotateX: -90,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            rotateX: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <motion.span
            ref={ref}
            className={cn("inline-block", className)}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            data-allow-motion
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    variants={wordVariants}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {splitBy === "word" ? (
                        <>
                            {word}
                            {index < words.length - 1 && "\u00A0"}
                        </>
                    ) : (
                        word
                    )}
                </motion.span>
            ))}
        </motion.span>
    );
}



