import { useState } from 'react';
import RiskBadge from './RiskBadge.jsx';
import LockedFeature from './LockedFeature.jsx';
import { calcTotals, calcWhatIf, fmt } from '../utils/calc.js';
import { COUNTRIES, CATEGORIES, getAlternatives } from '../data/tariffs.js';

function SummaryCard({ label, value, sub, accent }) {
  return (
    <div className={`summary-card ${accent ? `summary-card-${accent}` : ''}`}>
      <p className="summary-label">{label}</p>
      <p className="summary-value">{value}</p>
      {sub && <p className="summary-sub">{sub}</p>}
    </div>
  );
}

function RiskMeter({ pct, risk }) {
  const width = Math.min(pct, 100);
  return (
    <div className="risk-meter">
      <div className="risk-meter-track">
        <div
          className={`risk-meter-fill risk-meter-${risk}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="risk-meter-labels">
        <span>0%</span>
        <span>50%</span>
        <span>100%+</span>
      </div>
    </div>
  );
}

function WhatIfRow({ item, isPro, onShowPricing }) {
  const [altCountry, setAltCountry] = useState(item.country);
  const original = item;
  const alternate = calcWhatIf(item, altCountry);
  const savings = original.annualTariffCost - alternate.annualTariffCost;

  if (!isPro) {
    return (
      <tr className="whatif-row locked-row">
        <td>{item.partName}</td>
        <td colSpan={4}>
          <button className="lock-inline-btn" onClick={() => onShowPricing('feature')}>
            🔒 Unlock What-If Scenarios — Pro Feature
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="whatif-row">
      <td>{item.partName}</td>
      <td>
        <select
          className="form-select form-select-sm"
          value={altCountry}
          onChange={e => setAltCountry(e.target.value)}
        >
          {Object.entries(COUNTRIES).map(([k, { label, flag }]) => (
            <option key={k} value={k}>{flag} {label}</option>
          ))}
        </select>
      </td>
      <td>{fmt.compact(original.annualTariffCost)}</td>
      <td>{fmt.compact(alternate.annualTariffCost)}</td>
      <td className={savings > 0 ? 'text-success' : savings < 0 ? 'text-danger' : ''}>
        {savings > 0 ? `Save ${fmt.compact(savings)}` : savings < 0 ? `+${fmt.compact(Math.abs(savings))}` : '—'}
      </td>
    </tr>
  );
}

function AltSourcingRow({ item, isPro, onShowPricing }) {
  if (!isPro) return null;
  const alts = getAlternatives(item.country, item.category);
  if (!alts.length) return null;

  return (
    <div className="alt-row">
      <div className="alt-row-header">
        <strong>{item.partName}</strong>
        <span className="alt-row-current">
          Currently: {COUNTRIES[item.country]?.flag} {COUNTRIES[item.country]?.label} @ {item.tariffRatePct}%
        </span>
      </div>
      <div className="alt-chips">
        {alts.map(a => (
          <div key={a.country} className={`alt-chip ${a.rate === 0 ? 'alt-chip-green' : a.rate < 30 ? 'alt-chip-yellow' : 'alt-chip-neutral'}`}>
            <span>{a.flag} {a.label}</span>
            <span className="alt-chip-rate">{a.rate}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsView({ items, isPro, onAddMore, onShowPricing, onBack }) {
  const { calculated, totalBase, totalTariff, totalLanded, exposurePct, overallRisk } = calcTotals(items);
  const [showAlt, setShowAlt] = useState(false);

  if (!items.length) {
    return (
      <main className="results-view">
        <div className="view-inner">
          <p>No items to display. <button className="link-btn" onClick={onBack}>Add parts</button></p>
        </div>
      </main>
    );
  }

  return (
    <main className="results-view">
      <div className="view-inner">
        {/* Header */}
        <div className="view-header">
          <button className="back-link" onClick={onBack}>← Edit BOM</button>
          <div>
            <h1 className="view-title">Tariff Impact Analysis</h1>
            <p className="view-sub">Based on {items.length} part{items.length !== 1 ? 's' : ''} · Rates as of May 2025</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={onAddMore}>Add Parts</button>
            {isPro ? (
              <>
                <button className="btn btn-outline" onClick={() => alert('PDF export — coming soon!')}>Export PDF</button>
                <button className="btn btn-outline" onClick={() => alert('CSV export — coming soon!')}>Export CSV</button>
              </>
            ) : (
              <button className="btn btn-outline" onClick={() => onShowPricing('feature')}>
                🔒 Export
              </button>
            )}
          </div>
        </div>

        {/* Summary cards */}
        <div className="summary-grid">
          <SummaryCard
            label="Pre-Tariff Annual Cost"
            value={fmt.compact(totalBase)}
            sub={`${fmt.currency(totalBase / items.length)} avg per part`}
          />
          <SummaryCard
            label="Annual Tariff Exposure"
            value={fmt.compact(totalTariff)}
            sub={`${fmt.pct(exposurePct)} of COGS`}
            accent={overallRisk}
          />
          <SummaryCard
            label="Total Landed Cost"
            value={fmt.compact(totalLanded)}
            sub={`${fmt.pct(exposurePct > 0 ? ((totalLanded / totalBase) - 1) * 100 : 0)} above pre-tariff`}
          />
        </div>

        {/* Risk gauge */}
        <div className="risk-section">
          <div className="risk-section-header">
            <div>
              <h2 className="risk-title">Overall Tariff Exposure</h2>
              <p className="risk-sub">Tariff cost as a percentage of COGS</p>
            </div>
            <RiskBadge risk={overallRisk} size="lg" />
          </div>
          <RiskMeter pct={exposurePct} risk={overallRisk} />
          <p className="risk-note">
            Tariffs represent <strong>{fmt.pct(exposurePct)}</strong> of your pre-tariff cost of goods.
            {overallRisk === 'high' && ' This is a significant exposure — consider reviewing your sourcing strategy.'}
            {overallRisk === 'medium' && ' This is a moderate exposure worth monitoring.'}
            {overallRisk === 'low' && ' Your tariff exposure is relatively low.'}
            {overallRisk === 'none' && ' No tariff exposure detected on these parts.'}
          </p>
        </div>

        {/* Line item breakdown */}
        <div className="results-section">
          <h2 className="section-heading">Part-by-Part Breakdown</h2>
          <div className="table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Part</th>
                  <th>Origin</th>
                  <th>Category</th>
                  <th>Tariff Rate</th>
                  <th>Unit Cost</th>
                  <th>Landed Cost</th>
                  <th>Annual Volume</th>
                  <th>Annual Tariff</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {calculated.map(item => (
                  <tr key={item.id}>
                    <td className="td-part">
                      <span className="part-name">{item.partName}</span>
                      {item.htsCode && <span className="part-hts">{item.htsCode}</span>}
                    </td>
                    <td>{COUNTRIES[item.country]?.flag} {COUNTRIES[item.country]?.label}</td>
                    <td>{CATEGORIES[item.category]?.label}</td>
                    <td className={`td-rate ${item.risk === 'high' ? 'text-danger' : item.risk === 'medium' ? 'text-warn' : 'text-success'}`}>
                      {item.tariffRatePct}%
                    </td>
                    <td>{fmt.currency(item.unitCost)}</td>
                    <td>{fmt.currency(item.landedPerUnit)}</td>
                    <td>{fmt.number(item.annualVolume)}</td>
                    <td className="td-tariff">{fmt.compact(item.annualTariffCost)}</td>
                    <td><RiskBadge risk={item.risk} /></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-total">
                  <td colSpan={4}><strong>Total</strong></td>
                  <td />
                  <td />
                  <td />
                  <td><strong>{fmt.compact(totalTariff)}</strong></td>
                  <td><RiskBadge risk={overallRisk} /></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* What-If Scenario */}
        <div className="results-section">
          <h2 className="section-heading">What-If Scenario Analysis</h2>
          <p className="section-sub">Estimate savings by switching supplier countries for each part.</p>

          {isPro ? (
            <div className="table-wrapper">
              <table className="results-table whatif-table">
                <thead>
                  <tr>
                    <th>Part</th>
                    <th>Switch Source To</th>
                    <th>Current Tariff</th>
                    <th>New Tariff</th>
                    <th>Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {calculated.map(item => (
                    <WhatIfRow key={item.id} item={item} isPro={isPro} onShowPricing={onShowPricing} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <LockedFeature onUnlock={() => onShowPricing('feature')} label="Unlock What-If Modeling">
              <div className="table-wrapper">
                <table className="results-table whatif-table">
                  <thead>
                    <tr>
                      <th>Part</th>
                      <th>Switch Source To</th>
                      <th>Current Tariff</th>
                      <th>New Tariff</th>
                      <th>Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculated.map(item => (
                      <tr key={item.id}>
                        <td>{item.partName}</td>
                        <td><span className="placeholder-text">—</span></td>
                        <td>{fmt.compact(item.annualTariffCost)}</td>
                        <td><span className="placeholder-text">—</span></td>
                        <td><span className="placeholder-text">—</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </LockedFeature>
          )}
        </div>

        {/* Alternative Sourcing */}
        <div className="results-section">
          <h2 className="section-heading">Alternative Sourcing Recommendations</h2>
          <p className="section-sub">Lower-tariff countries for each part based on current rates.</p>

          {isPro ? (
            <div className="alt-sourcing-list">
              {calculated.map(item => (
                <AltSourcingRow key={item.id} item={item} isPro={isPro} onShowPricing={onShowPricing} />
              ))}
            </div>
          ) : (
            <LockedFeature onUnlock={() => onShowPricing('feature')} label="Unlock Sourcing Recommendations">
              <div className="alt-sourcing-list alt-sourcing-placeholder">
                {calculated.map(item => (
                  <div key={item.id} className="alt-row">
                    <div className="alt-row-header">
                      <strong>{item.partName}</strong>
                    </div>
                    <div className="alt-chips">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="alt-chip alt-chip-placeholder">
                          <span>— Country</span>
                          <span className="alt-chip-rate">—%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </LockedFeature>
          )}
        </div>

        {/* Export section */}
        {!isPro && (
          <div className="results-section">
            <LockedFeature onUnlock={() => onShowPricing('feature')} label="Unlock PDF & CSV Export">
              <div className="export-placeholder">
                <button className="btn btn-outline" disabled>Export to PDF</button>
                <button className="btn btn-outline" disabled>Export to CSV</button>
                <button className="btn btn-outline" disabled>Save Project</button>
              </div>
            </LockedFeature>
          </div>
        )}

        {/* Disclaimer */}
        <div className="results-disclaimer">
          ⚠️ Rates are approximate estimates based on publicly available data (May 2025). Verify with
          official CBP/USITC sources before making sourcing or purchasing decisions.
        </div>
      </div>
    </main>
  );
}
