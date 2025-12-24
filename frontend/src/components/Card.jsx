export default function Card({ title, children }) {
  return (
    <div className="card-premium">
      <h3 className="text-lg font-semibold mb-3 text-[var(--text-main)]">{title}</h3>
      <div className="text-sm text-[var(--text-muted)]">{children}</div>
    </div>
  );
}
