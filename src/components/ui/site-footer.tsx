// Performance: Tree-shakeable imports - Vite will only bundle used icons
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const SiteFooter = () => {
    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden pb-[88px]" aria-label="Site footer">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gold rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/50 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 py-16 relative z-10">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Company Info */}
                    <div className="md:col-span-1">
                        <div className="mb-6">
                            {/* Performance: Footer logo can be lazy loaded */}
                            <img
                                src="/triovate.png"
                                alt="Triovate Labs"
                                className="h-20 md:h-24 w-auto object-contain mb-3"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <p className="text-base text-gray-300 leading-relaxed mb-6">
                            We build high-performing websites, run results-focused marketing and provide custom IT solutions so you win more customers and run your business more efficiently.
                        </p>
                        {/* Social links */}
                        <div className="flex gap-3">
                            <a
                                href="https://www.facebook.com/triovatelabs"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Triovate Labs on Facebook"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a
                                href="https://www.instagram.com/triovatelabs"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Triovate Labs on Instagram"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                            >
                                {/* Instagram icon */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fill="currentColor"
                                        d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm10.5 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"
                                    />
                                </svg>
                            </a>
                            <a
                                href="https://www.linkedin.com/company/triovatelabs"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Triovate Labs on LinkedIn"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Quick Links
                            <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gold"></div>
                        </h4>
                        <ul className="space-y-3">
                            <li><a href="/about" className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2 group">
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span>About Us</span>
                            </a></li>
                            <li><a href="/services" className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2 group">
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span>Services</span>
                            </a></li>
                            <li><a href="/contact" className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2 group">
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span>Contact</span>
                            </a></li>
                        </ul>
                    </div>

                    {/* Services - Links to specific service sections */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Services
                            <div className="absolute bottom-0 left-0 w-12 h-0.5" style={{ backgroundColor: '#E2B93B' }}></div>
                        </h4>
                        <ul className="space-y-3">
                            <li><a href="/services#website-development" className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2 group">
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span>Website Development</span>
                            </a></li>
                            <li><a href="/services#digital-marketing" className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2 group">
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span>Digital Marketing</span>
                            </a></li>
                            <li><a href="/services#custom-software" className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2 group">
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span>Custom Software</span>
                            </a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Contact
                            <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gold"></div>
                        </h4>
                        <div className="space-y-4">
                            <a href="mailto:info@triovatelabs.com" className="flex items-start gap-3 text-gray-300 hover:text-gold transition-colors group">
                                <Mail className="w-5 h-5 mt-0.5 text-gold" />
                                <span className="group-hover:translate-x-1 transition-transform">info@triovatelabs.com</span>
                            </a>
                            <a href="tel:+9779707098190" className="flex items-start gap-3 text-gray-300 hover:text-gold transition-colors group">
                                <Phone className="w-5 h-5 mt-0.5 text-gold" />
                                <span className="group-hover:translate-x-1 transition-transform">+977-9707098190</span>
                            </a>
                            <div className="flex items-start gap-3 text-gray-300">
                                <MapPin className="w-5 h-5 mt-0.5 text-gold" />
                                <span>Kathmandu, Nepal</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <div className="text-sm text-gold-400">
                            © {new Date().getFullYear()} Triovate Labs Pvt Ltd. All rights reserved.
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;


