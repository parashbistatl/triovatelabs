import { cn } from "@/lib/utils";
import { type ComponentType } from "react";

type NeonChipProps = {
    icon: ComponentType<{ className?: string }>;
    text: string;
    accent?: "blue" | "red";
    className?: string;
};

const NeonChip = ({ icon: Icon, text, accent = "blue", className }: NeonChipProps) => {
    return (
        <div
            tabIndex={0}
            aria-label={text}
            className={cn(
                "relative group overflow-hidden flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
                accent === "blue" ? "bg-tech-blue/10 border-tech-blue/20" : "bg-tech-red/10 border-tech-red/20",
                className
            )}
        >
            {/* animated top gradient accent */}
            <div
                className={cn(
                    "pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-tech-blue via-gold to-tech-red opacity-60",
                    "bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-[background-position] duration-700"
                )}
            />

            {/* neon glow backdrop */}
            <div className="pointer-events-none absolute -inset-4 bg-[radial-gradient(closest-side,rgba(255,215,0,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* icon */}
            <div
                className={cn(
                    "relative w-9 h-9 rounded-lg flex items-center justify-center ring-1 transition-all duration-300 group-hover:ring-gold/50 group-hover:scale-105",
                    accent === "blue" ? "bg-tech-blue/20 ring-tech-blue/30" : "bg-tech-red/20 ring-tech-red/30"
                )}
            >
                <Icon className="w-5 h-5 text-gold drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]" />
                <span className="absolute -right-1 top-1 w-1.5 h-1.5 bg-gold/80 rounded-full animate-ping" />
            </div>

            <span className="text-sm font-medium text-foreground/90 relative z-[1]">{text}</span>
        </div>
    );
};

export default NeonChip;



