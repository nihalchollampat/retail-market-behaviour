import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  TrendingUp,
  ThumbsUp,
  Map, // Keep Map if used
  UploadCloud,
  X
} from "lucide-react";
import "./Navigation.css";

const menuItems = [
  { icon: Users, label: "Customer Segments", path: "/segments" },
  { icon: TrendingUp, label: "Spend Prediction", path: "/spend-prediction" },
  { icon: ThumbsUp, label: "Recommendations", path: "/recommendations" },
  { icon: Map, label: "Behavior Map", path: "/behavior-map" },
  { icon: ShoppingBag, label: "Frequently Bought", path: "/frequently-bought" },
  { icon: UploadCloud, label: "Data Set", path: "/upload" },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={`sidebar-aside ${isOpen ? "open" : ""}`}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon-box">
              <LayoutDashboard className="brand-icon-svg" />
            </div>
            <span className="brand-text">MinersAI</span>
          </div>
          <button
            onClick={onClose}
            className="sidebar-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                <Icon className={`sidebar-link-icon ${isActive ? "active" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <p className="footer-text">
            &copy; 2026 NIHAL C
          </p>
        </div>

      </aside>
    </>
  );
}
