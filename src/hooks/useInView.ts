import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

type InViewOptions = {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
    once?: boolean;
};

export function useInView<T extends HTMLElement = HTMLElement>(options: InViewOptions = {}): [MutableRefObject<T | null>, boolean] {
    const { root = null, rootMargin = "0px 0px -10% 0px", threshold = 0.15, once = true } = options;
    const ref = useRef<T | null>(null);
    const [inView, setInView] = useState(false);

    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                setInView(true);
                if (once && ref.current) {
                    observer.unobserve(ref.current);
                }
            } else if (!once) {
                setInView(false);
            }
        },
        [once]
    );

    useEffect(() => {
        if (!ref.current) return;
        if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(handleIntersect, { root, rootMargin, threshold });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [root, rootMargin, threshold, handleIntersect]);

    return [ref, inView];
}

