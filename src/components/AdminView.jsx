import { useState } from 'react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'tariffiq2025';
const FORMSPREE_ID   = import.meta.env.VITE_FORMSPREE_ID  || null;

function StatCard({ label, value, sub }) {
  return (
    <div className="admin-stat">
      <p className="admin-stat-label">{label}</p>
      <p className="admin-stat-value">{value}</p>
      {sub && <p className="admin-stat-sub">{sub}</p>}
    </div>
  );
}

export default function AdminView({ onExit }) {
  const [authed, setAuthed]   = useState(() => sessionStorage.getItem('tiq_admin') === '1');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState(false);

  const signups = (() => {
    try { return JSON.parse(localStorage.getItem('tariffiq_waitlist') || '[]'); }
    catch { return []; }
  })();

  function login(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('tiq_admin', '1');
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password.');
    }
  }

  function logout() {
    sessionStorage.removeItem('tiq_admin');
    setAuthed(false);
    setPassword('');
  }

  function copyEmails() {
    const text = signups.map(s => s.email).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  // ── Login gate ───────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="admin-backdrop">
        <div className="admin-login-card">
          <div className="admin-logo">
            <span className="logo-mark">IQ</span>
            <span className="logo-text">Tariff<strong>IQ</strong> <span className="admin-tag">Admin</span></span>
          </div>
          <h1 className="admin-login-title">Sign in to Admin</h1>
          <form className="admin-login-form" onSubmit={login}>
            <input
              className="form-input"
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p className="admin-error">{error}</p>}
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
              Sign In
            </button>
          </form>
          <p className="admin-login-hint">
            Default password: <code>tariffiq2025</code><br />
            Set <code>VITE_ADMIN_PASSWORD</code> in Vercel env vars to change it.
          </p>
          <button className="link-btn" style={{ marginTop: 16, fontSize: 13 }} onClick={onExit}>
            ← Back to app
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────

  const todaySignups = signups.filter(s => {
    const d = new Date(s.ts);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const latestSignup = signups.length > 0
    ? new Date(Math.max(...signups.map(s => s.ts))).toLocaleDateString()
    : '—';

  return (
    <div className="admin-view">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-logo">
            <span className="logo-mark">IQ</span>
            <span className="logo-text">Tariff<strong>IQ</strong> <span className="admin-tag">Admin</span></span>
          </div>
          <div className="admin-header-actions">
            <button className="btn btn-ghost btn-sm" onClick={onExit}>← Back to app</button>
            <button className="btn btn-outline btn-sm" onClick={logout}>Sign out</button>
          </div>
        </div>
      </header>

      <div className="admin-body">

        {/* Formspree setup banner */}
        {!FORMSPREE_ID && (
          <div className="admin-banner admin-banner-warn">
            <div>
              <strong>⚠️ Formspree not connected</strong> — Waitlist emails are only saved in each
              visitor's browser. You can't see signups from other devices until you connect Formspree.
            </div>
            <div className="admin-banner-steps">
              <p><strong>To fix this in 5 minutes:</strong></p>
              <ol>
                <li>Create a free account at <strong>formspree.io</strong></li>
                <li>Create a new form — copy the Form ID (e.g. <code>xpwzgkdr</code>)</li>
                <li>In Vercel → your project → Settings → Environment Variables, add:<br />
                  <code>VITE_FORMSPREE_ID = your-form-id</code></li>
                <li>Redeploy — every waitlist signup will now email you instantly</li>
              </ol>
            </div>
          </div>
        )}

        {FORMSPREE_ID && (
          <div className="admin-banner admin-banner-success">
            ✓ Formspree connected — all waitlist signups are emailed to you automatically.
            View full history at <strong>formspree.io/forms/{FORMSPREE_ID}</strong>
          </div>
        )}

        {/* Stats */}
        <div className="admin-stats">
          <StatCard label="Total Waitlist Signups" value={signups.length} sub="collected in this browser" />
          <StatCard label="Today" value={todaySignups} sub="new signups" />
          <StatCard label="Latest Signup" value={latestSignup} />
        </div>

        {/* Waitlist table */}
        <div className="admin-section">
          <div className="admin-section-header">
            <div>
              <h2 className="admin-section-title">Waitlist Signups</h2>
              <p className="admin-section-sub">
                {FORMSPREE_ID
                  ? 'Showing signups collected in this browser. Full list is in your Formspree dashboard.'
                  : 'Showing signups collected in this browser only. Connect Formspree to capture everyone.'}
              </p>
            </div>
            {signups.length > 0 && (
              <button className="btn btn-secondary btn-sm" onClick={copyEmails}>
                {copied ? '✓ Copied!' : 'Copy all emails'}
              </button>
            )}
          </div>

          {signups.length === 0 ? (
            <div className="admin-empty">
              No signups collected in this browser yet.
              {!FORMSPREE_ID && ' Connect Formspree to start capturing leads from all visitors.'}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="results-table admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[...signups].reverse().map((s, i) => {
                    const d = new Date(s.ts);
                    return (
                      <tr key={s.ts}>
                        <td className="admin-row-num">{signups.length - i}</td>
                        <td><strong>{s.email}</strong></td>
                        <td>{d.toLocaleDateString()}</td>
                        <td>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Setup guide */}
        <div className="admin-section admin-guide">
          <h2 className="admin-section-title">Next Steps</h2>
          <div className="admin-guide-grid">
            <div className="admin-guide-card">
              <span className="guide-num">1</span>
              <h3>Connect Formspree</h3>
              <p>Get real-time email notifications for every waitlist signup — free up to 50/mo.</p>
              <p><code>VITE_FORMSPREE_ID=your-id</code> in Vercel env vars</p>
            </div>
            <div className="admin-guide-card">
              <span className="guide-num">2</span>
              <h3>Change admin password</h3>
              <p>Set a strong password before sharing the app publicly.</p>
              <p><code>VITE_ADMIN_PASSWORD=your-password</code> in Vercel env vars</p>
            </div>
            <div className="admin-guide-card">
              <span className="guide-num">3</span>
              <h3>Add Stripe (when ready)</h3>
              <p>Once you have 20+ waitlist signups, add Stripe payments to unlock the Pro tier for real users.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
