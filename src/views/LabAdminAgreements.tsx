"use client";

import { FormEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Trash2, Edit2, Copy, ExternalLink } from "lucide-react";
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
};

const TYPE_LABELS: Record<AgreementType, string> = {
  website_proposal: "Website Proposal",
  digital_starter_agreement: "Digital Starter Agreement",
  digital_marketing_proposal: "Digital Marketing Proposal",
};

const AGREEMENT_TEMPLATES = {
  website_proposal: {
    id: "website_proposal",
    name: "Website Proposal",
    description: "Professional website development proposal",
    variables: [
      { key: "CLIENT_NAME", label: "Client Name" },
      { key: "CLIENT_CONTACT", label: "Client Contact" },
      { key: "DATE", label: "Date", placeholder: "e.g. 21 April 2025" },
      { key: "CLIENT_SHORT_NAME", label: "Client Short Name" },
      { key: "CLIENT_LOCATION", label: "Client Location" },
      { key: "CLIENT_INDUSTRY", label: "Client Industry" },
      { key: "YOU_PAY", label: "You Pay (£)" },
      { key: "TOTAL_VALUE", label: "Total Value (£)" },
      { key: "PAYMENT_INSTALLMENT", label: "Payment Installment (£)" },
      { key: "INCLUDED_VALUE", label: "Included Value (£)" },
    ],
  },
  digital_starter_agreement: {
    id: "digital_starter_agreement",
    name: "Digital Starter Agreement",
    description: "Agreement for digital starter services",
    variables: [
      { key: "CLIENT_NAME", label: "Client Name" },
      { key: "REF_NUMBER", label: "Reference Number", placeholder: "e.g. DSA-2025-001" },
      { key: "DATE", label: "Date", placeholder: "e.g. 21 April 2025" },
      { key: "SERVICE_PRICE", label: "Service Price (£)" },
      { key: "PRICE_IN_WORDS", label: "Price in Words", placeholder: "e.g. Five Hundred Pounds Only" },
    ],
  },
  digital_marketing_proposal: {
    id: "digital_marketing_proposal",
    name: "Digital Marketing Proposal",
    description: "Comprehensive digital marketing proposal",
    variables: [
      { key: "CLIENT_NAME", label: "Client Name" },
      { key: "DATE", label: "Date", placeholder: "e.g. 21 April 2025" },
      { key: "TARGET_LOCATION", label: "Target Location" },
      { key: "SOCIAL_MGMT_FEE", label: "Social Management Fee (£)" },
      { key: "ADS_MGMT_FEE", label: "Ads Management Fee (£)" },
      { key: "BONUS_1_VALUE", label: "Bonus 1 Value (strikethrough price) (£)" },
      { key: "BONUS_2_VALUE", label: "Bonus 2 Value (strikethrough price) (£)" },
      { key: "BONUS_3_VALUE", label: "Bonus 3 Value (strikethrough price) (£)" },
      { key: "MONTH_1_TOTAL", label: "Month 1 Total (first payment) (£)" },
      { key: "MONTHLY_RETAINER", label: "Monthly Retainer (£)" },
      { key: "ONBOARDING_FEE", label: "Onboarding Fee (£)" },
      { key: "SOCIAL_SETUP_FEE", label: "Social Setup Fee (£)" },
      { key: "MIN_AD_SPEND", label: "Minimum Ad Spend (£)" },
    ],
  },
};

type LabAdminAgreementsProps = {
  initialAgreements?: Agreement[];
};

export default function LabAdminAgreements({ initialAgreements = [] }: LabAdminAgreementsProps) {
  const [agreements, setAgreements] = useState<Agreement[]>(initialAgreements);
  const [editingAgreement, setEditingAgreement] = useState<Agreement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<AgreementType | "">("website_proposal");
  const [title, setTitle] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const template = type && AGREEMENT_TEMPLATES[type as AgreementType];

  // Hide navbar and prevent scroll when form is open
useEffect(() => {
  const mountNode = document.getElementById('floating-ui-root');
  if (!mountNode) return;
  if (showForm) {
    mountNode.style.display = 'none';
  } else {
    mountNode.style.removeProperty('display');
  }
  return () => {
    mountNode.style.removeProperty('display');
  };
}, [showForm]);

  // Initialize variables when template changes
  useEffect(() => {
    if (type && !editingAgreement) {
      const newVars: Record<string, string> = {};
      AGREEMENT_TEMPLATES[type as AgreementType].variables.forEach((v) => {
        newVars[v.key] = "";
      });
      setVariables(newVars);
    }
  }, [type, editingAgreement]);

  const loadAgreements = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/agreements", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load agreements");
      }
      const data = await response.json();
      setAgreements(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load agreements");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAgreements();
  }, []);

  const resetForm = () => {
    setTitle("");
    setType("website_proposal");
    setVariables({});
    setEditingAgreement(null);
    setShowForm(false);
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!type || !title.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);

    try {
      const url = editingAgreement
        ? `/api/admin/agreements/${editingAgreement.id}`
        : "/api/admin/agreements";

      const method = editingAgreement ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          variables,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save agreement");
      }

      await loadAgreements();
      toast.success(editingAgreement ? "Agreement updated" : "Agreement created");
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save agreement");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (agreement: Agreement) => {
    setEditingAgreement(agreement);
    setType(agreement.type);
    setTitle(agreement.title);
    setVariables(agreement.variables);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this agreement?")) {
      return;
    }

    setAgreements((prev) => prev.filter((agreement) => agreement.id !== id));
    try {
      const response = await fetch(`/api/admin/agreements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        await loadAgreements();
        throw new Error("Failed to delete agreement");
      }

      await loadAgreements();
      toast.success("Agreement deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete agreement");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getPublicUrl = (slug: string) => {
    return `/${slug}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">Agreements</h1>
            <p className="text-gray-400 mt-1 text-sm md:text-base">{agreements.length} agreement{agreements.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full md:w-auto rounded-lg bg-yellow-400 px-4 md:px-6 py-2 font-semibold text-black hover:bg-yellow-300 transition-colors text-sm md:text-base"
          >
            + Create Agreement
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-gray-900 flex flex-col max-h-[90vh]">
              {/* Modal Header & Content - Scrollable */}
              <div className="overflow-y-auto flex-1 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-white mb-6 sticky top-0 bg-gray-900 pb-4">
                  {editingAgreement ? "Edit Agreement" : "Create Agreement"}
                </h2>

                <form id="agreement-form" className="space-y-4" onSubmit={onSubmit}>
                  {/* Type Selection */}
                  {!editingAgreement && (
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                        Agreement Type *
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as AgreementType)}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm"
                        required
                      >
                        {Object.values(AGREEMENT_TEMPLATES).map((tmpl) => (
                          <option key={tmpl.id} value={tmpl.id}>
                            {tmpl.name} - {tmpl.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Title */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                      Agreement Title *
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Acme Corp - Website Proposal"
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm"
                      required
                    />
                  </div>

                  {/* Dynamic Variables */}
                  {template && (
                    <div className="border-t border-gray-700 pt-4">
                      <h3 className="text-xs md:text-sm font-semibold text-gray-200 mb-4">
                        Template Variables
                      </h3>
                      <div className="space-y-3">
                        {template.variables.map((varConfig) => (
                          <div key={varConfig.key}>
                            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
                              {varConfig.label}
                            </label>
                            <input
                              type={String(("type" in varConfig ? varConfig.type : "text") ?? "text")}
                              value={variables[varConfig.key] ?? ""}
                              onChange={(e) =>
                                handleVariableChange(varConfig.key, e.target.value)
                              }
                              placeholder={varConfig.placeholder}
                              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white text-xs md:text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Buttons - Always visible at bottom */}
              <div className="flex flex-col sm:flex-row gap-3 p-4 md:p-6 border-t border-gray-700 bg-gray-900 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="w-full sm:w-auto rounded-lg border border-gray-700 px-4 py-2 text-gray-300 hover:bg-gray-800 text-sm md:text-base font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="agreement-form"
                  disabled={isSaving || !type}
                  className="w-full sm:w-auto rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black disabled:opacity-60 hover:bg-yellow-300 text-sm md:text-base transition-colors"
                >
                  {isSaving ? "Saving..." : "Save Agreement"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : agreements.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 md:p-8 text-center">
            <p className="text-gray-400 mb-4 text-sm md:text-base">No agreements yet. Create one to get started!</p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-300 text-sm md:text-base"
            >
              Create First Agreement
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-800 -mx-4 md:mx-0">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-3 md:px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                    Title
                  </th>
                  <th className="hidden sm:table-cell px-3 md:px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                    Type
                  </th>
                  <th className="hidden lg:table-cell px-3 md:px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                    Slug
                  </th>
                  <th className="hidden md:table-cell px-3 md:px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                    Created
                  </th>
                  <th className="px-3 md:px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-gray-950">
                {agreements.map((agreement) => (
                  <tr key={agreement.id} className="hover:bg-gray-900/50 transition-colors">
                    <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-white font-medium">
                      <div className="max-w-xs truncate">{agreement.title}</div>
                      <div className="sm:hidden text-xs text-gray-400 mt-1">
                        <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                          {TYPE_LABELS[agreement.type]}
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 md:px-4 py-3 text-xs md:text-sm">
                      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        {TYPE_LABELS[agreement.type]}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-3 md:px-4 py-3 text-xs md:text-sm text-gray-300">
                      <div className="flex items-center gap-1 md:gap-2">
                        <code className="rounded bg-gray-800 px-2 py-1 text-xs font-mono truncate">
                          {agreement.slug}
                        </code>
                        <button
                          onClick={() => copyToClipboard(getPublicUrl(agreement.slug))}
                          className="text-yellow-400 hover:text-yellow-300 flex-shrink-0"
                          title="Copy public link"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 md:px-4 py-3 text-xs md:text-sm text-gray-300">
                      {format(new Date(agreement.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-3 md:px-4 py-3 text-xs md:text-sm">
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        <a
                          href={getPublicUrl(agreement.slug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-blue-700 px-2 md:px-3 py-1 text-blue-400 hover:bg-gray-800 text-xs md:text-sm whitespace-nowrap"
                          title="View agreement"
                        >
                          <ExternalLink size={12} className="md:w-4 md:h-4" />
                          <span className="hidden sm:inline">View</span>
                        </a>
                        <button
                          onClick={() => handleEdit(agreement)}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-700 px-2 md:px-3 py-1 text-gray-200 hover:bg-gray-800 text-xs md:text-sm whitespace-nowrap"
                          title="Edit agreement"
                        >
                          <Edit2 size={12} className="md:w-4 md:h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(agreement.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-700 px-2 md:px-3 py-1 text-red-400 hover:bg-gray-800 text-xs md:text-sm whitespace-nowrap"
                          title="Delete agreement"
                        >
                          <Trash2 size={12} className="md:w-4 md:h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
