import { useState } from "react";
// Performance: Tree-shakeable imports - Vite will only bundle used icons
import { BarChart3, Activity, Database, Cpu, Shield, Binary } from "lucide-react";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import Reveal from "@/components/ui/reveal";

const DataVisualization = () => {
  const [activeMetric, setActiveMetric] = useState<number | null>(null);

  const metrics = [
    { label: "System Performance", value: 98.7, color: "tech-blue", icon: Activity, tech: "CPU" },
    { label: "Data Processing", value: 94.2, color: "gold", icon: Database, tech: "AI" },
    { label: "Network Security", value: 99.1, color: "tech-red", icon: Shield, tech: "QUANTUM" },
    { label: "Uptime Reliability", value: 99.9, color: "gold", icon: BarChart3, tech: "CLOUD" },
    { label: "AI Processing", value: 96.8, color: "tech-blue", icon: Cpu, tech: "ML" },
    { label: "Data Encryption", value: 100, color: "tech-red", icon: Binary, tech: "CRYPTO" },
  ];

  // User-driven interaction only; no auto-rotation
  const hasActive = activeMetric !== null;

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Light-Friendly Shader Animation */}
      <div className="absolute inset-0 opacity-8 pointer-events-none mix-blend-overlay">
        <ShaderAnimation />
      </div>

      {/* Tech Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-2 h-2 bg-tech-blue rounded-full opacity-40"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-tech-red rounded-full opacity-40"></div>
        <div className="absolute top-1/2 left-10 w-2.5 h-2.5 bg-gold rounded-full opacity-40"></div>
        <div className="absolute bottom-20 right-1/4 w-1 h-1 bg-tech-blue rounded-full opacity-40"></div>

        {/* Circuit lines */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 border border-tech-blue/20 rounded-full animate-rotate-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 border border-tech-red/20 rounded-full animate-rotate-slow animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 border border-gold/20 rounded-full animate-rotate-slow animation-delay-4000"></div>
        </div>

        {/* Futuristic grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--tech-blue) / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--tech-blue) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        {/* Scan lines */}
        <div className="absolute inset-0">
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-tech-blue to-transparent animate-scan-line opacity-20"></div>
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent animate-scan-line animation-delay-1500 opacity-15"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Centered section header */}
        <Reveal>
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-6 py-3">
              <BarChart3 className="w-5 h-5 text-gold" />
              <span className="text-gold font-medium">Real-Time Analytics</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Data-Driven <span className="text-gold relative">
                Decision Making
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-tech-blue to-tech-red rounded-full opacity-60"></div>
              </span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Transform raw data into actionable insights with our advanced analytics platform.
              Monitor performance, predict trends, and optimize operations in real-time.
            </p>
          </div>
        </Reveal>

        <div className={`grid gap-16 items-start ${hasActive ? 'lg:grid-cols-2' : ''}`}>
          {/* Left: Metrics list */}
          <Reveal>
            <div className="space-y-6">
              {/* Interactive Metrics */}
              <div className="space-y-3">
                {metrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  const isActive = index === activeMetric;
                  return (
                    <Reveal key={metric.label} delayMs={index * 80}>
                      <button
                        className={`w-full text-left p-4 glass-morphism rounded-lg transition-all duration-300 group ${isActive ? 'tech-glow' : ''}`}
                        onClick={() => setActiveMetric(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${metric.color === 'gold' ? 'bg-gold/10 group-hover:bg-gold/20' : metric.color === 'tech-blue' ? 'bg-tech-blue/10 group-hover:bg-tech-blue/20' : 'bg-tech-red/10 group-hover:bg-tech-red/20'} transition-all duration-300`}>
                              <IconComponent className={`w-5 h-5 ${metric.color === 'gold' ? 'text-gold' : metric.color === 'tech-blue' ? 'text-tech-blue' : 'text-tech-red'}`} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{metric.label}</span>
                              <span className={`text-xs ${metric.color === 'gold' ? 'text-gold/70' : metric.color === 'tech-blue' ? 'text-tech-blue/70' : 'text-tech-red/70'} font-mono`}>{metric.tech}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-card rounded-full overflow-hidden">
                              <div className={`h-full ${metric.color === 'gold' ? 'bg-gold' : metric.color === 'tech-blue' ? 'bg-tech-blue' : 'bg-tech-red'} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${metric.value}%` }}></div>
                            </div>
                            <span className={`font-bold ${metric.color === 'gold' ? 'text-gold' : metric.color === 'tech-blue' ? 'text-tech-blue' : 'text-tech-red'}`}>{metric.value}%</span>
                          </div>
                        </div>
                      </button>
                    </Reveal>
                  );
                })}
              </div>

              {/* Metric indicators only when active */}
              {hasActive && (
                <div className="flex justify-center gap-2 pt-2">
                  {metrics.map((metric, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeMetric ? `${metric.color === 'gold' ? 'bg-gold' : metric.color === 'tech-blue' ? 'bg-tech-blue' : 'bg-tech-red'} scale-125` : 'bg-foreground/30'}`}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* Right: Visualization only when a metric is active */}
          {hasActive && (
            <Reveal delayMs={200}>
              <div className="relative">
                <div className="holographic-display glass-morphism-strong p-8 rounded-2xl animate-float-gentle relative overflow-hidden card-hover">
                  {/* Futuristic corner brackets */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-tech-blue/60"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-tech-blue/60"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-tech-blue/60"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-tech-blue/60"></div>

                  {/* Holographic scan effect */}
                  <div className="absolute inset-0 animate-hologram-scan opacity-15"></div>
                  {/* Holographic grid */}
                  <div className="holographic-grid mb-6">
                    <div className="grid-lines"></div>
                    <div className="data-points">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="data-point"
                          style={{
                            left: `${(i % 5) * 20 + 10}%`,
                            top: `${Math.floor(i / 5) * 20 + 10}%`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        ></div>
                      ))}
                    </div>
                    {/* Additional floating elements */}
                    <div className="floating-elements">
                      <div className="floating-element floating-element-1"></div>
                      <div className="floating-element floating-element-2"></div>
                      <div className="floating-element floating-element-3"></div>
                    </div>
                  </div>

                  {/* Active metric display */}
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className={`p-6 ${metrics[activeMetric as number].color === 'gold' ? 'bg-gold/10' : metrics[activeMetric as number].color === 'tech-blue' ? 'bg-tech-blue/10' : 'bg-tech-red/10'} rounded-2xl`}>
                        {(() => {
                          const IconComponent = metrics[activeMetric as number].icon;
                          return <IconComponent className={`w-12 h-12 ${metrics[activeMetric as number].color === 'gold' ? 'text-gold' : metrics[activeMetric as number].color === 'tech-blue' ? 'text-tech-blue' : 'text-tech-red'}`} />;
                        })()}
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${metrics[activeMetric as number].color === 'gold' ? 'text-gold' : metrics[activeMetric as number].color === 'tech-blue' ? 'text-tech-blue' : 'text-tech-red'}`}>{metrics[activeMetric as number].label}</h3>
                      <p className={`text-4xl font-bold ${metrics[activeMetric as number].color === 'gold' ? 'text-gold' : metrics[activeMetric as number].color === 'tech-blue' ? 'text-tech-blue' : 'text-tech-red'} mt-2`}>
                        {metrics[activeMetric as number].value}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative particles removed for a calmer, premium look */}
              </div>
            </Reveal>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .holographic-display {
          position: relative;
          min-height: 400px;
          background: linear-gradient(135deg, hsl(var(--card) / 0.95) 0%, hsl(var(--gold) / 0.05) 100%);
          border: 2px solid hsl(var(--gold) / 0.3);
          box-shadow: var(--shadow-hologram);
        }

        .holographic-grid {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(90deg, hsl(var(--tech-blue) / 0.3) 1px, transparent 1px),
            linear-gradient(hsl(var(--gold) / 0.3) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: data-flow 4s linear infinite;
        }

        .data-point {
          position: absolute;
          width: 6px;
          height: 6px;
          background: hsl(var(--gold));
          border-radius: 50%;
          animation: pulse-gold 2s infinite;
          box-shadow: 0 0 10px hsl(var(--gold));
        }

        .data-point:nth-child(odd) {
          background: hsl(var(--tech-blue));
          box-shadow: 0 0 10px hsl(var(--tech-blue));
        }

        .data-point:nth-child(3n) {
          background: hsl(var(--tech-red));
          box-shadow: 0 0 10px hsl(var(--tech-red));
        }

        .floating-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .floating-element {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: float-gentle 4s ease-in-out infinite;
        }

        .floating-element-1 {
          background: hsl(var(--gold));
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }

        .floating-element-2 {
          background: hsl(var(--tech-blue));
          top: 60%;
          right: 20%;
          animation-delay: 1.5s;
        }

        .floating-element-3 {
          background: hsl(var(--tech-red));
          bottom: 30%;
          left: 70%;
          animation-delay: 3s;
        }

        .metric-card.active .glass-morphism {
          border-color: hsl(var(--gold) / 0.6);
          box-shadow: var(--shadow-gold);
        }
        `
      }} />
    </section>
  );
};

export default DataVisualization;
