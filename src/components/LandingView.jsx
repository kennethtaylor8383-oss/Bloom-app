import { FREE_PROJECT_LIMIT } from '../App.jsx';
import { calcTotals } from '../utils/calc.js';
import { fmt } from '../utils/calc.js';

const HIGHLIGHTS = [
  { icon: '⚡', text: '3 parts free — no signup' },
  { icon: '📊', text: 'Instant tariff exposure analysis' },
  { icon: '🌍', text: '14 countries + 10 categories' },
];

const HOW_STEPS = [
  { n: '1', title: 'Add your parts', desc: 'Enter each item from your bill of materials — part name, country of origin, HTS code or category, unit cost, and annual volume.' },
  { n: '2', title: 'Instant calculation', desc: 'TariffIQ applies current US tariff rates to estimate your total tariff exposure and landed cost per part.' },
  { n: '3', title: 'Act on insights', desc: 'See risk levels for each part, compare sourcing alternatives, and share results with your team (Pro).' },
];

function ProjectCard({ project, onOpen, onDelete }) {
  const { totalTariff, totalBase, overallRisk } = project.items.length > 0
    ? calcTotals(project.items)
    : { totalTariff: 0, totalBase: 0, overallRisk: 'none' };

  const riskColors = { none: '#64748b', low: '#16a34a', medium: '#d97706', high: '#dc2626' };

  return (
    <div className="project-card">
      <div className="project-card-body" onClick={() => onOpen(project.id)} role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onOpen(project.id)}>
        <div className="project-card-header">
          <span className="project-name">{project.name}</span>
          <span className="project-risk-dot" style={{ background: riskColors[overallRisk] }} />
        </div>
        <div className="project-meta">
          {project.items.length} part{project.items.length !== 1 ? 's' : ''}
          {totalBase > 0 && (
            <> · {fmt.compact(totalTariff)} tariff exposure</>
          )}
        </div>
        <div className="project-date">
          Updated {new Date(project.updatedAt).toLocaleDateString()}
        </div>
      </div>
      <button className="project-delete" onClick={e => { e.stopPropagation(); onDelete(project.id); }}
        aria-label="Delete project">✕</button>
    </div>
  );
}

export default function LandingView({ onStart, projects, isPro, onOpenProject, onDeleteProject, onNewProject }) {
  const hasProjects = projects.some(p => p.items.length > 0);
  const canAddProject = isPro || projects.length < FREE_PROJECT_LIMIT;

  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-inner">
          <div>
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
        </div>
      </section>

      {/* Projects section */}
      {hasProjects && (
        <section className="projects-section">
          <div className="section-inner">
            <div className="projects-header">
              <div>
                <h2 className="section-title-left">My Projects</h2>
                <p className="section-sub-left">Pick up where you left off</p>
              </div>
              <button
                className={`btn ${canAddProject ? 'btn-secondary' : 'btn-outline'}`}
                onClick={onNewProject}
              >
                {canAddProject ? '+ New Analysis' : '🔒 New Project (Pro)'}
              </button>
            </div>
            <div className="projects-grid">
              {projects.map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={onOpenProject}
                  onDelete={onDeleteProject}
                />
              ))}
            </div>
          </div>
        </section>
      )}

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
            or a licensed customs broker before making sourcing decisions.
          </p>
        </div>
      </section>
    </main>
  );
}
