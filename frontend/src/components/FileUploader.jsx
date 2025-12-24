export default function FileUploader({ onUpload }) {
  return (
    <label className="block cursor-pointer">
      <div className="card-premium flex flex-col items-center justify-center gap-3 p-8 text-center border-dashed border-2 border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-[var(--text-muted)]">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="7 10 12 5 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="5" x2="12" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="text-sm text-[var(--text-main)]">Drag & drop a file, or click to browse</div>
        <div className="text-xs text-[var(--text-muted)]">CSV, XLSX — max 10MB</div>
      </div>
      <input type="file" accept=".csv,.xlsx" className="sr-only" onChange={(e) => onUpload && onUpload(e.target.files[0])} />
    </label>
  );
}
