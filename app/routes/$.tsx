import { json, type LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  // Handle Chrome DevTools and other well-known requests
  if (url.pathname.startsWith("/.well-known/") || 
      url.pathname.includes("com.chrome.devtools")) {
    return json({}, { status: 404 });
  }
  
  // For other unknown routes, throw 404
  throw new Response("Not Found", { status: 404 });
}

export default function CatchAll() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Halaman tidak ditemukan</p>
        <a 
          href="/" 
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Kembali ke Home
        </a>
      </div>
    </div>
  );
}