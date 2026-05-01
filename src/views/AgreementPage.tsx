"use client";

import {
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Download, PenLine, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import type { Agreement } from "@/lib/types/agreement";

type AgreementWithHtml = Agreement & {
  html?: string;
};

type AgreementApiError = {
  error?: string;
  title?: string;
  requiresPassword?: boolean;
};

type AgreementPageProps = {
  slug: string;
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

function extractDocumentBody(html: string) {
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

export default function AgreementPage({ slug }: AgreementPageProps) {
  const [agreement, setAgreement] = useState<AgreementWithHtml | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gateTitle, setGateTitle] = useState("Agreement");
  const [password, setPassword] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAgreementRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    hasAgreementRef.current = Boolean(agreement);
  }, [agreement]);

  const loadAgreement = useCallback(async (options?: { preserveCurrent?: boolean }) => {
    const preserveCurrent = Boolean(options?.preserveCurrent && hasAgreementRef.current);
    if (preserveCurrent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const response = await fetch(`/api/public/agreements/${slug}`, { cache: "no-store" });
      const data = (await response.json()) as AgreementWithHtml & AgreementApiError;

      if (!response.ok) {
        if (response.status === 401 && data.requiresPassword) {
          setAgreement(null);
          setGateTitle(data.title || "Agreement");
          setError(null);
          return;
        }

        throw new Error(data.error || "Failed to load agreement");
      }

      setAgreement(data);
      setGateTitle(data.title || "Agreement");
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load agreement");
    } finally {
      if (preserveCurrent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [slug]);

  useEffect(() => {
    void loadAgreement();
  }, [loadAgreement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !agreement || agreement.signedAt) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const scale = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * scale;
    canvas.height = height * scale;
    context.scale(scale, scale);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 2.5;
    context.strokeStyle = "#111827";
  }, [agreement]);

  const documentParts = useMemo(
    () => (agreement?.html ? extractDocumentBody(agreement.html) : { styles: "", body: "" }),
    [agreement?.html],
  );

  const documentViewportRef = useRef<HTMLDivElement | null>(null);
  const documentContentRef = useRef<HTMLDivElement | null>(null);
  const [documentScale, setDocumentScale] = useState(1);
  const [documentHeight, setDocumentHeight] = useState(DOCUMENT_FALLBACK_HEIGHT);

  useLayoutEffect(() => {
    const element = documentContentRef.current;
    if (!element) return;
    element.innerHTML = documentParts.body;
    normalizeEmbeddedAgreementLayout(element);
    setDocumentHeight(getEmbeddedAgreementHeight(element));
  }, [documentParts.body]);

  useEffect(() => {
    const viewport = documentViewportRef.current;
    const content = documentContentRef.current;
    if (!viewport || !content) return;

    const updateScale = () => {
      const compactViewport = viewport.clientWidth < 640;
      const horizontalPadding = compactViewport ? 8 : 16;
      const minScale = compactViewport ? 0.18 : 0.32;
      const nextScale = Math.min(1, Math.max(minScale, (viewport.clientWidth - horizontalPadding) / DOCUMENT_BASE_WIDTH));
      setDocumentScale(nextScale);
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
  }, [agreement?.html]);

  const draw = (event: PointerEvent | ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };

  const startDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    draw(event);
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.beginPath();
    }
    drawingRef.current = false;
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordSubmitting(true);
    try {
      const response = await fetch(`/api/public/agreements/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as AgreementApiError;
      if (!response.ok) {
        throw new Error(data.error || "Incorrect password");
      }
      setPassword("");
      await loadAgreement({ preserveCurrent: true });
    } catch (submitError) {
      toast.error(submitError instanceof Error ? submitError.message : "Incorrect password");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const signatureData = canvasRef.current?.toDataURL("image/png") || "";
    if (!signerName.trim()) {
      toast.error("Please enter the signer name");
      return;
    }
    if (signatureData.length < 2000) {
      toast.error("Please draw a signature before submitting");
      return;
    }

    setSigning(true);
    try {
      const response = await fetch(`/api/public/agreements/${slug}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signerName,
          signatureData,
        }),
      });
      const data = (await response.json()) as AgreementApiError;
      if (!response.ok) {
        throw new Error(data.error || "Failed to sign agreement");
      }
      toast.success("Agreement signed successfully");
      await loadAgreement({ preserveCurrent: true });
    } catch (submitError) {
      toast.error(submitError instanceof Error ? submitError.message : "Failed to sign agreement");
    } finally {
      setSigning(false);
    }
  };

  const downloadAsPDF = () => {
    if (!agreement?.html) {
      toast.error("Cannot download: agreement HTML not available");
      return;
    }

    try {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        throw new Error("Could not access iframe document");
      }

      doc.write(agreement.html);
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
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  if (!agreement) {
    if (error) {
      return (
        <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
          <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
            <h1 className="text-2xl font-semibold">This link is unavailable</h1>
            <p className="mt-3 text-sm text-slate-300">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:py-12">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Protected Document</p>
          <h1 className="mt-3 text-2xl font-semibold">{gateTitle}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Enter the password shared with you to view and sign this agreement.
          </p>

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Document password"
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400"
              required
            />
            <button
              type="submit"
              disabled={passwordSubmitting}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
            >
              {passwordSubmitting ? "Unlocking..." : "Unlock Document"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4efe6] text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur print:hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Agreement</p>
            <h1 className="break-words text-sm font-semibold sm:text-base">{agreement.title}</h1>
            <p className="mt-1 text-xs text-slate-500">
              {agreement.signedAt
                ? `Completed by ${agreement.signerName || "Signer"}`
                : "Review and sign to complete this agreement"}
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-end">
            <button
              onClick={() => void loadAgreement({ preserveCurrent: true })}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 sm:w-auto"
              disabled={refreshing}
              type="button"
            >
              <RefreshCcw size={16} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={downloadAsPDF}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 sm:w-auto"
              title={agreement.signedAt ? "Download signed PDF" : "Download as PDF"}
              type="button"
            >
              <Download size={18} />
              <span>{agreement.signedAt ? "Download Signed PDF" : "Download PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto grid w-full max-w-7xl gap-4 px-2 py-4 sm:gap-6 sm:px-4 sm:py-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 lg:px-6 lg:py-8">
        <section className="bg-transparent p-0 sm:rounded-[28px] sm:border sm:border-slate-200 sm:bg-white sm:p-4 sm:shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
          <div
            ref={documentViewportRef}
            className="overflow-x-auto overflow-y-auto bg-transparent p-0 sm:rounded-[24px] sm:bg-slate-100/80 sm:p-3"
          >
            <div
              className="mx-auto"
              style={{
                width: `${DOCUMENT_BASE_WIDTH * documentScale}px`,
                height: `${documentHeight * documentScale}px`,
              }}
            >
              <div
                className="bg-white shadow-[0_18px_38px_rgba(15,23,42,0.12)] sm:rounded-[24px] sm:shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
                style={{
                  width: `${DOCUMENT_BASE_WIDTH}px`,
                  height: `${documentHeight}px`,
                  transform: `scale(${documentScale})`,
                  transformOrigin: "top left",
                }}
              >
                <style dangerouslySetInnerHTML={{ __html: documentParts.styles }} />
                <style dangerouslySetInnerHTML={{ __html: EMBEDDED_DOCUMENT_STYLE_OVERRIDES }} />
                <div ref={documentContentRef} />
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4 print:hidden sm:space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">
              {agreement.signedAt ? "Document Completed" : "Signature Required"}
            </p>
            {agreement.signedAt ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Signed on {new Date(agreement.signedAt).toLocaleString()}
                </div>
                <p className="text-sm text-slate-600">
                  This agreement is complete. The document on the left and the downloaded PDF both include the signed state.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Signer</p>
                    <p className="mt-2 break-words text-sm text-slate-700">{agreement.signerName}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recorded IP</p>
                    <p className="mt-2 break-all text-sm text-slate-700">{agreement.signerIp || "Unknown"}</p>
                  </div>
                </div>
                {agreement.signatureData ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <img src={agreement.signatureData} alt="Saved signature" className="h-24 w-full object-contain sm:h-28" />
                  </div>
                ) : null}
              </div>
            ) : (
              <form onSubmit={handleSign} className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                  <input
                    type="text"
                    value={signerName}
                    onChange={(event) => setSignerName(event.target.value)}
                    placeholder="Signer name"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-slate-700">Draw signature</label>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-xs font-medium text-slate-500 hover:text-slate-900"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
                    <canvas
                      ref={canvasRef}
                      className="h-36 w-full touch-none sm:h-44"
                      onPointerDown={startDrawing}
                      onPointerMove={(event) => {
                        if (!drawingRef.current) return;
                        draw(event);
                      }}
                      onPointerUp={stopDrawing}
                      onPointerLeave={stopDrawing}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={signing}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  <PenLine size={16} />
                  {signing ? "Saving Signature..." : "Sign Agreement"}
                </button>
              </form>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
