import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { type ComponentType } from "react";

type ServiceCardProps = {
    icon: ComponentType<{ className?: string }>;
    label: string;
    title: string;
    description: string;
    features: string[];
    className?: string;
    variant?: "default" | "compact";
};

const ServiceCard = ({ icon: Icon, label, title, description, features, className, variant = "default" }: ServiceCardProps) => {
    return (
        <div
            className={cn(
                "relative rounded-2xl border bg-card/70 overflow-hidden group transition-all duration-300 hover:shadow-gold",
                variant === "compact" ? "p-4" : "p-6",
                className
            )}
        >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-tech-blue to-tech-red" />
            <div className={cn("flex items-start gap-4", variant === "compact" ? "mb-3" : "mb-4")}>
                <div className={cn("rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center", variant === "compact" ? "w-10 h-10" : "w-12 h-12")}>
                    <Icon className={cn("text-gold", variant === "compact" ? "w-5 h-5" : "w-6 h-6")} />
                </div>
                <div>
                    <span className={cn("tracking-widest text-foreground/60 font-mono", variant === "compact" ? "text-[10px]" : "text-xs")}>{label}</span>
                    <h3 className={cn("font-semibold", variant === "compact" ? "text-lg" : "text-xl")}>{title}</h3>
                </div>
            </div>
            <p className={cn("text-foreground/70", variant === "compact" ? "text-[13px] mb-3" : "text-sm mb-4")}>{description}</p>
            <ul className={cn("space-y-2", variant === "compact" ? "mb-3" : "mb-6")}>
                {features.map((f, i) => (
                    <li key={i} className={cn("flex items-center gap-3", variant === "compact" ? "text-[13px]" : "text-sm")}>
                        <span className={cn("rounded-full bg-tech-blue", variant === "compact" ? "w-1.5 h-1.5" : "w-2 h-2")}></span>
                        <span className="text-foreground/80">{f}</span>
                    </li>
                ))}
            </ul>
            {variant !== "compact" && (
                <div className="flex gap-3">
                    <Button className="bg-gold hover:bg-[hsl(var(--gold))/0.85] text-background">Learn More</Button>
                    <Button variant="outline" className="border-tech-blue/40 text-tech-blue hover:bg-tech-blue/10">Secondary</Button>
                </div>
            )}
        </div>
    );
};

export default ServiceCard;





