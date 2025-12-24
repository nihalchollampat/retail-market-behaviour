export default function Chart({ title }) {
  return (
    <div className="card-premium h-72 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-[var(--text-main)]">{title}</h4>
        <div className="text-xs text-[var(--text-muted)]">Live · mock</div>
      </div>

      <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
        <div className="w-full h-44 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center">
          <span>Chart placeholder</span>
        </div>
      </div>
    </div>
  );
}
