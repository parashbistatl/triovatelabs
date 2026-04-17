import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type OptimizedImageProps = {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    sizes?: string;
    quality?: number;
    placeholder?: "blur" | "empty";
    blurDataURL?: string;
};

export default function OptimizedImage({
    src,
    alt,
    className,
    priority = false,
    sizes = "100vw",
    quality = 75,
    placeholder = "empty",
    blurDataURL
}: OptimizedImageProps) {
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
            { rootMargin: "50px" }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
            {/* Blur placeholder */}
            {placeholder === "blur" && blurDataURL && !isLoaded && (
                <div
                    className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
                    style={{ backgroundImage: `url(${blurDataURL})` }}
                />
            )}

            {/* Loading skeleton */}
            {!isLoaded && placeholder === "empty" && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            )}

            {/* Actual image */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    className={cn(
                        "w-full h-full object-cover transition-opacity duration-300",
                        isLoaded ? "opacity-100" : "opacity-0"
                    )}
                    loading={priority ? "eager" : "lazy"}
                    fetchPriority={priority ? "high" : "auto"}
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    sizes={sizes}
                />
            )}
        </div>
    );
}




