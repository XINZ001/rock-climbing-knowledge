const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const sections = JSON.parse(fs.readFileSync(path.join(dataDir, 'sections.json'), 'utf8')).sections;

const registry = [];

const files = fs.readdirSync(dataDir)
  .filter(f => /^section-\d+/.test(f) && f.endsWith('.json'))
  .sort();

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  const secMeta = sections.find(s => s.id === data.sectionId);

  data.subSections.forEach(sub => {
    sub.knowledgePoints.forEach(kp => {
      // Extract keyword list from terms
      const keywords = [];
      (kp.terms || []).forEach(t => {
        if (t.zh) keywords.push(t.zh);
        if (t.en) keywords.push(t.en);
      });

      registry.push({
        id: kp.id,
        path: secMeta.slug + '/' + sub.slug,
        sectionId: secMeta.id,
        sectionSlug: secMeta.slug,
        sectionTitle: secMeta.title,
        subSectionId: sub.id,
        subSectionSlug: sub.slug,
        subSectionTitle: sub.title,
        title: kp.title,
        keywords: keywords,
        tags: kp.tags || [],
        crossRefs: kp.crossRefs || [],
        // Status tracking
        status: {
          content: 'done',
          illustration: 'pending',
          video: 'pending'
        }
      });
    });
  });
});

// Output as JSON
const output = {
  _meta: {
    description: 'Knowledge Point Registry - Master index of all knowledge points in the climbing knowledge base',
    generatedAt: new Date().toISOString(),
    totalCount: registry.length,
    usage: 'This file is the single source of truth for all knowledge point IDs, keywords, and status tracking. Update this file whenever knowledge points are added, removed, or enriched with new content (illustrations, videos, etc.)'
  },
  registry: registry
};

const outPath = path.join(dataDir, 'kp-registry.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

// Print summary
console.log('KP Registry generated: ' + outPath);
console.log('Total knowledge points: ' + registry.length);
console.log('');

const grouped = {};
registry.forEach(r => {
  const key = r.sectionSlug;
  if (!grouped[key]) grouped[key] = { title: r.sectionTitle.zh, count: 0, subs: {} };
  grouped[key].count++;
  const subKey = r.subSectionSlug;
  if (!grouped[key].subs[subKey]) grouped[key].subs[subKey] = { title: r.subSectionTitle.zh, count: 0 };
  grouped[key].subs[subKey].count++;
});

Object.entries(grouped).forEach(([slug, info]) => {
  console.log(`${info.title} (${slug}): ${info.count} KPs`);
  Object.entries(info.subs).forEach(([subSlug, subInfo]) => {
    console.log(`  └─ ${subInfo.title} (${subSlug}): ${subInfo.count}`);
  });
});
