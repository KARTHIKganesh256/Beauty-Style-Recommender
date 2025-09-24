const undertoneColorMap = {
  warm: ['gold', 'yellow', 'olive', 'coral', 'peach', 'earthy brown'],
  cool: ['blue', 'emerald', 'lavender', 'pink', 'ruby', 'silver'],
  neutral: ['beige', 'taupe', 'soft white', 'charcoal', 'navy']
};

const makeupCategories = ['foundation', 'concealer', 'bb cream', 'lipstick', 'sunscreen'];
const skincareCategories = ['moisturizer', 'lotion', 'face cream'];

function normalizeSkinTone(skinTone) {
  if (!skinTone) return '';
  const s = String(skinTone).trim().toLowerCase();
  if (/^#?[0-9a-f]{6}$/i.test(s)) return s.replace('#', '');
  if (/^(i|ii|iii|iv|v|vi)$/i.test(s)) return `fitzpatrick ${s.toUpperCase()}`;
  return s;
}

export function mapQueriesFromInput({ skinTone, undertone, location }) {
  const tone = normalizeSkinTone(skinTone);
  const toneWords = tone ? [tone] : [];
  const u = (undertone || '').toLowerCase();
  const colors = undertoneColorMap[u] || undertoneColorMap.neutral;

  const makeupQueries = makeupCategories.map(cat => `${cat} ${toneWords.join(' ')}`.trim());
  const skincareQueries = skincareCategories.map(cat => `${cat} for ${tone || 'all skin types'}`.trim());
  const clothingQueries = colors.map(color => `${color} clothing`);

  return {
    makeupQueries,
    skincareQueries,
    clothingQueries,
    location: location || ''
  };
}


