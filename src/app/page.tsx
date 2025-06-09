export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">📈 Stock Analysis Platform</h1>
      <p className="text-lg mb-8 text-gray-700 max-w-xl">
        Welcome! Investors can request smart stock recommendations. Analysts analyze trends,
        generate GPT-4-backed insights, and manage investor reports.
      </p>

      <div className="space-x-4">
        <a
          href="/signup"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Signup
        </a>
        <a
          href="/login"
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
        >
          Login
        </a>
      </div>
    </main>
  );
}
