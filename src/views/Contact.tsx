"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import SiteFooter from "@/components/ui/site-footer";
import Reveal from "@/components/ui/reveal";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { usePageSeo } from "@/hooks/usePageSeo";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "info@triovatelabs.com",
      description: "Reach us anytime",
      color: "tech-blue",
      tech: "EMAIL",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+977-9707098190",
      description: "Available Mon–Fri",
      color: "gold",
      tech: "PHONE",
    },
    {
      icon: MapPin,
      title: "Based in Kathmandu",
      value: "Kathmandu, Nepal",
      description: "Remote-first, global collaboration",
      color: "tech-red",
      tech: "LOCATION",
    },
  ];

  // Form schema (Zod)
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{7,15}$/;
  const schema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(1, "Phone number is required").regex(phoneRegex, "Enter a valid phone number"),
    company: z.string().min(1, "Company name is required"),
    projectType: z.string().min(1, "Select a project type"),
    budget: z.string().min(1, "Select a budget range"),
    timeline: z.string().min(1, "Select a timeline"),
    message: z.string().min(10, "Please provide at least 10 characters"),
    website: z.string().optional(), // honeypot
  });

  type FormValues = z.infer<typeof schema>;

  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      projectType: "",
      budget: "",
      timeline: "",
      message: "",
      website: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const pathname = usePathname() ?? "/contact";
  const formRef = useRef<HTMLFormElement>(null);

  usePageSeo({
    title: "Contact Triovate Labs | Start Your Project",
    description:
      "Contact Triovate Labs to discuss your website, marketing, or custom software project and get a clear path forward.",
    path: "/contact",
    ogImagePath: "/triovate1.png",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#start") {
      setTimeout(() => setFocus("fullName"), 50);
    }
  }, [pathname, setFocus]);

  const onSubmit = async (data: FormValues) => {
    // Honeypot check
    if (data.website) return;

    setIsSubmitting(true);

    try {
      const { website: _honeypot, ...formData } = data;

      const response = await fetch("https://formspree.io/f/mzdagogj", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Submission failed");

      // fire analytics attribute
      if (formRef.current) {
        formRef.current.setAttribute("data-analytics", "lead-submitted");
      }

      toast({
        title: "Thanks!",
        description: "Your message has been received. We'll get back to you soon.",
      });

      reset();
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly at info@triovatelabs.com.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* Hero — compact two-column split */}
      <section
        id="contact-hero"
        className="relative overflow-hidden scroll-mt-[88px] pt-16 pb-10 sm:pt-20 sm:pb-12 lg:pt-0 lg:pb-0"
        style={{ backgroundColor: '#E2B93B' }}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[42%_58%] lg:min-h-[280px]">

          {/* Left panel — off-white logo panel (desktop only) */}
          <div
            className="contact-hero-white relative z-10 hidden lg:flex items-center px-6 sm:px-10 lg:px-14 py-5 lg:py-0"
            style={{ backgroundColor: "var(--hero-logo-bg)" }}
          >
            <Link href="/" aria-label="Triovate Labs — Home">
              <img
                src="/triovate1.png"
                alt="Triovate Labs"
                className="h-40 xl:h-44 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right panel — gold, headline + subtext */}
          <div className="flex items-center px-4 sm:px-10 lg:pl-16 lg:pr-14 py-8 lg:py-0">
            <div className="space-y-3 max-w-xl">
              <Reveal delayMs={0} as="h1" className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A1628]">
                Get In Touch
              </Reveal>

              <Reveal delayMs={60}>
                <p className="text-base sm:text-lg md:text-xl text-[#0A1628]/70 leading-relaxed max-w-lg">
                  Tell us about your project and we&apos;ll show you how we can help.
                </p>
              </Reveal>
            </div>
          </div>

        </div>

        {/* Diagonal cut — desktop only */}
        <style>{`
          @media (min-width: 1024px) {
            .contact-hero-white {
              clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
              padding-right: 4rem;
              filter: drop-shadow(3px 0 6px rgba(0,0,0,0.06));
            }
          }
        `}</style>
      </section>

      {/* Contact Form & Info - Simplified */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div id="start" className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="space-y-8">
              <Reveal>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Start Your Project</h2>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you.</p>
                </div>
              </Reveal>

              <form
                ref={formRef}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 rounded-xl bg-white p-6 sm:p-8 shadow-md border border-gray-200"
              >
                {/* Honeypot */}
                <input type="text" aria-hidden="true" tabIndex={-1} className="hidden" {...register("website")} />

                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    {...register("fullName")}
                    className="border-gray-300 focus:border-[#E2B93B] focus:ring-[#E2B93B] placeholder:text-gray-400"
                  />
                  {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      {...register("email")}
                      className="border-gray-300 focus:border-[#E2B93B] focus:ring-[#E2B93B] placeholder:text-gray-400"
                    />
                    {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+977 1234567890"
                      {...register("phone")}
                      className="border-gray-300 focus:border-[#E2B93B] focus:ring-[#E2B93B] placeholder:text-gray-400"
                    />
                    {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="company"
                    placeholder="Your Company"
                    {...register("company")}
                    className="border-gray-300 focus:border-[#E2B93B] focus:ring-[#E2B93B] placeholder:text-gray-400"
                  />
                  {errors.company && <p className="text-xs text-red-600">{errors.company.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="projectType" className="text-sm font-medium">
                    Project Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="projectType"
                    {...register("projectType")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:border-[#E2B93B] focus:ring-1 focus:ring-[#E2B93B] focus:outline-none text-gray-900 placeholder:text-gray-400"
                  >
                    <option value="">Select...</option>
                    <option value="website-development">Website Development</option>
                    <option value="mobile-app-development">Mobile Application Development</option>
                    <option value="mobile-app-development">Custom Software Development</option>
                    <option value="social-media">Social Media Management</option>
                    <option value="paid-ads">Paid Ads Management</option>
                    <option value="it-consultation">IT Consultation</option>
                    <option value="maintenance-support">Maintenance & Support</option>
                  </select>
                  {errors.projectType && <p className="text-xs text-red-600">{errors.projectType.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="budget" className="text-sm font-medium">
                      Budget <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="budget"
                      {...register("budget")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:border-[#E2B93B] focus:ring-1 focus:ring-[#E2B93B] focus:outline-none text-gray-900 placeholder:text-gray-400"
                    >
                      <option value="">Select...</option>
                      <option value="50k-1l">Rs. 50K - 1L</option>
                      <option value="1l-3l">1L - 3L</option>
                      <option value="3l-plus">3L+</option>
                    </select>
                    {errors.budget && <p className="text-xs text-red-600">{errors.budget.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="timeline" className="text-sm font-medium">
                      Timeline <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="timeline"
                      {...register("timeline")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:border-[#E2B93B] focus:ring-1 focus:ring-[#E2B93B] focus:outline-none text-gray-900 placeholder:text-gray-400"
                    >
                      <option value="">Select...</option>
                      <option value="2-4-weeks">2-4 weeks</option>
                      <option value="4-6-weeks">4-6 weeks</option>
                      <option value="8-12-weeks">8-12 weeks</option>
                      <option value="12-weeks-plus">12 weeks+</option>
                    </select>
                    {errors.timeline && <p className="text-xs text-red-600">{errors.timeline.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Project Details <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Tell us about your project requirements..."
                    className="border-gold/20 focus:border-gold min-h-[120px] placeholder:text-tech-blue/60"
                  />
                  {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #E2B93B 0%, #CCA430 100%)',
                    color: '#0A1628',
                    boxShadow: '0 4px 20px rgba(226,185,59,0.4)'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 30px rgba(226,185,59,0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(226,185,59,0.4)';
                  }}
                >
                  {isSubmitting ? "Sending..." : "Let's Build Your Solution"}
                </button>
              </form>
            </div>

            {/* Contact Information - Simplified */}
            <div className="space-y-6">
              <Reveal>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Information</h2>
                  <p className="text-gray-600">Reach out to us directly through any of these channels.</p>
                </div>
              </Reveal>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="rounded-xl bg-white border-l-4 border-l-gray-900 border-y border-r border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-l-gray-700 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-gray-700" />
                      </div>

                      <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{info.title}</div>
                        <div className="font-bold text-gray-900 mb-1">
                          {info.title === "Email" ? (
                            <a href={`mailto:${info.value}`} className="text-gray-900 hover:text-gray-700 underline decoration-2 underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">
                              {info.value}
                            </a>
                          ) : info.title === "Phone" ? (
                            <a href={`tel:${info.value}`} className="text-gray-900 hover:text-gray-700 underline decoration-2 underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">
                              {info.value}
                            </a>
                          ) : (
                            <span className="text-gray-900">{info.value}</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{info.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
};

export default Contact;
