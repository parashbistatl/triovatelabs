import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SESSION_KEY = "labadmin_auth";

export default function LabAdminDashboard() {
  const navigate = useNavigate();
  const [blogCount, setBlogCount] = useState(0);
  const [resourceCount, setResourceCount] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) !== "1") {
      navigate("/labadmin/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [blogsRes, resourcesRes] = await Promise.all([
          fetch("/api/admin/blogs"),
          fetch("/api/admin/resources"),
        ]);

        if (blogsRes.ok) {
          const blogs = await blogsRes.json();
          if (Array.isArray(blogs)) {
            setBlogCount(blogs.length);
          }
        }

        if (resourcesRes.ok) {
          const resources = await resourcesRes.json();
          if (Array.isArray(resources)) {
            setResourceCount(resources.length);
          }
        }
      } catch {
        // Keep zero stats if API is unavailable.
      }
    };

    void loadStats();
  }, []);

  const onLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    navigate("/labadmin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-yellow-400">Lab Admin</h1>
            <p className="text-sm text-gray-400">Dashboard</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-lg border border-red-700 px-3 py-2 text-sm text-red-400 hover:bg-gray-800 sm:w-auto"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <h2 className="text-2xl font-bold sm:text-3xl">Welcome back, Admin</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400">Total Blogs</p>
            <p className="mt-2 text-4xl font-bold text-yellow-400">{blogCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-400">Total Resources</p>
            <p className="mt-2 text-4xl font-bold text-yellow-400">{resourceCount}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
          <Link
            to="/labadmin/blogs"
            className="rounded-lg bg-yellow-400 px-4 py-2 text-center text-sm font-semibold text-black hover:bg-yellow-300"
          >
            Manage Blogs
          </Link>
          <Link
            to="/labadmin/resources"
            className="rounded-lg bg-gray-800 px-4 py-2 text-center text-sm text-gray-200 hover:bg-gray-700"
          >
            Manage Resources
          </Link>
        </div>
      </main>
    </div>
  );
}
