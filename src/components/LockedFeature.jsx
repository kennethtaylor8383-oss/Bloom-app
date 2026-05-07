export default function LockedFeature({ children, onUnlock, label = 'Unlock Full Analysis' }) {
  return (
    <div className="locked-wrapper">
      <div className="locked-blur" aria-hidden="true">
        {children}
      </div>
      <div className="locked-overlay">
        <div className="locked-content">
          <span className="locked-icon">🔒</span>
          <p className="locked-title">Pro Feature</p>
          <p className="locked-desc">Available on paid plans</p>
          <button className="btn btn-primary" onClick={onUnlock}>
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
