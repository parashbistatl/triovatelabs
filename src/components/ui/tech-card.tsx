import { cn } from "@/lib/utils";
import { type ComponentType } from "react";

type TechCardProps = {
    label: string;
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    className?: string;
};

const TechCard = ({ label, title, description, icon: Icon, className }: TechCardProps) => {
    return (
        <div className={cn("relative rounded-xl border bg-card/60 text-card-foreground shadow-sm transition-all duration-300 hover:shadow-gold overflow-hidden group transform hover:-translate-y-1", className)}>
            {/* Top gradient border (2px) */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-tech-blue via-gold to-tech-red bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-[background-position] duration-700"></div>

            {/* Corner micro-icon */}
            <div className="absolute top-3 right-3 text-gold opacity-80 transform transition-transform duration-300 group-hover:scale-110 z-10">
                <Icon className="w-4 h-4" />
            </div>

            <div className="p-6 space-y-3 relative">
                <span className="text-xs tracking-widest text-foreground/60 font-mono">{label}</span>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm text-foreground/70 line-clamp-2">{description}</p>
                {/* subtle hover background accent and ring */}
                <div className="absolute inset-0 pointer-events-none rounded-xl ring-0 group-hover:ring-2 group-hover:ring-gold/30 transition-shadow"></div>
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
        </div>
    );
};

export default TechCard;


