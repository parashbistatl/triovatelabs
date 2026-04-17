import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "@/components/ui/scroll-to-top";
import Navigation from "@/components/ui/navigation";
// Lazy load all routes including Index for better code splitting - improves initial load time
const Index = lazy(() => import("@/pages/Index"));
const NewIndex = lazy(() => import("@/pages/NewIndex"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Contact = lazy(() => import("@/pages/Contact"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const Blogs = lazy(() => import("@/pages/Blogs"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Resources = lazy(() => import("@/pages/Resources"));
const ResourceDetail = lazy(() => import("@/pages/ResourceDetail"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const LabAdminLogin = lazy(() => import("@/pages/LabAdminLogin"));
const LabAdminDashboard = lazy(() => import("@/pages/LabAdminDashboard"));
const LabAdminBlogs = lazy(() => import("@/pages/LabAdminBlogs"));
const LabAdminResources = lazy(() => import("@/pages/LabAdminResources"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100001] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-gold focus:text-[#0A1628] focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/* Background layer - no transforms */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-quantum" />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(#ffffff12 1px, transparent 1.5px)", backgroundSize: "22px 22px" }} />
          <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,.12), inset 0 0 400px rgba(0,0,0,.06)" }} />
        </div>

        {/* Content wrapper - no positioning context interference */}
        <main id="main-content" className="relative min-h-screen overflow-x-hidden text-tl-ink">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/new" element={<NewIndex />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:slug" element={<BlogPost />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:slug" element={<ResourceDetail />} />
              <Route path="/labadmin" element={<Navigate to="/labadmin/login" replace />} />
              <Route path="/labadmin/login" element={<LabAdminLogin />} />
              <Route path="/labadmin/dashboard" element={<LabAdminDashboard />} />
              <Route path="/labadmin/blogs" element={<LabAdminBlogs />} />
              <Route path="/labadmin/resources" element={<LabAdminResources />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {/* Fixed elements at root level */}
        <Navigation />
        <ScrollToTop />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
