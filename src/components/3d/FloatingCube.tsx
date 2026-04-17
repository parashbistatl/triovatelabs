import { useEffect, useRef } from "react";

const FloatingCube = () => {
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cube.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = (y / rect.height) * 20;
      const rotateY = (x / rect.width) * 20;
      
      cube.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(50px)`;
    };

    const handleMouseLeave = () => {
      cube.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    };

    cube.addEventListener("mousemove", handleMouseMove);
    cube.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cube.removeEventListener("mousemove", handleMouseMove);
      cube.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-64 h-64 mx-auto">
      <div
        ref={cubeRef}
        className="cube-container floating-animation"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Cube faces */}
        <div className="cube-face cube-front"></div>
        <div className="cube-face cube-back"></div>
        <div className="cube-face cube-right"></div>
        <div className="cube-face cube-left"></div>
        <div className="cube-face cube-top"></div>
        <div className="cube-face cube-bottom"></div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .cube-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }

        .cube-face {
          position: absolute;
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, hsl(var(--gold)) 0%, hsl(var(--gold-light)) 100%);
          border: 2px solid hsl(var(--gold-dark));
          opacity: 0.9;
        }

        .cube-front {
          transform: rotateY(0deg) translateZ(100px);
        }
        .cube-back {
          transform: rotateY(180deg) translateZ(100px);
        }
        .cube-right {
          transform: rotateY(90deg) translateZ(100px);
        }
        .cube-left {
          transform: rotateY(-90deg) translateZ(100px);
        }
        .cube-top {
          transform: rotateX(90deg) translateZ(100px);
        }
        .cube-bottom {
          transform: rotateX(-90deg) translateZ(100px);
        }
        `
      }} />
    </div>
  );
};

export default FloatingCube;