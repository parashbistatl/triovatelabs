import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import TopLogo from "@/components/ui/top-logo";
import SiteFooter from "@/components/ui/site-footer";
import Reveal from "@/components/ui/reveal";
import { Home, Mail, ArrowLeft } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";

const NotFound = () => {
  const location = useLocation();

  usePageSeo({
    title: "Page Not Found | Triovate Labs",
    description: "The page you're looking for doesn't exist or has been moved.",
    path: location.pathname,
    robots: "noindex, follow",
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopLogo />

      {/* 404 Section */}
      <section className="flex-1 flex items-center justify-center relative overflow-hidden pt-24 sm:pt-32 pb-12">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gold/10 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">

            {/* 404 Number */}
            <Reveal>
              <div className="relative inline-block">
                <h1 className="text-[120px] sm:text-[160px] md:text-[200px] lg:text-[240px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-gold via-yellow-400 to-gold leading-none select-none"
                    style={{
                      WebkitTextStroke: '2px rgba(212, 175, 55, 0.3)',
                      textShadow: '0 0 80px rgba(212, 175, 55, 0.3)'
                    }}>
                  404
                </h1>
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent blur-3xl animate-pulse"></div>
              </div>
            </Reveal>

            {/* Error Message */}
            <Reveal delayMs={60}>
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  Page Not Found
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  The page you're looking for doesn't exist or has been moved.
                  Let's get you back on track.
                </p>
              </div>
            </Reveal>

            {/* Action Buttons */}
            <Reveal delayMs={120}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link to="/">
                  <button className="group relative px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center gap-3 overflow-hidden hover:scale-105 min-w-[200px]"
                    style={{
                      background: 'linear-gradient(135deg, #E2B93B 0%, #CCA430 100%)',
                      color: '#0A1628',
                      boxShadow: '0 4px 20px rgba(226,185,59,0.4), 0 8px 40px rgba(226,185,59,0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,175,55,0.5), 0 12px 50px rgba(212,175,55,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,175,55,0.4), 0 8px 40px rgba(212,175,55,0.2)';
                    }}>
                    <Home className="w-5 h-5" />
                    <span>Back to Home</span>
                  </button>
                </Link>

                <Link to="/contact">
                  <button className="px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center gap-3 border-2 border-gray-300 hover:border-gold hover:bg-gold/5 min-w-[200px]">
                    <Mail className="w-5 h-5" />
                    <span>Contact Us</span>
                  </button>
                </Link>
              </div>
            </Reveal>

            {/* Quick Links */}
            <Reveal delayMs={180}>
              <div className="pt-12 border-t border-gray-200 max-w-xl mx-auto">
                <p className="text-sm text-gray-500 mb-4">Quick Links</p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <Link to="/about" className="text-gray-700 hover:text-gold transition-colors flex items-center gap-2 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>About Us</span>
                  </Link>
                  <Link to="/services" className="text-gray-700 hover:text-gold transition-colors flex items-center gap-2 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Services</span>
                  </Link>
                  <Link to="/contact" className="text-gray-700 hover:text-gold transition-colors flex items-center gap-2 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Contact</span>
                  </Link>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
};

export default NotFound;
