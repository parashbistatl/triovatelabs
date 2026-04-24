"use client";

import { useState } from "react";

type LabAdminDashboardProps = {
  initialStats?: {
    blogCount: number;
    resourceCount: number;
    agreementCount: number;
  };
};

export default function LabAdminDashboard({ initialStats }: LabAdminDashboardProps) {
  const [blogCount] = useState(initialStats?.blogCount ?? 0);
  const [resourceCount] = useState(initialStats?.resourceCount ?? 0);
  const [agreementCount] = useState(initialStats?.agreementCount ?? 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-yellow-400">Lab Admin</h1>
            <p className="text-sm text-gray-400">Dashboard</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <h2 className="text-2xl font-bold sm:text-3xl">Welcome back, Admin</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400">Total Blogs</p>
            <p className="mt-2 text-4xl font-bold text-yellow-400">{blogCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400">Total Resources</p>
            <p className="mt-2 text-4xl font-bold text-yellow-400">{resourceCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400">Total Agreements</p>
            <p className="mt-2 text-4xl font-bold text-yellow-400">{agreementCount}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
