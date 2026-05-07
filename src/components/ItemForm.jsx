import { useState } from 'react';
import { COUNTRIES, CATEGORIES, getTariffRate } from '../data/tariffs.js';
import { fmt } from '../utils/calc.js';

const EMPTY = {
  partName: '',
  htsCode: '',
  country: 'china',
  category: 'electronics',
  unitCost: '',
  annualVolume: '',
};

export default function ItemForm({ onSave, onCancel, initial }) {
  const [form, setForm] = useState(initial ?? EMPTY);

  const rate = getTariffRate(form.country, form.category);
  const unitCost = parseFloat(form.unitCost) || 0;
  const volume = parseInt(form.annualVolume, 10) || 0;
  const tariffPerUnit = unitCost * (rate / 100);
  const annualTariff = tariffPerUnit * volume;

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.partName || !form.unitCost || !form.annualVolume) return;
    onSave({ ...form, unitCost: parseFloat(form.unitCost), annualVolume: parseInt(form.annualVolume, 10) });
  }

  const isValid = form.partName.trim() && parseFloat(form.unitCost) > 0 && parseInt(form.annualVolume, 10) > 0;

  return (
    <form className="item-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-group form-group-wide">
          <label className="form-label" htmlFor="partName">Part / Component Name *</label>
          <input
            id="partName"
            className="form-input"
            type="text"
            placeholder="e.g. PCB Assembly, Steel Housing, Motor Controller"
            value={form.partName}
            onChange={e => set('partName', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="htsCode">HTS Code <span className="form-optional">(optional)</span></label>
          <input
            id="htsCode"
            className="form-input"
            type="text"
            placeholder="e.g. 8542.31.0001"
            value={form.htsCode}
            onChange={e => set('htsCode', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="country">Country of Origin *</label>
          <select
            id="country"
            className="form-select"
            value={form.country}
            onChange={e => set('country', e.target.value)}
          >
            {Object.entries(COUNTRIES).map(([key, { label, flag }]) => (
              <option key={key} value={key}>{flag} {label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">Product Category *</label>
          <select
            id="category"
            className="form-select"
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {Object.entries(CATEGORIES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="unitCost">Unit Cost (USD) *</label>
          <div className="input-prefix-wrap">
            <span className="input-prefix">$</span>
            <input
              id="unitCost"
              className="form-input input-with-prefix"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.unitCost}
              onChange={e => set('unitCost', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="annualVolume">Annual Volume (units) *</label>
          <input
            id="annualVolume"
            className="form-input"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 10000"
            value={form.annualVolume}
            onChange={e => set('annualVolume', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Live preview */}
      {isValid && (
        <div className="form-preview">
          <div className="form-preview-row">
            <span>Applied tariff rate</span>
            <strong className={rate > 50 ? 'text-danger' : rate > 10 ? 'text-warn' : 'text-success'}>
              {rate}%
            </strong>
          </div>
          <div className="form-preview-row">
            <span>Tariff cost per unit</span>
            <strong>{fmt.currency(tariffPerUnit)}</strong>
          </div>
          <div className="form-preview-row">
            <span>Landed cost per unit</span>
            <strong>{fmt.currency(unitCost + tariffPerUnit)}</strong>
          </div>
          <div className="form-preview-row form-preview-total">
            <span>Estimated annual tariff</span>
            <strong>{fmt.compact(annualTariff)}</strong>
          </div>
        </div>
      )}

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={!isValid}>
          Add Part to BOM
        </button>
      </div>
    </form>
  );
}
