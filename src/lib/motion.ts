// Centralized motion configuration and utilities
export const MOTION_CONFIG = {
    // Durations (in ms)
    durations: {
        fast: 150,
        normal: 300,
        slow: 500,
        pageTransition: 280,
        reveal: 500,
        parallax: 120,
    },

    // Easing functions
    easing: {
        easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
        spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },

    // Performance thresholds
    performance: {
        maxConcurrentAnimations: 3,
        fpsThreshold: 55,
        reducedMotionBreakpoint: 768, // px
    },

    // Animation delays (in ms)
    delays: {
        stagger: 60,
        reveal: 120,
        magnetic: 100,
    }
} as const;

// Motion state management
class MotionManager {
    private activeAnimations = 0;
    private isReducedMotion = false;
    private isLowPerformance = false;

    constructor() {
        this.checkReducedMotion();
        this.checkPerformance();
        this.setupPerformanceMonitoring();
    }

    private checkReducedMotion() {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.isReducedMotion = media.matches;

        media.addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
        });
    }

    private checkPerformance() {
        // Simple performance check based on hardware concurrency
        const cores = navigator.hardwareConcurrency || 4;
        this.isLowPerformance = cores < 4;
    }

    private setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();

        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.isLowPerformance = fps < MOTION_CONFIG.performance.fpsThreshold;
                frameCount = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
    }

    canAnimate(): boolean {
        return !this.isReducedMotion &&
            this.activeAnimations < MOTION_CONFIG.performance.maxConcurrentAnimations &&
            !this.isLowPerformance;
    }

    registerAnimation() {
        this.activeAnimations++;
    }

    unregisterAnimation() {
        this.activeAnimations = Math.max(0, this.activeAnimations - 1);
    }

    getMotionConfig() {
        return {
            ...MOTION_CONFIG,
            canAnimate: this.canAnimate(),
            isReducedMotion: this.isReducedMotion,
            isLowPerformance: this.isLowPerformance,
        };
    }
}

// Singleton instance
export const motionManager = new MotionManager();

// Utility functions
export const getMotionDuration = (type: keyof typeof MOTION_CONFIG.durations): number => {
    const config = motionManager.getMotionConfig();
    return config.canAnimate ? MOTION_CONFIG.durations[type] : 0;
};

export const getMotionEasing = (type: keyof typeof MOTION_CONFIG.easing): string => {
    return MOTION_CONFIG.easing[type];
};

export const shouldAnimate = (): boolean => {
    return motionManager.canAnimate();
};

// Performance-optimized animation hook
export const useOptimizedAnimation = () => {
    const config = motionManager.getMotionConfig();

    return {
        canAnimate: config.canAnimate,
        isReducedMotion: config.isReducedMotion,
        isLowPerformance: config.isLowPerformance,
        registerAnimation: () => motionManager.registerAnimation(),
        unregisterAnimation: () => motionManager.unregisterAnimation(),
    };
};




