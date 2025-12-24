import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center px-4 justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-[var(--text-muted)] hover:bg-[var(--bg-card)] rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-[var(--text-main)]">NihalAI</span>
          <div className="w-6" /> {/* Spacer for centering if needed */}
        </div>
        <div className="hidden lg:block">
          <Navbar />
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
