import { useEffect, useRef } from "react";

const TechSphere = () => {
  const sphereRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sphere = sphereRef.current;
    if (!sphere) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = sphere.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotateX = (e.clientY - centerY) / 10;
      const rotateY = (e.clientX - centerX) / 10;
      
      sphere.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      sphere.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    };

    window.addEventListener("mousemove", handleMouseMove);
    sphere.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      sphere.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-72 h-72 mx-auto">
      <div
        ref={sphereRef}
        className="tech-sphere floating-animation"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Sphere wireframe */}
        <div className="sphere-wireframe"></div>
        
        {/* Orbiting particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="orbital-particle"
            style={{
              '--delay': `${i * 0.5}s`,
              '--angle': `${i * 45}deg`,
            } as React.CSSProperties}
          ></div>
        ))}
        
        {/* Central core */}
        <div className="sphere-core"></div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .tech-sphere {
          position: relative;
          width: 300px;
          height: 300px;
          margin: 0 auto;
        }

        .sphere-wireframe {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid hsl(var(--tech-cyan) / 0.6);
          background: radial-gradient(circle at 30% 30%, hsl(var(--tech-cyan) / 0.2) 0%, transparent 70%);
          box-shadow: 
            0 0 30px hsl(var(--tech-cyan) / 0.4),
            inset 0 0 30px hsl(var(--gold) / 0.2);
          animation: hologram-flicker 5s infinite;
        }

        .sphere-wireframe::before {
          content: '';
          position: absolute;
          top: 10%;
          left: 10%;
          right: 10%;
          bottom: 10%;
          border-radius: 50%;
          border: 1px solid hsl(var(--gold) / 0.4);
          animation: float-rotate 6s linear infinite reverse;
        }

        .sphere-wireframe::after {
          content: '';
          position: absolute;
          top: 20%;
          left: 20%;
          right: 20%;
          bottom: 20%;
          border-radius: 50%;
          border: 1px solid hsl(var(--tech-purple) / 0.4);
          animation: float-rotate 4s linear infinite;
        }

        .orbital-particle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background: hsl(var(--gold));
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px hsl(var(--gold));
          animation: orbit 3s linear infinite;
          animation-delay: var(--delay);
        }

        @keyframes orbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(120px) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(120px) rotate(-360deg);
          }
        }

        .sphere-core {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, hsl(var(--gold)) 0%, hsl(var(--gold) / 0.8) 40%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 
            0 0 20px hsl(var(--gold)),
            0 0 40px hsl(var(--gold) / 0.6);
          animation: pulse-gold 2s infinite;
        }
        `
      }} />
    </div>
  );
};

export default TechSphere;