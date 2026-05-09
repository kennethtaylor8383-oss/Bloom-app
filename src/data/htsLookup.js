// Maps HTS chapter (2-digit prefix) to a product category key used in tariff calculations.
// Source: US Harmonized Tariff Schedule chapter structure (USITC)
export const HTS_CHAPTER_MAP = {
  // Food & Agriculture (01–24)
  '01': 'food_ag', '02': 'food_ag', '03': 'food_ag', '04': 'food_ag',
  '05': 'food_ag', '06': 'food_ag', '07': 'food_ag', '08': 'food_ag',
  '09': 'food_ag', '10': 'food_ag', '11': 'food_ag', '12': 'food_ag',
  '13': 'food_ag', '14': 'food_ag', '15': 'food_ag', '16': 'food_ag',
  '17': 'food_ag', '18': 'food_ag', '19': 'food_ag', '20': 'food_ag',
  '21': 'food_ag', '22': 'food_ag', '23': 'food_ag', '24': 'food_ag',
  // Chemicals & Plastics (25–40)
  '25': 'chemicals', '26': 'chemicals', '27': 'chemicals',
  '28': 'chemicals', '29': 'chemicals',
  '30': 'medical',
  '31': 'chemicals', '32': 'chemicals', '33': 'chemicals',
  '34': 'chemicals', '35': 'chemicals', '36': 'chemicals',
  '37': 'chemicals', '38': 'chemicals', '39': 'chemicals', '40': 'chemicals',
  // Textiles & Apparel (41–67)
  '41': 'textiles', '42': 'textiles', '43': 'textiles',
  '44': 'furniture', '45': 'furniture', '46': 'furniture',
  '47': 'general',  '48': 'general',  '49': 'general',
  '50': 'textiles', '51': 'textiles', '52': 'textiles', '53': 'textiles',
  '54': 'textiles', '55': 'textiles', '56': 'textiles', '57': 'textiles',
  '58': 'textiles', '59': 'textiles', '60': 'textiles', '61': 'textiles',
  '62': 'textiles', '63': 'textiles', '64': 'textiles', '65': 'textiles',
  '66': 'textiles', '67': 'textiles',
  // Glass, Ceramics, General (68–71)
  '68': 'general', '69': 'general', '70': 'general', '71': 'general',
  // Steel, Metals, Base Metals (72–83)
  '72': 'steel_metals', '73': 'steel_metals', '74': 'steel_metals',
  '75': 'steel_metals', '76': 'steel_metals', '77': 'steel_metals',
  '78': 'steel_metals', '79': 'steel_metals', '80': 'steel_metals',
  '81': 'steel_metals', '82': 'steel_metals', '83': 'steel_metals',
  // Machinery (84)
  '84': 'machinery',
  // Electronics (85)
  '85': 'electronics',
  // Vehicles & Auto Parts (86–89)
  '86': 'auto_parts', '87': 'auto_parts', '88': 'auto_parts', '89': 'auto_parts',
  // Optical, Medical, Instruments (90–92)
  '90': 'medical', '91': 'general', '92': 'general',
  // Miscellaneous (93–99)
  '93': 'general', '94': 'furniture', '95': 'general',
  '96': 'general', '97': 'general', '98': 'general', '99': 'general',
};

// Returns the category key for a given HTS code string, or null if unrecognized.
export function lookupHTSCategory(htsCode) {
  if (!htsCode || typeof htsCode !== 'string') return null;
  const digits = htsCode.replace(/[.\s\-]/g, '');
  if (digits.length < 2) return null;
  const chapter = digits.substring(0, 2);
  return HTS_CHAPTER_MAP[chapter] ?? null;
}

// Returns a human-readable chapter description for an HTS code.
export function describeHTSChapter(htsCode) {
  const category = lookupHTSCategory(htsCode);
  const descriptions = {
    food_ag:      'Food & Agricultural (Ch. 01–24)',
    chemicals:    'Chemicals & Plastics (Ch. 25–40)',
    medical:      'Medical Devices (Ch. 30 / 90)',
    textiles:     'Textiles & Apparel (Ch. 41–67)',
    furniture:    'Furniture & Wood (Ch. 44 / 94)',
    general:      'General Manufacturing',
    steel_metals: 'Steel, Metals & Base Metals (Ch. 72–83)',
    machinery:    'Industrial Machinery (Ch. 84)',
    electronics:  'Electronics & Components (Ch. 85)',
    auto_parts:   'Vehicles & Auto Parts (Ch. 86–89)',
  };
  return category ? descriptions[category] : null;
}
