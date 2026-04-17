import TopLogo from "@/components/ui/top-logo";
import SiteFooter from "@/components/ui/site-footer";
import Reveal from "@/components/ui/reveal";
import { usePageSeo } from "@/hooks/usePageSeo";

const PrivacyPolicy = () => {
  usePageSeo({
    title: "Privacy Policy | Triovate Labs",
    description:
      "Learn how Triovate Labs collects, uses, and protects your personal information.",
    path: "/privacy-policy",
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopLogo />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 md:pt-40 pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gold/8 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-600">
                Last Updated: January 2026
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto prose prose-lg">

            <Reveal delayMs={60}>
              <div className="space-y-8">

                {/* Introduction */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Triovate Labs ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or engage with us for web development, digital marketing, or IT consulting services.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    By using our services or submitting information through our website, you consent to the data practices described in this policy.
                  </p>
                </div>

                {/* Information We Collect */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Information You Provide</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We collect information you voluntarily provide when you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Fill out contact forms or project inquiry forms</li>
                    <li>Request quotes or consultations</li>
                    <li>Subscribe to our newsletter or communications</li>
                    <li>Engage with us for services</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    This may include: full name, email address, phone number, company name, project details, budget information, timeline preferences, and any other information you choose to provide.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Automatically Collected Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    When you visit our website, we may automatically collect:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Device information (browser type, operating system, device type)</li>
                    <li>Usage data (pages viewed, time spent, navigation patterns)</li>
                    <li>IP address and approximate geographic location</li>
                    <li>Referral source and exit pages</li>
                  </ul>
                </div>

                {/* How We Use Your Information */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We use the collected information for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>To respond to your inquiries and provide requested services</li>
                    <li>To communicate with you about projects, proposals, and service delivery</li>
                    <li>To improve our website, services, and user experience</li>
                    <li>To send you relevant marketing communications (with your consent)</li>
                    <li>To analyze website traffic and user behavior</li>
                    <li>To comply with legal obligations and protect our rights</li>
                    <li>To detect, prevent, and address technical issues or fraudulent activity</li>
                  </ul>
                </div>

                {/* Data Sharing and Disclosure */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><strong>Service Providers:</strong> We may share information with trusted third-party vendors who assist us in operating our website, conducting business, or providing services (e.g., hosting providers, analytics services, email platforms). These parties are contractually obligated to keep your information confidential.</li>
                    <li><strong>Legal Requirements:</strong> We may disclose your information if required by law, court order, or governmental regulation, or to protect our rights, property, or safety.</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</li>
                  </ul>
                </div>

                {/* Cookies and Tracking Technologies */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We use cookies and similar tracking technologies to enhance your browsing experience and analyze website performance. Cookies are small data files stored on your device.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Types of cookies we use:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><strong>Essential Cookies:</strong> Necessary for website functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                    <li><strong>Marketing Cookies:</strong> Track your activity to deliver relevant advertising</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    You can control cookie settings through your browser preferences. Note that disabling cookies may affect website functionality.
                  </p>
                </div>

                {/* Data Security */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include encryption, secure servers, access controls, and regular security assessments.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                  </p>
                </div>

                {/* Data Retention */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. When information is no longer needed, we securely delete or anonymize it.
                  </p>
                </div>

                {/* Your Rights */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Depending on your location, you may have the following rights regarding your personal data:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Restriction:</strong> Request restriction of processing your personal information</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                    <li><strong>Objection:</strong> Object to processing of your personal information for certain purposes</li>
                    <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where consent was previously given</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    To exercise these rights, please contact us at <a href="mailto:info@triovatelabs.com" className="text-gold hover:underline">info@triovatelabs.com</a>.
                  </p>
                </div>

                {/* Third-Party Links */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                  </p>
                </div>

                {/* Children's Privacy */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately, and we will take steps to delete such information.
                  </p>
                </div>

                {/* International Data Transfers */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">11. International Data Transfers</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Your information may be transferred to and processed in countries outside of your country of residence. These countries may have different data protection laws. By using our services, you consent to the transfer of your information to these locations. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                  </p>
                </div>

                {/* Changes to This Policy */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements. We will notify you of any material changes by posting the updated policy on our website with a new "Last Updated" date. We encourage you to review this policy periodically.
                  </p>
                </div>

                {/* Contact Us */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <p className="text-gray-900 font-semibold mb-2">Triovate Labs</p>
                    <p className="text-gray-700">Email: <a href="mailto:info@triovatelabs.com" className="text-gold hover:underline">info@triovatelabs.com</a></p>
                    <p className="text-gray-700">Phone: <a href="tel:+9779707098190" className="text-gold hover:underline">+977-9707098190</a></p>
                    <p className="text-gray-700">Location: Kathmandu, Nepal</p>
                  </div>
                </div>

                {/* Consent */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                  <p className="text-gray-700 leading-relaxed">
                    By using our website and services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
                  </p>
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

export default PrivacyPolicy;
