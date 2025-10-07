import assert from 'node:assert/strict';

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function luminance({ r, g, b }) {
  const srgb = [r, g, b].map((channel) => {
    const val = channel / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return srgb[0] * 0.2126 + srgb[1] * 0.7152 + srgb[2] * 0.0722;
}

function contrast(hexA, hexB) {
  const lumA = luminance(hexToRgb(hexA));
  const lumB = luminance(hexToRgb(hexB));
  const brightest = Math.max(lumA, lumB);
  const darkest = Math.min(lumA, lumB);
  return (brightest + 0.05) / (darkest + 0.05);
}

const combinations = [
  { name: 'Default panel', fg: '#E9F1F7', bg: '#0D1E30', min: 4.5 },
  { name: 'Primary option', fg: '#041C32', bg: '#56CCF2', min: 4.5 },
  { name: 'Option hover high-contrast', fg: '#000000', bg: '#FFFFFF', min: 7 },
  { name: 'Achievements header', fg: '#FFD166', bg: '#0D1E30', min: 3 },
  { name: 'High contrast text', fg: '#FFFFFF', bg: '#000000', min: 7 },
  { name: 'Queue indicator', fg: '#091540', bg: '#FFD166', min: 4.5 },
];

const results = combinations.map(({ name, fg, bg, min }) => {
  const ratio = Number(contrast(fg, bg).toFixed(2));
  return { name, fg, bg, ratio, passes: ratio >= min, min };
});

results.forEach(({ name, ratio, passes, min }) => {
  console.log(`${name}: ${ratio} (min ${min}) ${passes ? 'PASS' : 'FAIL'}`);
});

const failing = results.filter((item) => !item.passes);
assert.equal(failing.length, 0, `Contrast failures: ${failing.map((f) => f.name).join(', ')}`);

