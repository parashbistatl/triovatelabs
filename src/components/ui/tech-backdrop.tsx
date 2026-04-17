import { cn } from "@/lib/utils";

type Props = {
    className?: string;
};

// Lightweight, GPU-friendly background: subtle grid + scanlines
export default function TechBackdrop({ className }: Props) {
    return (
        <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
            linear-gradient(hsl(var(--tech-blue) / 0.12) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--tech-blue) / 0.12) 1px, transparent 1px)
          `,
                    backgroundSize: "32px 32px",
                }}
            />
            <div className="absolute inset-0">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent animate-scan-line opacity-20" />
            </div>
        </div>
    );
}


