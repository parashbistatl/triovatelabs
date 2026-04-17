type Props = {
    intensity?: number; // 0..1
};

// Decorative brand glows for hero sections. Lightweight and responsive.
export default function HeroDecor({ intensity = 1 }: Props) {
    const i = Math.max(0, Math.min(1, intensity));
    return (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div
                className="absolute -top-20 -left-20 w-[40vw] max-w-[520px] aspect-square rounded-full blur-3xl opacity-30"
                style={{ background: `radial-gradient(circle, hsl(var(--gold) / ${0.25 * i}) 0%, transparent 70%)` }}
            />
            <div
                className="absolute -bottom-24 left-1/3 w-[35vw] max-w-[460px] aspect-square rounded-full blur-3xl opacity-30"
                style={{ background: `radial-gradient(circle, hsl(var(--tech-blue) / ${0.22 * i}) 0%, transparent 70%)` }}
            />
            <div
                className="absolute -top-10 right-0 w-[30vw] max-w-[420px] aspect-square rounded-full blur-3xl opacity-25"
                style={{ background: `radial-gradient(circle, hsl(var(--tech-red) / ${0.18 * i}) 0%, transparent 70%)` }}
            />
        </div>
    );
}


