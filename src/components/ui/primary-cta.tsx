import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ShatterButton } from "./shatter-button";

type Props = {
    intent?: "get-started" | "contact";
    className?: string;
    children?: React.ReactNode;
};

export default function PrimaryCTA({ intent = "get-started", className, children }: Props) {
    const navigate = useNavigate();
    const label = children ?? (intent === "get-started" ? "Get Started" : "Contact Us");
    const onClick = () => {
        try {
            navigate("/contact#start");
        } catch {
            window.location.href = "/contact#start";
        }
    };

    // Use standardized accent color for shatter effect
    const shatterColor = intent === "get-started" ? "#E2B93B" : "#3BA8FF";

    return (
        <ShatterButton
            onClick={onClick}
            shatterColor={shatterColor}
            shardCount={20}
            className={cn(
                "premium-cta inline-flex items-center justify-center px-6 py-3 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-premium-focus-blue focus:ring-offset-2 focus:ring-offset-transparent",
                className
            )}
        >
            <span className="relative z-10">{label}</span>
        </ShatterButton>
    );
}


