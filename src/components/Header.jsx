export default function Header({ isPro, onShowPricing, currentView, onGoHome }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="logo-btn" onClick={onGoHome} aria-label="Go to home">
          <span className="logo-mark">IQ</span>
          <span className="logo-text">Tariff<strong>IQ</strong></span>
        </button>

        <div className="header-right">
          {isPro ? (
            <span className="pro-badge">Pro</span>
          ) : (
            <button className="btn btn-outline btn-sm" onClick={onShowPricing}>
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
