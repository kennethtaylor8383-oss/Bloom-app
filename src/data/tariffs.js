// Approximate US tariff rates as of May 2025.
// China rates reflect Section 301 + reciprocal tariffs (~145% effective rate on most goods).
// USMCA-compliant Mexico/Canada goods are generally 0%.
// Reciprocal tariff rates for other countries are subject to a 90-day pause (10% baseline applies
// to most); displayed rates here reflect announced rates for reference.
// Always verify current rates with official CBP/USITC sources before making sourcing decisions.

export const COUNTRIES = {
  china:       { label: 'China',                    flag: '🇨🇳' },
  mexico:      { label: 'Mexico',                   flag: '🇲🇽' },
  canada:      { label: 'Canada',                   flag: '🇨🇦' },
  vietnam:     { label: 'Vietnam',                  flag: '🇻🇳' },
  india:       { label: 'India',                    flag: '🇮🇳' },
  taiwan:      { label: 'Taiwan',                   flag: '🇹🇼' },
  south_korea: { label: 'South Korea',              flag: '🇰🇷' },
  japan:       { label: 'Japan',                    flag: '🇯🇵' },
  thailand:    { label: 'Thailand',                 flag: '🇹🇭' },
  eu:          { label: 'European Union',           flag: '🇪🇺' },
  brazil:      { label: 'Brazil',                   flag: '🇧🇷' },
  malaysia:    { label: 'Malaysia',                 flag: '🇲🇾' },
  indonesia:   { label: 'Indonesia',                flag: '🇮🇩' },
  usa:         { label: 'United States (Domestic)', flag: '🇺🇸' },
};

export const CATEGORIES = {
  electronics:  { label: 'Electronics & Components' },
  steel_metals: { label: 'Steel, Aluminum & Metals' },
  machinery:    { label: 'Industrial Machinery & Equipment' },
  auto_parts:   { label: 'Auto Parts & Vehicles' },
  textiles:     { label: 'Textiles, Apparel & Footwear' },
  chemicals:    { label: 'Chemicals & Plastics' },
  furniture:    { label: 'Furniture & Fixtures' },
  medical:      { label: 'Medical Devices & Supplies' },
  food_ag:      { label: 'Food & Agricultural Products' },
  general:      { label: 'General Manufacturing' },
};

// Tariff rate matrix [country][category] = rate (%)
// Sources: USTR, CBP, White House executive orders (April 2025)
const RATES = {
  china: {
    electronics:  145,
    steel_metals: 145,
    machinery:    145,
    auto_parts:   145,
    textiles:     145,
    chemicals:    145,
    furniture:    145,
    medical:      145,
    food_ag:       20,
    general:      145,
  },
  mexico: {
    // USMCA-compliant goods: 0%; non-compliant + steel/aluminum: 25%
    electronics:   0,
    steel_metals:  25,
    machinery:     0,
    auto_parts:    0,
    textiles:      0,
    chemicals:     0,
    furniture:     0,
    medical:       0,
    food_ag:       0,
    general:       25,
  },
  canada: {
    electronics:   0,
    steel_metals:  25,
    machinery:     0,
    auto_parts:    0,
    textiles:      0,
    chemicals:     0,
    furniture:     0,
    medical:       0,
    food_ag:       0,
    general:       25,
  },
  vietnam: {
    electronics:  46,
    steel_metals: 46,
    machinery:    46,
    auto_parts:   46,
    textiles:     46,
    chemicals:    46,
    furniture:    46,
    medical:      46,
    food_ag:      46,
    general:      46,
  },
  india: {
    electronics:  26,
    steel_metals: 26,
    machinery:    26,
    auto_parts:   26,
    textiles:     26,
    chemicals:    26,
    furniture:    26,
    medical:      26,
    food_ag:      26,
    general:      26,
  },
  taiwan: {
    electronics:  32,
    steel_metals: 32,
    machinery:    32,
    auto_parts:   32,
    textiles:     32,
    chemicals:    32,
    furniture:    32,
    medical:      32,
    food_ag:      32,
    general:      32,
  },
  south_korea: {
    electronics:  25,
    steel_metals: 25,
    machinery:    25,
    auto_parts:   25,
    textiles:     25,
    chemicals:    25,
    furniture:    25,
    medical:      25,
    food_ag:      25,
    general:      25,
  },
  japan: {
    electronics:  24,
    steel_metals: 24,
    machinery:    24,
    auto_parts:   24,
    textiles:     24,
    chemicals:    24,
    furniture:    24,
    medical:      24,
    food_ag:      24,
    general:      24,
  },
  thailand: {
    electronics:  36,
    steel_metals: 36,
    machinery:    36,
    auto_parts:   36,
    textiles:     36,
    chemicals:    36,
    furniture:    36,
    medical:      36,
    food_ag:      36,
    general:      36,
  },
  eu: {
    electronics:  20,
    steel_metals: 25,
    machinery:    20,
    auto_parts:   25,
    textiles:     20,
    chemicals:    20,
    furniture:    20,
    medical:      20,
    food_ag:      20,
    general:      20,
  },
  brazil: {
    electronics:  10,
    steel_metals: 10,
    machinery:    10,
    auto_parts:   10,
    textiles:     10,
    chemicals:    10,
    furniture:    10,
    medical:      10,
    food_ag:      10,
    general:      10,
  },
  malaysia: {
    electronics:  24,
    steel_metals: 24,
    machinery:    24,
    auto_parts:   24,
    textiles:     24,
    chemicals:    24,
    furniture:    24,
    medical:      24,
    food_ag:      24,
    general:      24,
  },
  indonesia: {
    electronics:  32,
    steel_metals: 32,
    machinery:    32,
    auto_parts:   32,
    textiles:     32,
    chemicals:    32,
    furniture:    32,
    medical:      32,
    food_ag:      32,
    general:      32,
  },
  usa: {
    electronics:  0,
    steel_metals: 0,
    machinery:    0,
    auto_parts:   0,
    textiles:     0,
    chemicals:    0,
    furniture:    0,
    medical:      0,
    food_ag:      0,
    general:      0,
  },
};

export function getTariffRate(country, category) {
  return RATES[country]?.[category] ?? 10;
}

// Suggested alternative source countries by current country + category
export const ALTERNATIVES = {
  china: {
    electronics:  ['mexico', 'taiwan', 'south_korea', 'malaysia', 'vietnam'],
    steel_metals: ['canada', 'mexico', 'brazil', 'south_korea'],
    machinery:    ['taiwan', 'south_korea', 'japan', 'mexico', 'india'],
    auto_parts:   ['mexico', 'canada', 'south_korea', 'japan'],
    textiles:     ['vietnam', 'india', 'mexico', 'indonesia'],
    chemicals:    ['india', 'mexico', 'brazil', 'eu'],
    furniture:    ['vietnam', 'mexico', 'india', 'indonesia'],
    medical:      ['mexico', 'india', 'south_korea', 'eu'],
    food_ag:      ['mexico', 'canada', 'brazil', 'india'],
    general:      ['vietnam', 'india', 'mexico', 'taiwan'],
  },
  vietnam: {
    electronics:  ['malaysia', 'taiwan', 'south_korea', 'mexico'],
    steel_metals: ['canada', 'mexico', 'brazil'],
    machinery:    ['south_korea', 'japan', 'taiwan', 'mexico'],
    auto_parts:   ['mexico', 'canada', 'south_korea'],
    textiles:     ['india', 'mexico', 'indonesia'],
    chemicals:    ['india', 'mexico', 'brazil'],
    furniture:    ['mexico', 'india', 'brazil'],
    medical:      ['mexico', 'india', 'south_korea'],
    food_ag:      ['mexico', 'canada', 'brazil'],
    general:      ['india', 'mexico', 'malaysia'],
  },
};

// Approximate tariff rates from ~October 2024 (pre-"Liberation Day" escalation).
// Used to generate tariff change alerts for tracked items.
// China Section 301 rates were ~25% on most goods before April 2025.
// Most other countries had 0% reciprocal tariffs before April 2025.
const PREVIOUS_RATES = {
  china: {
    electronics:  25, steel_metals: 25, machinery:    25, auto_parts:   25,
    textiles:     25, chemicals:    25, furniture:    25, medical:      0,
    food_ag:       0, general:      25,
  },
  mexico:      { electronics: 0, steel_metals: 25, machinery: 0, auto_parts: 0, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
  canada:      { electronics: 0, steel_metals: 25, machinery: 0, auto_parts: 0, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
  vietnam:     { electronics: 0, steel_metals: 0, machinery: 0, auto_parts: 0, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
  india:       { electronics: 0, steel_metals: 0, machinery: 0, auto_parts: 0, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
  taiwan:      { electronics: 0, steel_metals: 0, machinery: 0, auto_parts: 0, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
  south_korea: { electronics: 0, steel_metals: 0, machinery: 0, auto_parts: 0, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
  japan:       { electronics: 0, steel_metals: 0, machinery: 0, auto_parts: 0, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
  thailand:    { electronics: 0, steel_metals: 0, machinery: 0, auto_parts: 0, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
  eu:          { electronics: 0, steel_metals: 25, machinery: 0, auto_parts: 25, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
  brazil:      { electronics: 0, steel_metals: 0, machinery: 0, auto_parts: 0, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
  malaysia:    { electronics: 0, steel_metals: 0, machinery: 0, auto_parts: 0, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
  indonesia:   { electronics: 0, steel_metals: 0, machinery: 0, auto_parts: 0, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
  usa:         { electronics: 0, steel_metals: 0, machinery: 0, auto_parts: 0, textiles: 0, chemicals: 0, furniture: 0, medical: 0, food_ag: 0, general: 0 },
};

// Returns alert objects for items whose tariff rate changed since Oct 2024.
export function getTariffAlerts(items) {
  const seen = new Set();
  const alerts = [];
  for (const item of items) {
    const key = `${item.country}:${item.category}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const prev = PREVIOUS_RATES[item.country]?.[item.category];
    const curr = getTariffRate(item.country, item.category);
    if (prev === undefined || prev === curr) continue;
    alerts.push({
      key,
      country: item.country,
      countryLabel: COUNTRIES[item.country]?.label ?? item.country,
      flag: COUNTRIES[item.country]?.flag ?? '',
      category: item.category,
      categoryLabel: CATEGORIES[item.category]?.label ?? item.category,
      prevRate: prev,
      currRate: curr,
      direction: curr > prev ? 'up' : 'down',
    });
  }
  return alerts.sort((a, b) => (b.currRate - b.prevRate) - (a.currRate - a.prevRate));
}

export function getAlternatives(country, category) {
  const alts = ALTERNATIVES[country]?.[category] ?? ALTERNATIVES.china?.[category] ?? [];
  return alts.slice(0, 4).map(c => ({
    country: c,
    label: COUNTRIES[c]?.label ?? c,
    flag: COUNTRIES[c]?.flag ?? '',
    rate: getTariffRate(c, category),
  })).sort((a, b) => a.rate - b.rate);
}
