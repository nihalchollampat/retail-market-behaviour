export default function Navbar() {
  return (
    <header className="w-full py-4 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 3v18M3 12h18" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold text-[var(--text-main)]">Retail Insights</div>
            <div className="text-xs text-[var(--text-muted)]">Smart customer behavior analytics</div>
          </div>
        </div>

      </div>
    </header>
  );
}
