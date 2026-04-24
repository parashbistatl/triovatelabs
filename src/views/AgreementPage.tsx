"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import type { Agreement } from "@/lib/types/agreement";

type AgreementWithHtml = Agreement & {
  html?: string;
};

type AgreementPageProps = {
  agreement: AgreementWithHtml | null;
  error?: string | null;
};

export default function AgreementPage({ agreement, error = null }: AgreementPageProps) {
  const downloadAsPDF = () => {
    if (!agreement || !agreement.html) {
      toast.error("Cannot download: agreement HTML not available");
      return;
    }

    try {
      let cleanedUp = false;
      let printTriggered = false;
      let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

      const cleanupIframe = (iframe: HTMLIFrameElement) => {
        if (cleanedUp) return;
        cleanedUp = true;
        if (fallbackTimer) {
          clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };

      const triggerPrint = (iframe: HTMLIFrameElement) => {
        if (printTriggered) return;
        printTriggered = true;
        iframe.contentWindow?.print();
      };

      // Generate meaningful filename
      const clientName = agreement.variables?.CLIENT_NAME || "Client";
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const cleanClientName = clientName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
      
      let agreementType = "Agreement";
      if (agreement.type === "website_proposal") agreementType = "Website-Proposal";
      else if (agreement.type === "digital_starter_agreement") agreementType = "Digital-Starter";
      else if (agreement.type === "digital_marketing_proposal") agreementType = "Digital-Marketing";
      
      const suggestedFilename = `Triovate-Labs_${agreementType}_${cleanClientName}_${dateStr}.pdf`;

      // Show the suggested filename to user
      toast.info(`Saving as: ${suggestedFilename}`, { duration: 4000 });

      // Create a temporary iframe to print
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        throw new Error("Could not access iframe document");
      }

      doc.write(agreement.html);
      doc.close();

      // Wait for content to load, then print
      iframe.onload = () => {
        setTimeout(() => {
          triggerPrint(iframe);
          // Clean up after a short delay
          setTimeout(() => {
            cleanupIframe(iframe);
          }, 100);
        }, 100);
      };

      // Fallback if onload doesn't trigger
      fallbackTimer = setTimeout(() => {
        if (!cleanedUp && document.body.contains(iframe)) {
          triggerPrint(iframe);
          cleanupIframe(iframe);
        }
      }, 1000);

      // Show another toast after print dialog opens
      setTimeout(() => {
        toast.success("Print dialog opened - select 'Save as PDF'");
      }, 500);
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  if (error || !agreement) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-4">
        <div className="rounded-lg border border-red-300 bg-red-50 p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-700">{error || "Agreement not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-[100] border-b border-gray-200 bg-white/95 backdrop-blur print:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Agreement
            </p>
            <h1 className="text-sm font-semibold text-gray-900 sm:text-base">
              {agreement.title}
            </h1>
          </div>

          <button
            onClick={downloadAsPDF}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-bold text-black shadow-lg transition-colors hover:bg-yellow-300"
            title="Download as PDF"
            type="button"
          >
            <Download size={18} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Full Page Content */}
      <main className="w-full">
        {agreement.html ? (
          // Display rendered HTML full page
          <div 
            className="rendered-agreement"
            dangerouslySetInnerHTML={{ __html: agreement.html }}
          />
        ) : (
          // Fallback: display variables
          <div className="min-h-screen bg-white p-8 flex items-center justify-center">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Agreement: {agreement.title}</h2>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {Object.entries(agreement.variables).map(([key, value]) => (
                  <div key={key} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                      {key.replace(/_/g, " ")}
                    </label>
                    <p className="text-gray-900">
                      {value || <span className="text-gray-400 italic">(empty)</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
