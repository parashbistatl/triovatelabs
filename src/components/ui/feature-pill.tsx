import { cn } from "@/lib/utils";
import { type ComponentType } from "react";

type FeaturePillProps = {
    icon: ComponentType<{ className?: string }>;
    text: string;
    variant?: "blue" | "red";
    className?: string;
};

const FeaturePill = ({ icon: Icon, text, variant = "blue", className }: FeaturePillProps) => {
    return (
        <div
            tabIndex={0}
            aria-label={text}
            className={cn(
                "relative group overflow-hidden flex items-center gap-3 px-5 py-3 rounded-full border backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
                variant === "blue"
                    ? "bg-tech-blue/10 border-tech-blue/20"
                    : "bg-tech-red/10 border-tech-red/20",
                className
            )}
        >
            {/* animated top gradient accent */}
            <div className={cn(
                "pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-tech-blue via-gold to-tech-red opacity-60",
                "bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-[background-position] duration-700"
            )}></div>

            {/* holographic sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen"></div>

            {/* moving glisten sweep */}
            <div className="pointer-events-none absolute -inset-y-2 -left-1/3 w-1/3 rotate-6 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-90 blur-sm animate-hologram-scan"></div>

            {/* soft radial glow */}
            <div className="pointer-events-none absolute -inset-4 bg-[radial-gradient(closest-side,rgba(255,215,0,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className={cn(
                "relative w-8 h-8 rounded-full flex items-center justify-center ring-1 transition-all duration-300 group-hover:ring-gold/50 group-hover:scale-105",
                variant === "blue" ? "bg-tech-blue/20 ring-tech-blue/30" : "bg-tech-red/20 ring-tech-red/30"
            )}>
                <Icon className="w-4 h-4 text-gold drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]" />
                {/* tiny orbiting spark */}
                <span className="absolute -right-1 top-1 w-1.5 h-1.5 bg-gold/80 rounded-full animate-ping"></span>
            </div>
            <span className="text-sm font-medium text-foreground/90 relative z-[1]">{text}</span>
        </div>
    );
};

export default FeaturePill;
