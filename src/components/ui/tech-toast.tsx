import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type TechToastProps = {
    type: "success" | "error" | "info" | "warning";
    message: string;
    duration?: number;
    onClose?: () => void;
};

export default function TechToast({
    type,
    message,
    duration = 5000,
    onClose
}: TechToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 300);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
    };

    const getIcon = () => {
        switch (type) {
            case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "error": return <AlertCircle className="w-5 h-5 text-red-500" />;
            case "warning": return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case "info": return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case "success": return "border-green-500/30";
            case "error": return "border-red-500/30";
            case "warning": return "border-yellow-500/30";
            case "info": return "border-blue-500/30";
        }
    };

    return (
        <div
            className={cn(
                "fixed top-4 right-4 z-50 max-w-sm",
                "bg-background/95 backdrop-blur-sm",
                "border rounded-lg shadow-lg",
                "transform transition-all duration-300 ease-out",
                isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
                getBorderColor()
            )}
            data-allow-motion
        >
            <div className="p-4 flex items-start gap-3">
                {getIcon()}
                <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className="text-foreground/50 hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Tech scan line effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent animate-scan-line opacity-0" />
            </div>
        </div>
    );
}




