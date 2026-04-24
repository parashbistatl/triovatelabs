"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

type AgreementType = 
  | "website_proposal"
  | "digital_starter_agreement"
  | "digital_marketing_proposal";

type Agreement = {
  id: number;
  slug: string;
  type: AgreementType;
  title: string;
  variables: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  html?: string;
};

type AgreementPageProps = {
  slug: string;
};

export default function AgreementPage({ slug }: AgreementPageProps) {
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgreement = async () => {
      if (!slug) {
        setError("Invalid agreement slug");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/public/agreements/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Agreement not found");
          } else {
            setError("Failed to load agreement");
          }
          return;
        }

        const data = await response.json();
        setAgreement(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load agreement");
      } finally {
        setIsLoading(false);
      }
    };

    void loadAgreement();
  }, [slug]);

  const downloadAsPDF = () => {
    if (!agreement || !agreement.html) {
      toast.error("Cannot download: agreement HTML not available");
      return;
    }

    try {
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
          iframe.contentWindow?.print();
          // Clean up after a short delay
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 100);
        }, 100);
      };

      // Fallback if onload doesn't trigger
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          iframe.contentWindow?.print();
          document.body.removeChild(iframe);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
      {/* Floating PDF Download Button */}
      <button
        onClick={downloadAsPDF}
        className="fixed top-4 right-4 z-50 inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-black font-bold hover:bg-yellow-300 transition-colors shadow-lg"
        title="Download as PDF"
      >
        <Download size={20} />
        <span>PDF</span>
      </button>

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
