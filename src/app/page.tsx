import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Home</h1>
      <p className="mt-3 text-gray-600">Use the navbar to open Blogs & Resources.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/blogs" className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
          Go to Blogs
        </Link>
        <Link href="/resources" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
          Go to Resources
        </Link>
      </div>
    </main>
  );
}
