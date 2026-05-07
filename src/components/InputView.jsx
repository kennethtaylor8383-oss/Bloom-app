import { useState } from 'react';
import ItemForm from './ItemForm.jsx';
import RiskBadge from './RiskBadge.jsx';
import { COUNTRIES, CATEGORIES } from '../data/tariffs.js';
import { calcItem, fmt } from '../utils/calc.js';

const FREE_LIMIT = 3;

export default function InputView({ items, isPro, onAddItem, onRemoveItem, onViewResults, onShowPricing, onBack }) {
  const [showForm, setShowForm] = useState(items.length === 0);
  const atLimit = !isPro && items.length >= FREE_LIMIT;

  function handleSave(item) {
    const added = onAddItem(item);
    if (added !== false) {
      setShowForm(false);
    }
  }

  function handleAddAnother() {
    if (atLimit) {
      onShowPricing('limit');
    } else {
      setShowForm(true);
    }
  }

  return (
    <main className="input-view">
      <div className="view-inner">
        {/* Page header */}
        <div className="view-header">
          <button className="back-link" onClick={onBack}>← Back</button>
          <div>
            <h1 className="view-title">Bill of Materials</h1>
            <p className="view-sub">
              {isPro
                ? `${items.length} part${items.length !== 1 ? 's' : ''} added`
                : `${items.length} of ${FREE_LIMIT} free parts added`}
            </p>
          </div>
          {items.length > 0 && (
            <button className="btn btn-primary" onClick={onViewResults}>
              View Results →
            </button>
          )}
        </div>

        {/* Free tier progress */}
        {!isPro && (
          <div className="tier-bar">
            <div className="tier-bar-track">
              <div
                className="tier-bar-fill"
                style={{ width: `${(items.length / FREE_LIMIT) * 100}%` }}
              />
            </div>
            <span className="tier-bar-label">
              {atLimit ? (
                <>
                  Free limit reached.{' '}
                  <button className="link-btn" onClick={() => onShowPricing('limit')}>
                    Upgrade for unlimited parts →
                  </button>
                </>
              ) : (
                `${FREE_LIMIT - items.length} free part${FREE_LIMIT - items.length !== 1 ? 's' : ''} remaining`
              )}
            </span>
          </div>
        )}

        <div className="input-layout">
          {/* Item list */}
          {items.length > 0 && (
            <div className="item-list">
              <h2 className="list-title">Parts in BOM</h2>
              {items.map(item => {
                const calc = calcItem(item);
                return (
                  <div key={item.id} className="item-card">
                    <div className="item-card-header">
                      <div className="item-name-row">
                        <span className="item-name">{item.partName}</span>
                        <RiskBadge risk={calc.risk} />
                      </div>
                      <button
                        className="item-remove"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label="Remove part"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="item-meta">
                      <span>{COUNTRIES[item.country]?.flag} {COUNTRIES[item.country]?.label}</span>
                      <span className="dot">·</span>
                      <span>{CATEGORIES[item.category]?.label}</span>
                    </div>
                    <div className="item-numbers">
                      <div className="item-num">
                        <span className="num-label">Tariff Rate</span>
                        <span className={`num-value ${calc.risk === 'high' ? 'text-danger' : calc.risk === 'medium' ? 'text-warn' : 'text-success'}`}>
                          {calc.tariffRatePct}%
                        </span>
                      </div>
                      <div className="item-num">
                        <span className="num-label">Annual Tariff</span>
                        <span className="num-value">{fmt.compact(calc.annualTariffCost)}</span>
                      </div>
                      <div className="item-num">
                        <span className="num-label">Landed Cost/Unit</span>
                        <span className="num-value">{fmt.currency(calc.landedPerUnit)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="list-actions">
                <button
                  className={`btn ${atLimit ? 'btn-outline' : 'btn-secondary'}`}
                  onClick={handleAddAnother}
                >
                  {atLimit ? '🔒 Add More (Pro)' : '+ Add Another Part'}
                </button>
                <button className="btn btn-primary" onClick={onViewResults}>
                  Calculate Full Impact →
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          {showForm && !atLimit && (
            <div className="form-panel">
              <h2 className="form-panel-title">
                {items.length === 0 ? 'Add your first part' : 'Add another part'}
              </h2>
              <ItemForm
                onSave={handleSave}
                onCancel={items.length > 0 ? () => setShowForm(false) : null}
              />
            </div>
          )}

          {/* Empty state */}
          {items.length === 0 && !showForm && (
            <div className="empty-state">
              <p>No parts added yet.</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Add First Part
              </button>
            </div>
          )}

          {/* Upgrade prompt when at limit and form is hidden */}
          {atLimit && !showForm && (
            <div className="upgrade-prompt">
              <div className="upgrade-icon">🔒</div>
              <h3>Unlock Unlimited Parts</h3>
              <p>You've added {FREE_LIMIT} parts on the free plan. Upgrade to Pro to analyze your full BOM.</p>
              <button className="btn btn-primary" onClick={() => onShowPricing('limit')}>
                Unlock Full Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
