import { useState } from 'react';
import ItemForm from './ItemForm.jsx';
import RiskBadge from './RiskBadge.jsx';
import { COUNTRIES, CATEGORIES } from '../data/tariffs.js';
import { calcItem, fmt } from '../utils/calc.js';
import { FREE_ITEM_LIMIT } from '../App.jsx';

export default function InputView({ project, items, isPro, onAddItem, onRemoveItem, onRenameProject, onViewResults, onShowPricing, onBack }) {
  const [showForm, setShowForm] = useState(items.length === 0);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(project?.name ?? 'New Analysis');
  const atLimit = !isPro && items.length >= FREE_ITEM_LIMIT;

  function handleSave(item) {
    const added = onAddItem(item);
    if (added !== false) setShowForm(false);
  }

  function handleAddAnother() {
    if (atLimit) onShowPricing('limit');
    else setShowForm(true);
  }

  function commitName() {
    if (nameValue.trim()) onRenameProject(nameValue.trim());
    setEditingName(false);
  }

  return (
    <main className="input-view">
      <div className="view-inner">
        {/* Page header */}
        <div className="view-header">
          <button className="back-link" onClick={onBack}>← Projects</button>
          <div className="view-title-group">
            {editingName ? (
              <input
                className="project-name-input"
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                onBlur={commitName}
                onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') setEditingName(false); }}
                autoFocus
              />
            ) : (
              <h1 className="view-title view-title-editable" onClick={() => { setNameValue(project?.name ?? ''); setEditingName(true); }}>
                {project?.name ?? 'New Analysis'} <span className="edit-icon">✏️</span>
              </h1>
            )}
            <p className="view-sub">
              {isPro
                ? `${items.length} part${items.length !== 1 ? 's' : ''} added`
                : `${items.length} of ${FREE_ITEM_LIMIT} free parts added`}
            </p>
          </div>
          {items.length > 0 && (
            <button className="btn btn-primary" onClick={onViewResults}>
              View Results →
            </button>
          )}
        </div>

        {/* Free tier progress bar */}
        {!isPro && (
          <div className="tier-bar">
            <div className="tier-bar-track">
              <div className="tier-bar-fill" style={{ width: `${(items.length / FREE_ITEM_LIMIT) * 100}%` }} />
            </div>
            <span className="tier-bar-label">
              {atLimit ? (
                <>Free limit reached. <button className="link-btn" onClick={() => onShowPricing('limit')}>Upgrade for unlimited parts →</button></>
              ) : (
                `${FREE_ITEM_LIMIT - items.length} free part${FREE_ITEM_LIMIT - items.length !== 1 ? 's' : ''} remaining`
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
                      <button className="item-remove" onClick={() => onRemoveItem(item.id)} aria-label="Remove">✕</button>
                    </div>
                    <div className="item-meta">
                      <span>{COUNTRIES[item.country]?.flag} {COUNTRIES[item.country]?.label}</span>
                      <span className="dot">·</span>
                      <span>{CATEGORIES[item.category]?.label}</span>
                      {item.htsCode && <><span className="dot">·</span><span className="hts-label">{item.htsCode}</span></>}
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
                        <span className="num-label">Landed/Unit</span>
                        <span className="num-value">{fmt.currency(calc.landedPerUnit)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="list-actions">
                <button className={`btn ${atLimit ? 'btn-outline' : 'btn-secondary'}`} onClick={handleAddAnother}>
                  {atLimit ? '🔒 Add More (Pro)' : '+ Add Another Part'}
                </button>
                <button className="btn btn-primary" onClick={onViewResults}>
                  Calculate Full Impact →
                </button>
              </div>
            </div>
          )}

          {/* Form panel */}
          {showForm && !atLimit && (
            <div className="form-panel">
              <h2 className="form-panel-title">
                {items.length === 0 ? 'Add your first part' : 'Add another part'}
              </h2>
              <ItemForm onSave={handleSave} onCancel={items.length > 0 ? () => setShowForm(false) : null} />
            </div>
          )}

          {items.length === 0 && !showForm && (
            <div className="empty-state">
              <p>No parts added yet.</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>Add First Part</button>
            </div>
          )}

          {atLimit && !showForm && (
            <div className="upgrade-prompt">
              <div className="upgrade-icon">🔒</div>
              <h3>Unlock Unlimited Parts</h3>
              <p>You've added {FREE_ITEM_LIMIT} parts on the free plan. Upgrade to Pro to analyze your full BOM.</p>
              <button className="btn btn-primary" onClick={() => onShowPricing('limit')}>Unlock Full Analysis</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
