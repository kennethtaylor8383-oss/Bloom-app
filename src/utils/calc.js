import { getTariffRate } from '../data/tariffs.js';

export function calcItem(item) {
  const rate = getTariffRate(item.country, item.category) / 100;
  const unitCost = parseFloat(item.unitCost) || 0;
  const volume = parseInt(item.annualVolume, 10) || 0;

  const tariffPerUnit = unitCost * rate;
  const landedPerUnit = unitCost + tariffPerUnit;
  const annualBaseCost = unitCost * volume;
  const annualTariffCost = tariffPerUnit * volume;
  const annualLandedCost = landedPerUnit * volume;
  const tariffRatePct = rate * 100;

  // Risk based on tariff as % of unit cost
  let risk;
  if (tariffRatePct === 0)       risk = 'none';
  else if (tariffRatePct < 10)   risk = 'low';
  else if (tariffRatePct < 50)   risk = 'medium';
  else                           risk = 'high';

  return {
    ...item,
    tariffRatePct,
    tariffPerUnit,
    landedPerUnit,
    annualBaseCost,
    annualTariffCost,
    annualLandedCost,
    risk,
  };
}

export function calcTotals(items) {
  const calculated = items.map(calcItem);
  const totalBase    = calculated.reduce((s, i) => s + i.annualBaseCost,    0);
  const totalTariff  = calculated.reduce((s, i) => s + i.annualTariffCost,  0);
  const totalLanded  = calculated.reduce((s, i) => s + i.annualLandedCost,  0);
  const exposurePct  = totalBase > 0 ? (totalTariff / totalBase) * 100 : 0;

  let overallRisk;
  if (exposurePct === 0)       overallRisk = 'none';
  else if (exposurePct < 10)   overallRisk = 'low';
  else if (exposurePct < 30)   overallRisk = 'medium';
  else                         overallRisk = 'high';

  return { calculated, totalBase, totalTariff, totalLanded, exposurePct, overallRisk };
}

// What-if: recalculate a single item with a different country
export function calcWhatIf(item, newCountry) {
  return calcItem({ ...item, country: newCountry });
}

const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const USD_COMPACT = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 });
const PCT = new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 1 });

export const fmt = {
  currency: v => USD.format(v),
  compact:  v => USD_COMPACT.format(v),
  pct:      v => PCT.format(v) + '%',
  number:   v => new Intl.NumberFormat('en-US').format(v),
};
