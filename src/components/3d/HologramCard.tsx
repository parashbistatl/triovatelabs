import { useEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";

interface HologramCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const HologramCard = ({ icon: Icon, title, description, delay = 0 }: HologramCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateY = (x / rect.width) * 20;
      const rotateX = -(y / rect.height) * 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div 
      className="hologram-card-wrapper floating-animation"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        ref={cardRef}
        className="hologram-card hologram-border"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="hologram-content">
          <div className="hologram-icon">
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="hologram-title">{title}</h3>
          <p className="hologram-description">{description}</p>
          
          {/* Tech pattern overlay */}
          <div className="tech-pattern"></div>
          
          {/* Data streams */}
          <div className="data-stream-1"></div>
          <div className="data-stream-2"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hologram-card-wrapper {
          perspective: 1000px;
          position: relative;
        }

        .hologram-card {
          position: relative;
          padding: 2rem;
          border-radius: 1rem;
          background: linear-gradient(135deg, hsl(var(--card) / 0.9) 0%, hsl(var(--gold) / 0.1) 100%);
          backdrop-filter: blur(20px) saturate(180%);
          border: 2px solid transparent;
          overflow: hidden;
          cursor: pointer;
          min-height: 200px;
        }

        .hologram-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: hsl(var(--foreground));
        }

        .hologram-icon {
          display: inline-flex;
          padding: 1rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, hsl(var(--gold) / 0.2) 0%, hsl(var(--tech-cyan) / 0.2) 100%);
          color: hsl(var(--gold));
          margin-bottom: 1rem;
          box-shadow: 0 0 20px hsl(var(--gold) / 0.3);
        }

        .hologram-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: var(--gradient-hologram);
          background-size: 300% 300%;
          animation: gradient-shift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hologram-description {
          font-size: 0.875rem;
          color: hsl(var(--foreground) / 0.8);
          line-height: 1.5;
        }

        .tech-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(90deg, hsl(var(--tech-cyan) / 0.1) 1px, transparent 1px),
            linear-gradient(hsl(var(--gold) / 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: data-flow 4s linear infinite;
          z-index: 1;
        }

        .data-stream-1,
        .data-stream-2 {
          position: absolute;
          width: 2px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, hsl(var(--tech-cyan)), transparent);
          animation: matrix-rain 3s linear infinite;
        }

        .data-stream-1 {
          top: -30px;
          left: 20%;
          animation-delay: 1s;
        }

        .data-stream-2 {
          top: -30px;
          right: 20%;
          animation-delay: 2s;
          background: linear-gradient(to bottom, transparent, hsl(var(--gold)), transparent);
        }

        .hologram-card:hover .tech-pattern {
          animation-duration: 1s;
        }

        .hologram-card:hover .hologram-icon {
          transform: translateZ(20px) scale(1.1);
          box-shadow: 0 0 30px hsl(var(--gold) / 0.5);
        }
        `
      }} />
    </div>
  );
};

export default HologramCard;