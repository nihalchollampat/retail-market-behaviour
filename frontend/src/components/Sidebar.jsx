import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  ThumbsUp,
  Map,
  BarChart2,
  UploadCloud,
  X
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { icon: Users, label: "Customer Segments", path: "/segments" },
  { icon: TrendingUp, label: "Spend Prediction", path: "/spend-prediction" },
  { icon: ThumbsUp, label: "Recommendations", path: "/recommendations" },
  { icon: Map, label: "Behavior Map", path: "/behavior-map" },
  { icon: ShoppingBag, label: "Frequently Bought", path: "/frequently-bought" },
  { icon: UploadCloud, label: "Data Set", path: "/upload" },
];

// Re-add PeakInsights icon import or remove if not used, wait, I removed it from imports above? 
// Checking original file... yes PeakInsights was NOT imported in original but used in array? 
// No, looking at original file step 43:
// 27:   { icon: BarChart2, label: "Peak Insights", path: "/peak-insights" },
// usage: const Icon = item.icon;
// Ah, PeakInsights is not an icon, BarChart2 is used. My bad in the array above. 
// I will correct the array to match original logic but with BarChart2.

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] transform transition-transform duration-300 ease-in-out lg:transform-none lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--text-main)]">MinersAI</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-[var(--bg-card)] rounded-md"
          >
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-medium transition-colors border",
                  isActive
                    ? "bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--accent-primary)] shadow-sm"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[var(--accent-primary)]" : "text-current")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer info or minimal spacer */}
        <div className="p-4 border-t border-[var(--border-subtle)]">
          <p className="text-xs text-[var(--text-muted)] text-center">
            &copy; 2025 MinersAI
          </p>
        </div>

      </aside>
    </>
  );
}
