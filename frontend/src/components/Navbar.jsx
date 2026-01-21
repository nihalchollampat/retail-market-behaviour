import "./Navigation.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 3v18M3 12h18" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="navbar-texts">
            <div className="navbar-title">Retail Insights</div>
            <div className="navbar-subtitle">Smart customer behavior analytics</div>
          </div>
        </div>

      </div>
    </header>
  );
}
