import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
        👋 Welcome to Interactive Workspace
      </h1>

      <p className="text-gray-600 text-lg mb-10 max-w-xl">
        Explore the interactive drag-and-drop workspace or view real-time Bitcoin transactions.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <Link href="/workspace">
          <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-lg font-semibold shadow transition">
            Go to Workspace
          </button>
        </Link>

        <Link href="/transactions">
          <button className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-lg text-lg font-semibold shadow transition">
            Go to Transactions
          </button>
        </Link>
      </div>
    </main>
  );
}
