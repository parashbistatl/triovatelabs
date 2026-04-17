import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Create a dedicated mount outside #root for all floating UI (nav, modals, etc.)
(() => {
    if (!document.getElementById("floating-ui-root")) {
        const el = document.createElement("div");
        el.id = "floating-ui-root";
        document.body.appendChild(el);
    }
})();

createRoot(document.getElementById("root")!).render(<App />);

// Cursor ring driver (global, minimal)
(() => {
    const ring = document.getElementById("cursor-ring");
    if (!ring) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    let visible = false;
    const onMove = (e: MouseEvent) => {
        ring.style.left = e.clientX + "px";
        ring.style.top = e.clientY + "px";
        if (!visible) {
            ring.style.opacity = "1";
            visible = true;
        }
    };
    const onLeave = () => {
        ring.style.opacity = "0";
        visible = false;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
})();
