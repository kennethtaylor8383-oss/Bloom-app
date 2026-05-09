export default function Header({ isPro, projectName, onShowPricing, onGoHome, onGoProjects }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left">
          <button className="logo-btn" onClick={onGoHome} aria-label="Go to home">
            <span className="logo-mark">IQ</span>
            <span className="logo-text">Tariff<strong>IQ</strong></span>
          </button>
          {projectName && (
            <>
              <span className="header-divider">/</span>
              <span className="header-project-name">{projectName}</span>
            </>
          )}
        </div>

        <div className="header-right">
          <button className="btn btn-ghost btn-sm" onClick={onGoProjects}>
            My Projects
          </button>
          {isPro ? (
            <span className="pro-badge">Pro</span>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onShowPricing}>
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
