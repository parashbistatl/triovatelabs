export default function QuantumOrbits() {
    return (
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
            <div className="orbit orb-blue" />
            <div className="orbit orb-gold" />
            <div className="orbit orb-red" />
            <style>{`
        .orbit { position:absolute; border-radius:9999px; filter: blur(20px); opacity:.18; will-change: transform; transform: translateZ(0); backface-visibility: hidden; }
        .orb-blue { width:420px; height:420px; background: var(--tl-blue); top:15%; left:-120px; animation: drift1 18s ease-in-out infinite; }
        .orb-gold { width:520px; height:520px; background: var(--tl-gold); bottom:-160px; left:35%; animation: drift2 20s ease-in-out infinite; }
        .orb-red { width:380px; height:380px; background: var(--tl-red); top:-140px; right:-120px; animation: drift3 16s ease-in-out infinite; }
        @keyframes drift1 { 0%,100%{ transform: translate3d(0,0,0)} 50%{ transform: translate3d(20px, -10px, 0)} }
        @keyframes drift2 { 0%,100%{ transform: translate3d(0,0,0)} 50%{ transform: translate3d(-30px, 15px, 0)} }
        @keyframes drift3 { 0%,100%{ transform: translate3d(0,0,0)} 50%{ transform: translate3d(25px, 20px, 0)} }
        @media (prefers-reduced-motion: reduce){ .orbit { animation: none !important; } }
      `}</style>
        </div>
    );
}


