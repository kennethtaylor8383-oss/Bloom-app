import { useState } from 'react';

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID || null;

const PLANS = [
  {
    name: 'Starter',
    price: '$19',
    period: '/mo',
    highlight: false,
    features: [
      'Unlimited BOM line items',
      'Save & reload projects',
      'PDF & CSV export',
      'Alternative sourcing suggestions',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/mo',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Everything in Starter',
      'What-if scenario modeling',
      'Tariff rate change alerts',
      'Shareable results links',
      'Priority support',
    ],
  },
];

export default function PricingModal({ onClose, trigger }) {
  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [formError, setFormError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    setFormError('');

    // Always save locally so admin panel can show it
    try {
      const existing = JSON.parse(localStorage.getItem('tariffiq_waitlist') || '[]');
      localStorage.setItem('tariffiq_waitlist', JSON.stringify([
        ...existing,
        { email, ts: Date.now() },
      ]));
    } catch {}

    // Submit to Formspree if configured
    if (FORMSPREE_ID) {
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email, _subject: 'TariffIQ Waitlist Signup' }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setFormError(data?.errors?.[0]?.message || 'Submission failed — try again.');
          setLoading(false);
          return;
        }
      } catch {
        // Network error — local save already happened, still count as success
      }
    }

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {trigger === 'limit' && (
          <div className="modal-trigger-banner">
            You've reached the 3-item free tier limit
          </div>
        )}

        <div className="modal-header">
          <h2 className="modal-title">Unlock TariffIQ Pro</h2>
          <p className="modal-subtitle">
            Get unlimited BOM analysis, scenario modeling, and real-time tariff alerts.
          </p>
        </div>

        <div className="pricing-grid">
          {PLANS.map(plan => (
            <div key={plan.name} className={`pricing-card ${plan.highlight ? 'pricing-card-featured' : ''}`}>
              {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-price">
                {plan.price}<span className="pricing-period">{plan.period}</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map(f => (
                  <li key={f}>
                    <span className="feature-check">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="waitlist-section">
          <div className="waitlist-banner">
            <span className="waitlist-tag">Coming Soon</span>
            <p className="waitlist-headline">
              Payments launching soon — join the waitlist for early access and a 30-day free trial.
            </p>
          </div>

          {submitted ? (
            <div className="waitlist-success">
              <span className="success-icon">✓</span>
              <div>
                <p className="success-title">You're on the list!</p>
                <p className="success-sub">We'll email you at <strong>{email}</strong> when Pro launches.</p>
              </div>
            </div>
          ) : (
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                disabled={loading}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Joining…' : 'Join Waitlist'}
              </button>
              {formError && <p className="waitlist-error">{formError}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
