const data = require('../src/data/kp-registry.json');
const sections = {};
data.registry.forEach(kp => {
  const key = kp.sectionTitle.en;
  if (!sections[key]) sections[key] = [];
  sections[key].push({ id: kp.id, en: kp.title.en, zh: kp.title.zh, sub: kp.subSectionTitle.en });
});
Object.entries(sections).forEach(([sec, kps]) => {
  console.log('\n=== ' + sec + ' (' + kps.length + ' KPs) ===');
  kps.forEach(kp => console.log(kp.id + ' | ' + kp.en + ' | ' + kp.sub));
});
