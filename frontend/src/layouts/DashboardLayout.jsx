import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import "./DashboardLayout.css";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="dashboard-main-wrapper">
        {/* Mobile Header with Hamburger */}
        <div className="mobile-header">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="menu-button"
          >
            <Menu className="menu-icon" />
          </button>
          <span className="brand-title">NihalAI</span>
          <div className="header-spacer" /> {/* Spacer for centering if needed */}
        </div>
        <div className="desktop-navbar">
          <Navbar />
        </div>

        <main className="main-content">
          <div className="content-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
