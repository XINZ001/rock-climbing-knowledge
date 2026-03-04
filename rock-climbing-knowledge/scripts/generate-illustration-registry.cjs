const registry = require('../src/data/kp-registry.json');
const fs = require('fs');
const path = require('path');

// Get all KP IDs, sorted by length descending for longest match first
const kpIds = registry.registry.map(r => r.id).sort((a, b) => b.length - a.length);

// Get all illustration files
const illustrationDir = path.join(__dirname, '../public/images/illustrations');
const files = fs.readdirSync(illustrationDir).filter(f => f.endsWith('.png'));

// Manual overrides for files that don't match by prefix
const manualOverrides = {
  'kp-anxiety-breathing.png': 'kp-competition-anxiety',
  'kp-anxiety-preclimb.png': 'kp-competition-anxiety',
  'kp-anxiety-reframing.png': 'kp-competition-anxiety',
  'kp-arete-technique.png': 'kp-arete-mantle',
  'kp-comp-training-onsight.png': 'kp-comp-specific-training',
  'kp-comp-training-reading.png': 'kp-comp-specific-training',
  'kp-comp-training-warmup.png': 'kp-comp-specific-training',
  'kp-crack-climbing-chimney.png': 'kp-crack-climbing-systems',
  'kp-crack-climbing-finger.png': 'kp-crack-climbing-systems',
  'kp-crack-climbing-fist.png': 'kp-crack-climbing-systems',
  'kp-crack-climbing-hand.png': 'kp-crack-climbing-systems',
  'kp-crack-climbing-offwidth.png': 'kp-crack-climbing-systems',
  'kp-flash.png': 'kp-onsight-flash-redpoint',
  'kp-gaston.png': 'kp-undercling-sidepull-gaston',
  'kp-lunge-deadpoint.png': 'kp-lunge-types',
  'kp-lunge-full-dyno.png': 'kp-lunge-types',
  'kp-lunge-pop.png': 'kp-lunge-types',
  'kp-onsight.png': 'kp-onsight-flash-redpoint',
  'kp-redpoint.png': 'kp-onsight-flash-redpoint',
  'kp-route-reading.png': 'kp-route-reading-basics',
  'kp-sidepull.png': 'kp-undercling-sidepull-gaston',
  'kp-time-limits-boulder.png': 'kp-time-limits-attempts',
  'kp-time-limits-lead.png': 'kp-time-limits-attempts',
  'kp-undercling.png': 'kp-undercling-sidepull-gaston',
};

// Build mapping
const mapping = {};

files.forEach(file => {
  let matchedKp = manualOverrides[file];

  if (!matchedKp) {
    const basename = file.replace('.png', '');
    matchedKp = kpIds.find(id => basename === id || basename.startsWith(id + '-'));
  }

  if (matchedKp) {
    if (!mapping[matchedKp]) mapping[matchedKp] = [];
    mapping[matchedKp].push('/images/illustrations/' + file);
  }
});

// Sort keys alphabetically and output
const sorted = {};
Object.keys(mapping).sort().forEach(k => {
  sorted[k] = mapping[k].sort();
});

const output = JSON.stringify(sorted, null, 2);
const outPath = path.join(__dirname, '../src/data/illustration-registry.json');
fs.writeFileSync(outPath, output + '\n');

console.log('Generated illustration-registry.json');
console.log('Total KPs with illustrations:', Object.keys(sorted).length);
console.log('Total illustration files mapped:', Object.values(sorted).flat().length);
