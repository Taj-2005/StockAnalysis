export default function UnauthorizedPage() {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-red-50 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Access Denied</h1>
      <p className="text-lg text-gray-700">You are not authorized to view this page.</p>
      <a
        href="/"
        className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Home
      </a>
    </main>
  );
}
