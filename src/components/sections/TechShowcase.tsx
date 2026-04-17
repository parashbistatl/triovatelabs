import HologramCard from "@/components/3d/HologramCard";
import ConcentricRings from "@/components/3d/ConcentricRings";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import TechBackdrop from "@/components/ui/tech-backdrop";
import Reveal from "@/components/ui/reveal";
// Performance: Tree-shakeable imports - Vite will only bundle used icons
import {
  Brain,
  Cloud,
  Shield,
  Zap,
  Database,
  Cpu,
  Network,
  Bot,
  Layers,
  GitBranch,
  Terminal,
  Binary,
  CircuitBoard,
  Activity
} from "lucide-react";

import { useEffect, useState } from "react";
function LazyRings() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.querySelector('[data-techsphere-container]');
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!visible) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return <ConcentricRings className="mx-auto" size={320} />;
}

const TechShowcase = () => {
  const technologies = [
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "Advanced neural networks and deep learning algorithms powering intelligent solutions.",
      color: "tech-blue",
      tech: "ML/AI"
    },
    {
      icon: Cloud,
      title: "Cloud Architecture",
      description: "Scalable infrastructure with microservices, containers, and serverless computing.",
      color: "gold",
      tech: "CLOUD"
    },
    {
      icon: Shield,
      title: "Quantum Security",
      description: "Next-generation encryption and zero-trust security frameworks.",
      color: "tech-red",
      tech: "QUANTUM"
    },
    {
      icon: Database,
      title: "Big Data Analytics",
      description: "Real-time processing of massive datasets with distributed computing.",
      color: "tech-blue",
      tech: "BIGDATA"
    },
    {
      icon: Network,
      title: "IoT Integration",
      description: "Connected ecosystems with edge computing and 5G optimization.",
      color: "gold",
      tech: "IOT"
    },
    {
      icon: Bot,
      title: "Intelligent Automation",
      description: "RPA with cognitive capabilities and self-learning algorithms.",
      color: "tech-red",
      tech: "RPA"
    },
  ];

  const processes = [
    {
      icon: GitBranch,
      title: "DevSecOps Pipeline",
      description: "Continuous integration with security-first development practices.",
      color: "tech-blue",
      tech: "CI/CD"
    },
    {
      icon: Layers,
      title: "Microservices Architecture",
      description: "Distributed systems with container orchestration and service mesh.",
      color: "gold",
      tech: "K8S"
    },
    {
      icon: Cpu,
      title: "Edge Computing",
      description: "Low-latency processing at the network edge with real-time analytics.",
      color: "tech-red",
      tech: "EDGE"
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Advanced caching, load balancing, and auto-scaling solutions.",
      color: "tech-blue",
      tech: "PERF"
    },
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Light-Friendly WebGL Shader */}
      <div className="absolute inset-0 opacity-8 pointer-events-none mix-blend-overlay">
        <WebGLShader />
      </div>
      <TechBackdrop />

      {/* Tech Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-tech-blue rounded-full opacity-50"></div>
        <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-tech-red rounded-full opacity-50"></div>
        <div className="absolute bottom-32 left-1/4 w-2.5 h-2.5 bg-gold rounded-full opacity-50"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-tech-blue rounded-full opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-tech-red rounded-full opacity-50"></div>

        {/* Circuit patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 border border-tech-blue/30 rounded-full animate-rotate-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 border border-tech-red/30 rounded-full animate-rotate-slow animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-gold/30 rounded-full animate-rotate-slow animation-delay-4000"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center space-y-6 mb-20 relative">
            <div className="flex items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-6 py-3">
                <Cpu className="w-5 h-5 text-gold" />
                <span className="text-gold font-medium">Technology Stack</span>
              </div>
              <div className="flex items-center gap-1">
                <Terminal className="w-4 h-4 text-tech-blue animate-pulse" />
                <Binary className="w-4 h-4 text-gold animate-pulse animation-delay-500" />
                <CircuitBoard className="w-4 h-4 text-tech-red animate-pulse animation-delay-1000" />
              </div>
            </div>

            <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
              Our <span className="text-gold relative">
                Technology Stack
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-tech-blue to-tech-red rounded-full opacity-60"></div>
              </span>
            </h2>

            <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Leveraging cutting-edge technologies to build the future of enterprise computing.
              Our expertise spans AI, quantum computing, distributed systems, and beyond.
            </p>

            {/* Tech indicators */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-tech-blue" />
                <span className="text-sm text-tech-blue font-medium">Real-time Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" />
                <span className="text-sm text-gold font-medium">Quantum Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-tech-red" />
                <span className="text-sm text-tech-red font-medium">AI Powered</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Central 3D Element */}
        <Reveal delayMs={120}>
          <div className="flex justify-center mb-20">
            <div className="w-72 h-72" data-techsphere-container>
              <LazyRings />
            </div>
          </div>
        </Reveal>

        {/* Technology Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {technologies.map((tech, index) => (
            <Reveal key={tech.title} delayMs={index * 80}>
              <div className="p-6 rounded-xl border border-gold/15 bg-card shadow-card hover:shadow-gold transition-all duration-300 hover:scale-105 group card-hover">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${tech.color === 'gold' ? 'bg-gold/10 group-hover:bg-gold/20' : tech.color === 'tech-blue' ? 'bg-tech-blue/10 group-hover:bg-tech-blue/20' : 'bg-tech-red/10 group-hover:bg-tech-red/20'} transition-all duration-300`}>
                    <tech.icon className={`w-6 h-6 ${tech.color === 'gold' ? 'text-gold' : tech.color === 'tech-blue' ? 'text-tech-blue' : 'text-tech-red'}`} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-semibold">{tech.title}</h4>
                    <span className={`text-xs ${tech.color === 'gold' ? 'text-gold/70' : tech.color === 'tech-blue' ? 'text-tech-blue/70' : 'text-tech-red/70'} font-mono`}>{tech.tech}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">{tech.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Process Section */}
        <Reveal>
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">
              Our <span className="text-gold relative">
                Development Process
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-tech-blue to-tech-red rounded-full opacity-60"></div>
              </span>
            </h3>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Industry-leading methodologies that ensure scalability, security, and performance.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processes.map((process, index) => (
            <Reveal key={process.title} delayMs={index * 80}>
              <div className="relative group">
                <div className="p-6 rounded-xl h-full text-center border border-gold/15 bg-card shadow-card hover:shadow-gold transition-all duration-300 hover:scale-105 card-hover">
                  <div className={`inline-flex p-4 rounded-lg mb-4 border ${process.color === 'gold' ? 'border-gold/20 bg-gold/10' : process.color === 'tech-blue' ? 'border-tech-blue/20 bg-tech-blue/10' : 'border-tech-red/20 bg-tech-red/10'} group-hover:scale-110 transition-transform duration-300`}>
                    <process.icon className={`w-6 h-6 ${process.color === 'gold' ? 'text-gold' : process.color === 'tech-blue' ? 'text-tech-blue' : 'text-tech-red'}`} />
                  </div>
                  <div className="flex flex-col items-center">
                    <h4 className={`font-semibold mb-1 ${process.color === 'gold' ? 'text-gold' : process.color === 'tech-blue' ? 'text-tech-blue' : 'text-tech-red'}`}>{process.title}</h4>
                    <span className={`text-xs ${process.color === 'gold' ? 'text-gold/70' : process.color === 'tech-blue' ? 'text-tech-blue/70' : 'text-tech-red/70'} font-mono mb-2`}>{process.tech}</span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed">{process.description}</p>
                </div>

                {/* Connection lines for larger screens */}
                {index < processes.length - 1 && (
                  <div className={`hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r ${process.color === 'gold' ? 'from-gold' : process.color === 'tech-blue' ? 'from-tech-blue' : 'from-tech-red'} to-transparent opacity-50`}></div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechShowcase;