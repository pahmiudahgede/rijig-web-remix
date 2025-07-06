import { Outlet } from "@remix-run/react";
import { Recycle, Leaf } from "lucide-react";

export default function AuthPengelolaLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl shadow-lg">
              <Recycle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                WasteFlow
              </h1>
              <p className="text-sm text-gray-600">Pengelola Portal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center p-6 text-xs text-gray-500">
        <div className="flex items-center justify-center space-x-4 mb-2">
          <a href="/privacy" className="hover:text-green-600 transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="/terms" className="hover:text-green-600 transition-colors">
            Terms of Service
          </a>
          <span>•</span>
          <a href="/support" className="hover:text-green-600 transition-colors">
            Support
          </a>
        </div>
        <p>© 2025 WasteFlow. Sistem Pengelolaan Sampah Terpadu.</p>
      </footer>
    </div>
  );
}