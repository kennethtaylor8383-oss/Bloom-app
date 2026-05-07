const HIGHLIGHTS = [
  { icon: '⚡', text: '3 parts free — no signup' },
  { icon: '📊', text: 'Instant tariff exposure analysis' },
  { icon: '🌍', text: '14 countries + 10 categories' },
];

const HOW_STEPS = [
  { n: '1', title: 'Add your parts', desc: 'Enter each item from your bill of materials — part name, country of origin, category, cost, and annual volume.' },
  { n: '2', title: 'Instant calculation', desc: 'TariffIQ applies current US tariff rates to estimate your total tariff exposure and landed cost.' },
  { n: '3', title: 'Act on insights', desc: 'See risk levels for each part, identify high-exposure items, and explore alternative sourcing with Pro.' },
];

export default function LandingView({ onStart, hasItems, onResume }) {
  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Tariff & Supply Chain Intelligence</div>
          <h1 className="hero-headline">
            Know exactly what US tariffs<br className="hero-br" /> are costing your business
          </h1>
          <p className="hero-sub">
            Calculate your tariff exposure in minutes. Enter your bill of materials and get an instant
            breakdown of tariff costs, landed costs, and supply chain risk — no spreadsheet needed.
          </p>

          <div className="hero-ctas">
            <button className="btn btn-primary btn-lg" onClick={onStart}>
              Start Free Analysis →
            </button>
            {hasItems && (
              <button className="btn btn-ghost btn-lg" onClick={onResume}>
                Resume previous session
              </button>
            )}
          </div>

          <div className="hero-highlights">
            {HIGHLIGHTS.map(h => (
              <span key={h.text} className="highlight-pill">
                <span>{h.icon}</span> {h.text}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-header">
              <span className="preview-title">Annual Tariff Exposure</span>
              <span className="preview-badge-high">High Risk</span>
            </div>
            <div className="preview-amount">$284,750</div>
            <div className="preview-sub">+147% above pre-tariff COGS</div>
            <div className="preview-bars">
              <div className="preview-bar-row">
                <span>PCB Assembly (China)</span>
                <div className="preview-bar-track">
                  <div className="preview-bar-fill preview-bar-red" style={{ width: '85%' }} />
                </div>
                <span className="preview-bar-pct">145%</span>
              </div>
              <div className="preview-bar-row">
                <span>Steel Housing (Mexico)</span>
                <div className="preview-bar-track">
                  <div className="preview-bar-fill preview-bar-green" style={{ width: '0%' }} />
                </div>
                <span className="preview-bar-pct">0%</span>
              </div>
              <div className="preview-bar-row">
                <span>Connectors (Vietnam)</span>
                <div className="preview-bar-track">
                  <div className="preview-bar-fill preview-bar-yellow" style={{ width: '32%' }} />
                </div>
                <span className="preview-bar-pct">46%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="section-inner">
          <h2 className="section-title">How it works</h2>
          <div className="how-steps">
            {HOW_STEPS.map(s => (
              <div key={s.n} className="how-step">
                <div className="step-number">{s.n}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="disclaimer-section">
        <div className="section-inner">
          <p className="disclaimer-text">
            ⚠️ <strong>Disclaimer:</strong> Tariff rates shown are approximate estimates based on
            publicly available data as of May 2025, including Section 301, Section 232, and announced
            reciprocal tariff rates. Many rates are subject to ongoing negotiations, exemptions, and
            country-specific agreements. Always verify current rates with official CBP/USITC sources
            or a licensed customs broker before making sourcing decisions. TariffIQ is not a legal or
            customs compliance tool.
          </p>
        </div>
      </section>
    </main>
  );
}
