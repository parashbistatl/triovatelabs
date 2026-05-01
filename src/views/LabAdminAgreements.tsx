"use client";

import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { format } from "date-fns";
import {
  CalendarClock,
  Copy,
  Download,
  Eye,
  ExternalLink,
  FilePenLine,
  Lock,
  PencilLine,
  Plus,
  RefreshCcw,
  Settings2,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AGREEMENT_TEMPLATES,
  type Agreement,
  type AgreementType,
} from "@/lib/types/agreement";

const TYPE_LABELS: Record<AgreementType, string> = {
  website_proposal: "Website Proposal",
  digital_starter_agreement: "Digital Starter Agreement",
  digital_marketing_proposal: "Digital Marketing Proposal",
};

type LabAdminAgreementsProps = {
  initialAgreements?: Agreement[];
};

type EditorState = {
  id?: number;
  type: AgreementType;
  title: string;
  currencyCode: string;
  password: string;
  expiresAt: string;
  variables: Record<string, string>;
  styleMarkup: string;
  bodyMarkup: string;
};

type CreateDraftState = {
  type: AgreementType;
  title: string;
  currencyCode: string;
  password: string;
  expiresAt: string;
  variables: Record<string, string>;
};

const DOCUMENT_BASE_WIDTH = 920;
const DOCUMENT_FALLBACK_HEIGHT = 120;
const EMBEDDED_DOCUMENT_STYLE_OVERRIDES = `
  body {
    background: transparent !important;
  }

  .page {
    min-height: unset !important;
    height: auto !important;
    margin: 0 auto !important;
    box-shadow: none !important;
  }
`;

function extractDocumentParts(html: string) {
  if (typeof window === "undefined") {
    return { styles: "", body: html };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const styles = Array.from(doc.head.querySelectorAll("style, link[rel='stylesheet']"))
    .map((node) => node.outerHTML)
    .join("");

  return {
    styles,
    body: doc.body.innerHTML,
  };
}

function buildHtmlDocument(styles: string, body: string, title: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${title}</title>${styles}</head><body>${body}</body></html>`;
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string) {
  if (!value) return "";
  return new Date(value).toISOString();
}

function getTemplateVariableState(
  type: AgreementType,
  existing: Record<string, string> = {},
) {
  return AGREEMENT_TEMPLATES[type].variables.reduce<Record<string, string>>((accumulator, variable) => {
    accumulator[variable.key] = existing[variable.key] ?? "";
    return accumulator;
  }, {});
}

function normalizeEmbeddedAgreementLayout(container: HTMLDivElement) {
  const page = container.querySelector<HTMLElement>(".page");
  if (page) {
    page.style.minHeight = "0";
    page.style.height = "auto";
    page.style.margin = "0 auto";
    page.style.boxShadow = "none";
    page.style.display = "block";
  }

  const body = container.querySelector<HTMLElement>(".body");
  if (body) {
    body.style.flex = "unset";
  }
}

function getEmbeddedAgreementHeight(container: HTMLDivElement) {
  const page = container.querySelector<HTMLElement>(".page");
  const measuredHeight = page ? page.scrollHeight : container.scrollHeight;
  return Math.max(measuredHeight, DOCUMENT_FALLBACK_HEIGHT);
}

type DocumentSurfaceProps = {
  bodyMarkup: string;
  styleMarkup: string;
  editable?: boolean;
  onBodyChange?: (bodyMarkup: string) => void;
};

function DocumentSurface({
  bodyMarkup,
  styleMarkup,
  editable = false,
  onBodyChange,
}: DocumentSurfaceProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [documentHeight, setDocumentHeight] = useState(DOCUMENT_FALLBACK_HEIGHT);

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    if (element.innerHTML !== bodyMarkup) {
      element.innerHTML = bodyMarkup;
    }
    normalizeEmbeddedAgreementLayout(element);
    setDocumentHeight(getEmbeddedAgreementHeight(element));
  }, [bodyMarkup]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const updateScale = () => {
      const nextScale = Math.min(1, Math.max(0.32, (viewport.clientWidth - 16) / DOCUMENT_BASE_WIDTH));
      setScale(nextScale);
      normalizeEmbeddedAgreementLayout(content);
      setDocumentHeight(getEmbeddedAgreementHeight(content));
    };

    updateScale();

    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });

    resizeObserver.observe(viewport);
    resizeObserver.observe(content);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleInput = useCallback(
    (event: FormEvent<HTMLDivElement>) => {
      const nextMarkup = event.currentTarget.innerHTML;
      normalizeEmbeddedAgreementLayout(event.currentTarget);
      setDocumentHeight(getEmbeddedAgreementHeight(event.currentTarget));
      onBodyChange?.(nextMarkup);
    },
    [onBodyChange],
  );

  return (
    <div
      ref={viewportRef}
      className="overflow-x-auto overflow-y-auto rounded-[24px] border border-slate-200/70 bg-slate-200/40 p-2 sm:rounded-[28px] sm:p-3"
    >
      <div
        className="mx-auto"
        style={{
          width: `${DOCUMENT_BASE_WIDTH * scale}px`,
          height: `${documentHeight * scale}px`,
        }}
      >
        <div
          className="labadmin-document"
          style={{
            width: `${DOCUMENT_BASE_WIDTH}px`,
            height: `${documentHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: styleMarkup }} />
          <style dangerouslySetInnerHTML={{ __html: EMBEDDED_DOCUMENT_STYLE_OVERRIDES }} />
          <div
            ref={contentRef}
            className={editable ? "labadmin-document-editable" : undefined}
            contentEditable={editable}
            suppressContentEditableWarning={editable}
            onInput={editable ? handleInput : undefined}
          />
        </div>
      </div>
    </div>
  );
}

export default function LabAdminAgreements({ initialAgreements = [] }: LabAdminAgreementsProps) {
  const [agreements, setAgreements] = useState<Agreement[]>(initialAgreements);
  const [showEditor, setShowEditor] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [mobileEditorPanel, setMobileEditorPanel] = useState<"settings" | "edit" | "preview">("settings");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "signed" | "pending">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za">("newest");
  const [createDraft, setCreateDraft] = useState<CreateDraftState>({
    type: "website_proposal",
    title: "",
    currencyCode: "NPR",
    password: "",
    expiresAt: "",
    variables: getTemplateVariableState("website_proposal"),
  });
  const [editor, setEditor] = useState<EditorState>({
    type: "website_proposal",
    title: "",
    currencyCode: "NPR",
    password: "",
    expiresAt: "",
    variables: {},
    styleMarkup: "",
    bodyMarkup: "",
  });

  const syncAgreements = useCallback(async () => {
    const response = await fetch("/api/admin/agreements", { cache: "no-store" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to refresh agreements");
    }

    setAgreements(Array.isArray(data) ? (data as Agreement[]) : []);
  }, []);

  useEffect(() => {
    syncAgreements().catch(() => {
      // Keep server-rendered data if the background refresh fails.
    });
  }, [syncAgreements]);

  const previewHtml = useMemo(
    () => buildHtmlDocument(editor.styleMarkup, editor.bodyMarkup, editor.title || "Agreement Preview"),
    [editor.bodyMarkup, editor.styleMarkup, editor.title],
  );
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredAgreements = useMemo(
    () =>
      agreements.filter((agreement) => {
        const statusMatch =
          activeFilter === "all"
            ? true
            : activeFilter === "signed"
              ? Boolean(agreement.signedAt)
              : !agreement.signedAt;

        const searchMatch = !normalizedSearch
          ? true
          : [
              agreement.title,
              agreement.slug,
              TYPE_LABELS[agreement.type],
              agreement.currencyCode,
              agreement.signerName || "",
            ]
              .join(" ")
              .toLowerCase()
              .includes(normalizedSearch);

        return statusMatch && searchMatch;
      }),
    [activeFilter, agreements, normalizedSearch],
  );
  const visibleAgreements = useMemo(() => {
    const next = [...filteredAgreements];
    next.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "az") {
        return a.title.localeCompare(b.title);
      }
      return b.title.localeCompare(a.title);
    });
    return next;
  }, [filteredAgreements, sortBy]);

  const handleBodyChange = useCallback((bodyMarkup: string) => {
    setEditor((current) => ({
      ...current,
      bodyMarkup,
    }));
  }, []);

  useEffect(() => {
    const mountNode = document.getElementById("floating-ui-root");
    if (!mountNode) return;
    if (showEditor || showCreateForm) {
      mountNode.style.display = "none";
    } else {
      mountNode.style.removeProperty("display");
    }
    return () => {
      mountNode.style.removeProperty("display");
    };
  }, [showCreateForm, showEditor]);

  const loadTemplateDocument = async (type: AgreementType, currencyCode: string, variables?: Record<string, string>) => {
    const response = await fetch("/api/admin/agreements/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        currencyCode,
        variables: variables || {},
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to prepare agreement template");
    }

    return data as { html: string; variables: Record<string, string> };
  };

  const resetEditor = () => {
    setEditor({
      type: "website_proposal",
      title: "",
      currencyCode: "NPR",
      password: "",
      expiresAt: "",
      variables: {},
      styleMarkup: "",
      bodyMarkup: "",
    });
    setShowEditor(false);
  };

  const resetCreateForm = () => {
    setCreateDraft({
      type: "website_proposal",
      title: "",
      currencyCode: "NPR",
      password: "",
      expiresAt: "",
      variables: getTemplateVariableState("website_proposal"),
    });
    setShowCreateForm(false);
  };

  const openCreateForm = () => {
    setCreateDraft({
      type: "website_proposal",
      title: "",
      currencyCode: "NPR",
      password: "",
      expiresAt: "",
      variables: getTemplateVariableState("website_proposal"),
    });
    setShowCreateForm(true);
  };

  const openCreateEditor = async () => {
    try {
      if (!createDraft.title.trim()) {
        toast.error("Please enter an agreement title");
        return;
      }
      if (!createDraft.password.trim()) {
        toast.error("Please set a password before continuing");
        return;
      }

      const rendered = await loadTemplateDocument(
        createDraft.type,
        createDraft.currencyCode,
        createDraft.variables,
      );
      const parts = extractDocumentParts(rendered.html);
      setEditor({
        type: createDraft.type,
        title: createDraft.title,
        currencyCode: createDraft.currencyCode,
        password: createDraft.password,
        expiresAt: createDraft.expiresAt,
        variables: {
          ...rendered.variables,
          ...createDraft.variables,
        },
        styleMarkup: parts.styles,
        bodyMarkup: parts.body,
      });
      setShowCreateForm(false);
      setMobileEditorPanel("settings");
      setShowEditor(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to open editor");
    }
  };

  const openEditEditor = async (agreement: Agreement) => {
    try {
      let html = agreement.documentHtml || "";
      if (!html) {
        const rendered = await loadTemplateDocument(agreement.type, agreement.currencyCode, agreement.variables);
        html = rendered.html;
      }
      const parts = extractDocumentParts(html);
      setEditor({
        id: agreement.id,
        type: agreement.type,
        title: agreement.title,
        currencyCode: agreement.currencyCode || "NPR",
        password: "",
        expiresAt: toDateTimeLocal(agreement.expiresAt),
        variables: agreement.variables,
        styleMarkup: parts.styles,
        bodyMarkup: parts.body,
      });
      setMobileEditorPanel("settings");
      setShowEditor(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to open agreement editor");
    }
  };

  const refreshTemplate = async (nextType: AgreementType, nextCurrency = editor.currencyCode) => {
    try {
      const rendered = await loadTemplateDocument(nextType, nextCurrency, editor.variables);
      const parts = extractDocumentParts(rendered.html);
      setEditor((current) => ({
        ...current,
        type: nextType,
        currencyCode: nextCurrency,
        variables: {
          ...rendered.variables,
          ...current.variables,
        },
        styleMarkup: parts.styles,
        bodyMarkup: parts.body,
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to switch template");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this agreement?")) return;

    try {
      const response = await fetch(`/api/admin/agreements/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete agreement");
      }
      await syncAgreements();
      toast.success("Agreement deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete agreement");
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getPublicUrl = (slug: string) => `/agreements/view/${slug}`;
  const clearListControls = () => {
    setSearchTerm("");
    setActiveFilter("all");
    setSortBy("newest");
  };

  const downloadAgreementPdf = async (agreement: Agreement) => {
    try {
      const response = await fetch(`/api/admin/agreements/${agreement.id}/document`, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok || !data.html) {
        throw new Error(data.error || "Failed to load agreement document");
      }

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        throw new Error("Could not access print document");
      }

      doc.write(String(data.html));
      doc.close();

      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.print();
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 300);
        }, 120);
      };

      toast.success(agreement.signedAt ? "Opening signed PDF download" : "Opening agreement PDF download");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to download agreement");
    }
  };

  const handleSave = async () => {
    if (!editor.title.trim()) {
      toast.error("Please enter an agreement title");
      return;
    }
    if (!editor.id && !editor.password.trim()) {
      toast.error("Please set a password before generating the share link");
      return;
    }

    setIsSaving(true);
    try {
      const url = editor.id ? `/api/admin/agreements/${editor.id}` : "/api/admin/agreements";
      const method = editor.id ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: editor.type,
          title: editor.title,
          variables: editor.variables,
          documentHtml: previewHtml,
          password: editor.password || undefined,
          currencyCode: editor.currencyCode,
          expiresAt: editor.expiresAt ? fromDateTimeLocal(editor.expiresAt) : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save agreement");
      }

      const savedAgreement = data as Agreement;
      await syncAgreements();
      toast.success(editor.id ? "Agreement updated" : "Agreement created");
      resetEditor();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save agreement");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-400">Lab Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Agreements</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">
              Create protected proposal links, edit the agreement directly in a document view, and track signatures in one place.
            </p>
          </div>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            <Plus className="h-4 w-4" />
            Create Agreement
          </button>
        </div>

        {showCreateForm ? (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 p-3 backdrop-blur md:p-6">
            <div className="mx-auto flex min-h-full w-full max-w-4xl items-center justify-center">
              <div className="w-full overflow-hidden rounded-[28px] border border-gray-800 bg-gray-950 md:rounded-[32px]">
                <div className="border-b border-gray-800 px-4 py-4 md:px-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-400">
                    Create Agreement
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Step 1: Agreement Setup</h2>
                </div>

                <div className="max-h-[72vh] overflow-y-auto px-4 py-5 md:px-6 md:py-6">
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Agreement Type *</label>
                      <select
                        value={createDraft.type}
                        onChange={(event) =>
                          setCreateDraft((current) => ({
                            ...current,
                            type: event.target.value as AgreementType,
                            variables: getTemplateVariableState(
                              event.target.value as AgreementType,
                              current.variables,
                            ),
                          }))
                        }
                        className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
                      >
                        {Object.values(AGREEMENT_TEMPLATES).map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name} - {template.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Agreement Title *</label>
                      <input
                        value={createDraft.title}
                        onChange={(event) =>
                          setCreateDraft((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        placeholder="e.g., Acme Corp - Website Proposal"
                        className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
                      />
                    </div>

                    <div className="border-t border-gray-800 pt-5">
                      <h3 className="text-sm font-semibold text-white">Template Variables</h3>
                      <div className="mt-4 space-y-4">
                        {AGREEMENT_TEMPLATES[createDraft.type].variables.map((variable) => (
                          <div key={variable.key}>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                              {variable.label}
                            </label>
                            <input
                              type={variable.type ?? "text"}
                              value={createDraft.variables[variable.key] ?? ""}
                              onChange={(event) =>
                                setCreateDraft((current) => ({
                                  ...current,
                                  variables: {
                                    ...current.variables,
                                    [variable.key]: event.target.value,
                                  },
                                }))
                              }
                              placeholder={variable.placeholder}
                              className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Currency</label>
                      <select
                        value={createDraft.currencyCode}
                        onChange={(event) =>
                          setCreateDraft((current) => ({
                            ...current,
                            currencyCode: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
                      >
                        <option value="NPR">NPR</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Document Password *</label>
                      <input
                        type="password"
                        value={createDraft.password}
                        onChange={(event) =>
                          setCreateDraft((current) => ({
                            ...current,
                            password: event.target.value,
                          }))
                        }
                        placeholder="Required for public link"
                        className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Expiry Date</label>
                      <input
                        type="datetime-local"
                        value={createDraft.expiresAt}
                        onChange={(event) =>
                          setCreateDraft((current) => ({
                            ...current,
                            expiresAt: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-gray-800 px-4 py-4 md:flex-row md:justify-end md:px-6">
                  <button
                    type="button"
                    onClick={resetCreateForm}
                    className="labadmin-secondary-btn inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition md:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void openCreateEditor()}
                    className="labadmin-cta inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition md:w-auto"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {showEditor ? (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 p-3 backdrop-blur md:p-6">
            <div className="labadmin-editor-surface flex min-h-full flex-col overflow-hidden rounded-[32px] border border-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 px-4 py-4 md:px-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-400">
                    {editor.id ? "Edit Agreement" : "Create Agreement"}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Document Editor</h2>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (editor.id) {
                        resetEditor();
                        return;
                      }
                      setShowEditor(false);
                      setShowCreateForm(true);
                    }}
                    className="labadmin-secondary-btn inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium transition sm:w-auto"
                  >
                    {editor.id ? "Close" : "Back"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={isSaving}
                    className="labadmin-cta inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60 sm:w-auto"
                  >
                    {isSaving ? "Saving..." : editor.id ? "Save Changes" : "Create Link"}
                  </button>
                </div>
              </div>

              <div className="border-b border-gray-800 bg-gray-950/70 px-3 py-3 lg:hidden">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileEditorPanel("settings")}
                    className={`labadmin-editor-tab inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium transition ${
                      mobileEditorPanel === "settings"
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : "border-gray-700 bg-white/5 text-gray-300"
                    }`}
                  >
                    <Settings2 className="h-4 w-4" />
                    Setup
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileEditorPanel("edit")}
                    className={`labadmin-editor-tab inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium transition ${
                      mobileEditorPanel === "edit"
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : "border-gray-700 bg-white/5 text-gray-300"
                    }`}
                  >
                    <PencilLine className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileEditorPanel("preview")}
                    className={`labadmin-editor-tab inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium transition ${
                      mobileEditorPanel === "preview"
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : "border-gray-700 bg-white/5 text-gray-300"
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                </div>
              </div>

              <div className="grid gap-0 lg:min-h-0 lg:flex-1 lg:grid-cols-[380px_minmax(0,1fr)_minmax(0,1fr)]">
                <aside className={`${mobileEditorPanel === "settings" ? "block" : "hidden"} border-b border-gray-800 bg-gray-900/80 p-4 lg:block lg:min-h-0 lg:overflow-y-auto lg:border-b-0 lg:border-r md:p-6`}>
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Agreement title</label>
                      <input
                        value={editor.title}
                        onChange={(event) =>
                          setEditor((current) => ({ ...current, title: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
                        placeholder="e.g. Acme Pvt Ltd Proposal"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Template</label>
                      <select
                        value={editor.type}
                        disabled={!editor.id}
                        onChange={(event) => void refreshTemplate(event.target.value as AgreementType)}
                        className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {Object.values(AGREEMENT_TEMPLATES).map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-xs text-gray-400">
                        {editor.id
                          ? "Switching templates reloads the document layout for a fresh draft."
                          : "Template is locked here. Go back to step 1 if you want to change it."}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Currency</label>
                      <select
                        value={editor.currencyCode}
                        onChange={(event) => void refreshTemplate(editor.type, event.target.value)}
                        className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
                      >
                        <option value="NPR">NPR</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        {editor.id ? "Rotate document password" : "Document password"}
                      </label>
                      <input
                        type="password"
                        value={editor.password}
                        onChange={(event) =>
                          setEditor((current) => ({ ...current, password: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
                        placeholder={editor.id ? "Leave blank to keep current password" : "Required for public link"}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Expiry date</label>
                      <input
                        type="datetime-local"
                        value={editor.expiresAt}
                        onChange={(event) =>
                          setEditor((current) => ({ ...current, expiresAt: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
                      />
                      <p className="mt-2 text-xs text-gray-400">
                        Optional. When set, the public link stops working after this date.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-gray-800 bg-gray-900 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-400">
                        Editing Notes
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-gray-300">
                        <li>Click inside the left document and edit text directly, just like a live doc.</li>
                        <li>Clause titles, paragraphs, headings, and values are all editable in place.</li>
                        <li>The right panel mirrors the public-facing result in real time.</li>
                      </ul>
                    </div>
                  </div>
                </aside>

                <section className={`${mobileEditorPanel === "edit" ? "block" : "hidden"} min-w-0 border-b border-gray-800 p-4 lg:block lg:min-h-0 lg:overflow-y-auto lg:border-b-0 lg:border-r md:p-6`}>
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-400">Editable Document</p>
                      <p className="mt-1 text-sm text-gray-400">Type directly into the agreement body.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void refreshTemplate(editor.type, editor.currencyCode)}
                      className="labadmin-secondary-btn inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Reset Template
                    </button>
                  </div>

                  <DocumentSurface
                    editable
                    bodyMarkup={editor.bodyMarkup}
                    styleMarkup={editor.styleMarkup}
                    onBodyChange={handleBodyChange}
                  />
                </section>

                <section className={`${mobileEditorPanel === "preview" ? "block" : "hidden"} min-w-0 p-4 lg:block lg:min-h-0 lg:overflow-y-auto md:p-6`}>
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-400">Live Preview</p>
                    <p className="mt-1 text-sm text-gray-400">This matches what the shared link will show after save.</p>
                  </div>

                  <DocumentSurface bodyMarkup={editor.bodyMarkup} styleMarkup={editor.styleMarkup} />
                </section>
              </div>
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
          </div>
        ) : agreements.length === 0 ? (
          <div className="rounded-[32px] border border-gray-800 bg-gray-900 p-10 text-center">
            <h2 className="text-xl font-semibold text-white">No agreements yet</h2>
            <p className="mt-3 text-sm text-gray-400">
              Create your first secure proposal link to start editing documents inline and collecting signatures.
            </p>
            <button
              onClick={openCreateForm}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              <Plus className="h-4 w-4" />
              Create First Agreement
            </button>
          </div>
        ) : (
          <>
            <section className="mb-5 rounded-[28px] border border-gray-800 bg-gray-900 p-4 shadow-xl">
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-400">Agreement Filters</p>
              </div>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex w-full flex-col gap-3 md:flex-row">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search title, slug, signer, type..."
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
                  />
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as "newest" | "oldest" | "az" | "za")}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2 text-sm text-white focus:border-yellow-400 focus:outline-none md:w-48"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="az">Title A-Z</option>
                    <option value="za">Title Z-A</option>
                  </select>
                </div>
                <p className="text-xs text-gray-400">
                  Showing {visibleAgreements.length} of {agreements.length}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${activeFilter === "all" ? "bg-yellow-400 text-black" : "bg-gray-800 text-gray-200 hover:bg-gray-700"}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("signed")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${activeFilter === "signed" ? "bg-yellow-400 text-black" : "bg-gray-800 text-gray-200 hover:bg-gray-700"}`}
                >
                  Signed
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("pending")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${activeFilter === "pending" ? "bg-yellow-400 text-black" : "bg-gray-800 text-gray-200 hover:bg-gray-700"}`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={clearListControls}
                  className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {visibleAgreements.map((agreement) => (
              <article key={agreement.id} className="rounded-[28px] border border-gray-800 bg-gray-900 p-5 shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-400">
                      {TYPE_LABELS[agreement.type]}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-white">{agreement.title}</h2>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                    {agreement.signedAt ? "Signed" : "Pending"}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-yellow-400" />
                    <span>{agreement.passwordProtected ? "Password protected" : "No password set"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-yellow-400" />
                    <span>{agreement.currencyCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-yellow-400" />
                    <span>
                      {agreement.expiresAt
                        ? `Expires ${format(new Date(agreement.expiresAt), "MMM dd, yyyy p")}`
                        : "No expiry"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-950 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">Share Link</p>
                  <code className="block break-all text-xs text-white">{getPublicUrl(agreement.slug)}</code>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}${getPublicUrl(agreement.slug)}`)}
                    className="labadmin-agreement-action inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm sm:w-auto"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </button>
                  {agreement.signedAt ? (
                    <button
                      onClick={() => void downloadAgreementPdf(agreement)}
                      className="labadmin-agreement-action-success inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm sm:w-auto"
                    >
                      <Download className="h-4 w-4" />
                      Download Signed PDF
                    </button>
                  ) : null}
                  <a
                    href={getPublicUrl(agreement.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="labadmin-agreement-action inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm sm:w-auto"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </a>
                  <button
                    onClick={() => void openEditEditor(agreement)}
                    className="labadmin-agreement-action inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm sm:w-auto"
                  >
                    <FilePenLine className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => void handleDelete(agreement.id)}
                    className="labadmin-agreement-action-danger inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
            </div>
            {visibleAgreements.length === 0 ? (
              <p className="mt-5 text-center text-sm text-gray-400">No matching agreements for the current search or filters.</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
