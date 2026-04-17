import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
    onLoad?: () => void;
}

const LazyImage = ({ src, alt, className, placeholder, onLoad }: LazyImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    return (
        <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
                    {placeholder && (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            {placeholder}
                        </div>
                    )}
                </div>
            )}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={handleLoad}
                    className={cn(
                        "transition-opacity duration-300",
                        isLoaded ? "opacity-100" : "opacity-0",
                        className
                    )}
                    loading="lazy"
                />
            )}
        </div>
    );
};

export default LazyImage;

