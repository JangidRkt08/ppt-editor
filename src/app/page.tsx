import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-3xl font-semibold">PowerPoint Editor</h1>
        <p className="text-zinc-600">
          A lightweight, production-ready presentation editor built with
          Next.js, Fabric.js and Redux.
        </p>
        <div>
          <Link
            href="/editor"
            className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-zinc-50 text-black"
          >
            Open PPT-Editor
          </Link>
        </div>
      </div>
    </main>
  );
}
