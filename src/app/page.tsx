import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-4 sm:p-6">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PowerPoint Editor
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            A lightweight, production-ready presentation editor built with
            Next.js, Fabric.js and Redux. Create beautiful presentations on any
            device.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/editor"
            className="inline-flex items-center justify-center w-full sm:w-auto rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-medium shadow-sm hover:bg-zinc-50 text-black transition-colors"
          >
            Open PPT-Editor
          </Link>

          <div className="text-xs text-zinc-500 space-y-2">
            <p>✓ Responsive design for all devices</p>
            <p>✓ Touch-friendly interface</p>
            <p>✓ Save and load presentations</p>
            <p>✓ Export to PNG format</p>
          </div>
        </div>
      </div>
    </main>
  );
}
