import { useEffect, useRef, useState } from "react";

type Props = {
    className?: string;
    size?: number; // in px
};

export default function ConcentricRings({ className, size = 320 }: Props) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (!ref.current) return;
        const io = new IntersectionObserver(([entry]) => {
            setIsInView(entry.isIntersecting);
        }, { threshold: 0.1 });
        io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    const s = size;
    const center = s / 2;

    return (
        <div ref={ref} className={className} style={{ width: s, height: s }}>
            <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="block" data-allow-motion>
                <defs>
                    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="hsl(var(--gold))" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="hsl(var(--gold))" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="hsl(var(--gold))" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="ringBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--tech-blue))" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="hsl(var(--tech-blue))" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="ringRed" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--tech-red))" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="hsl(var(--tech-red))" stopOpacity="0.4" />
                    </linearGradient>
                </defs>

                {/* Soft core */}
                <circle cx={center} cy={center} r={s * 0.11} fill="url(#goldGlow)" />

                {/* Rotating group (subtle) */}
                <g
                    className={isInView ? "animate-rotate-slow" : undefined}
                    style={{ transformOrigin: "50% 50%", transformBox: "fill-box" as any, animationDuration: isInView ? "6s" : undefined }}
                >
                    {/* Rings */}
                    <g fill="none" strokeLinecap="round">
                        {/* Outer ring */}
                        <circle cx={center} cy={center} r={s * 0.42} stroke="url(#ringBlue)" strokeOpacity={0.65} strokeWidth={2} />
                        {/* Middle ring */}
                        <circle cx={center} cy={center} r={s * 0.30} stroke="hsl(var(--gold))" strokeOpacity={0.35} strokeWidth={2} />
                        {/* Inner ring */}
                        <circle cx={center} cy={center} r={s * 0.20} stroke="url(#ringRed)" strokeOpacity={0.6} strokeWidth={2} />

                        {/* Accent arcs (progressive sweep) */}
                        <Arc cx={center} cy={center} r={s * 0.42} start={-20} len={60} stroke="url(#ringBlue)" width={4} animate={isInView} />
                        <Arc cx={center} cy={center} r={s * 0.20} start={160} len={40} stroke="url(#ringRed)" width={4} animate={isInView} delayMs={400} />
                        <Arc cx={center} cy={center} r={s * 0.30} start={260} len={55} stroke="hsl(var(--gold))" width={3} animate={isInView} delayMs={800} />
                    </g>
                </g>
            </svg>
        </div>
    );
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
    const startP = polarToCartesian(cx, cy, r, end);
    const endP = polarToCartesian(cx, cy, r, start);
    const largeArcFlag = end - start <= 180 ? "0" : "1";
    return [
        "M",
        startP.x,
        startP.y,
        "A",
        r,
        r,
        0,
        largeArcFlag,
        0,
        endP.x,
        endP.y,
    ].join(" ");
}

function Arc({ cx, cy, r, start, len, stroke, width, animate, delayMs = 0 }: {
    cx: number; cy: number; r: number; start: number; len: number; stroke: string; width: number; animate: boolean; delayMs?: number;
}) {
    const pathRef = useRef<SVGPathElement | null>(null);
    const [dash, setDash] = useState(0);

    useEffect(() => {
        if (!pathRef.current) return;
        const len = pathRef.current.getTotalLength();
        setDash(len);
    }, []);

    return (
        <path
            ref={pathRef}
            d={describeArc(cx, cy, r, start, start + len)}
            stroke={stroke}
            strokeWidth={width}
            strokeLinecap="round"
            fill="none"
            style={{
                strokeDasharray: dash,
                strokeDashoffset: animate ? 0 : dash,
                transition: `stroke-dashoffset 600ms ease-out ${delayMs}ms`
            }}
        />
    );
}


