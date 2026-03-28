/**
 * Generates SVG scene illustrations for all story nodes and saves them
 * to public/illustrations/{storyId}-{nodeId}.svg
 * Then updates cachedImageUrl in each story JSON to point to the local path.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const STORIES_DIR = path.join(ROOT, 'src', 'stories');
const OUT_DIR = path.join(ROOT, 'public', 'illustrations');

// ─── Keyword → Scene theme mapping ────────────────────────────────────────────

const THEMES = {
  space: {
    bg1: '#020818', bg2: '#0d1b4b', bg3: '#1a0a3d',
    accent1: '#7c3aed', accent2: '#3b82f6', accent3: '#f59e0b',
    type: 'space',
  },
  bathroom: {
    bg1: '#0a2a3a', bg2: '#1a4a5a', bg3: '#0f3347',
    accent1: '#22d3ee', accent2: '#7c3aed', accent3: '#fde68a',
    type: 'bathroom',
  },
  underground: {
    bg1: '#1a0a00', bg2: '#3d1a00', bg3: '#2d1005',
    accent1: '#f59e0b', accent2: '#d97706', accent3: '#fde68a',
    type: 'cave',
  },
  cheese: {
    bg1: '#1a1200', bg2: '#3d2a00', bg3: '#2d1f00',
    accent1: '#fbbf24', accent2: '#f59e0b', accent3: '#fde68a',
    type: 'cave',
  },
  wizard: {
    bg1: '#0d0022', bg2: '#2d0a4a', bg3: '#1a0033',
    accent1: '#a855f7', accent2: '#7c3aed', accent3: '#fde68a',
    type: 'magic',
  },
  magic: {
    bg1: '#0d0022', bg2: '#2d0a4a', bg3: '#1a0033',
    accent1: '#a855f7', accent2: '#ec4899', accent3: '#fde68a',
    type: 'magic',
  },
  school: {
    bg1: '#0a1a2a', bg2: '#102030', bg3: '#0d1f2d',
    accent1: '#3b82f6', accent2: '#10b981', accent3: '#fde68a',
    type: 'school',
  },
  drama: {
    bg1: '#1a0022', bg2: '#2d0040', bg3: '#150033',
    accent1: '#ec4899', accent2: '#a855f7', accent3: '#fde68a',
    type: 'drama',
  },
  stage: {
    bg1: '#1a0005', bg2: '#2d000d', bg3: '#150008',
    accent1: '#ec4899', accent2: '#f59e0b', accent3: '#fde68a',
    type: 'drama',
  },
  adventure: {
    bg1: '#020c18', bg2: '#0a1f38', bg3: '#051525',
    accent1: '#3b82f6', accent2: '#10b981', accent3: '#fde68a',
    type: 'adventure',
  },
  default: {
    bg1: '#0d0d1a', bg2: '#1a0d2e', bg3: '#0a0a1f',
    accent1: '#7c3aed', accent2: '#6d28d9', accent3: '#c4b5fd',
    type: 'default',
  },
};

function detectTheme(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('space') || p.includes('galaxy') || p.includes('planet') || p.includes('star') || p.includes('cosmos')) return THEMES.space;
  if (p.includes('toilet') || p.includes('bathroom') || p.includes('portal') || p.includes('pyjama') || p.includes('toothbrush')) return THEMES.bathroom;
  if (p.includes('cheese') && (p.includes('cave') || p.includes('underground') || p.includes('tunnel'))) return THEMES.cheese;
  if (p.includes('underground') || p.includes('cave') || p.includes('tunnel') || p.includes('mine')) return THEMES.underground;
  if (p.includes('wizard') || p.includes('potion') || p.includes('spell') || p.includes('wand')) return THEMES.wizard;
  if (p.includes('magic') || p.includes('enchant') || p.includes('mystical')) return THEMES.magic;
  if (p.includes('stage') || p.includes('concert') || p.includes('perform') || p.includes('spotlight')) return THEMES.stage;
  if (p.includes('drama') || p.includes('secret') || p.includes('pop star') || p.includes('pop-star') || p.includes('celebrity')) return THEMES.drama;
  if (p.includes('school') || p.includes('classroom') || p.includes('hallway') || p.includes('cafeteria') || p.includes('locker')) return THEMES.school;
  return THEMES.adventure;
}

// ─── Deterministic pseudo-random from seed ────────────────────────────────────

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function hashStr(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return Math.abs(h);
}

// ─── SVG generators per type ──────────────────────────────────────────────────

function makeStars(rand, count = 60) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = rand() * 1024;
    const y = rand() * 576;
    const r = rand() * 2.5 + 0.5;
    const op = rand() * 0.7 + 0.3;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="white" opacity="${op.toFixed(2)}"/>`;
  }
  return out;
}

function makeBubbles(rand, color, count = 8) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const cx = rand() * 1024;
    const cy = rand() * 576;
    const r = rand() * 120 + 30;
    const op = rand() * 0.18 + 0.04;
    out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${op.toFixed(3)}"/>`;
  }
  return out;
}

function makeSparkles(rand, color, count = 12) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = rand() * 1000 + 12;
    const y = rand() * 550 + 12;
    const size = rand() * 10 + 5;
    const op = rand() * 0.8 + 0.2;
    out += `<text x="${x.toFixed(0)}" y="${y.toFixed(0)}" font-size="${size.toFixed(0)}" fill="${color}" opacity="${op.toFixed(2)}" text-anchor="middle">✦</text>`;
  }
  return out;
}

function makeCheeseBubbles(rand) {
  let out = '';
  const positions = [[200,150],[600,200],[800,350],[400,400],[150,350],[700,100],[300,300],[850,200]];
  for (const [cx, cy] of positions) {
    const jx = cx + (rand() - 0.5) * 60;
    const jy = cy + (rand() - 0.5) * 60;
    const r = rand() * 25 + 12;
    out += `<circle cx="${jx.toFixed(0)}" cy="${jy.toFixed(0)}" r="${r.toFixed(0)}" fill="#0d0d1a" opacity="0.6"/>`;
  }
  return out;
}

function makePlanet(cx, cy, r, color, ringColor) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${r * 1.7}" ry="${r * 0.35}" fill="none" stroke="${ringColor}" stroke-width="4" opacity="0.5"/>
  `;
}

function makeWaves(rand, color, count = 5) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const y = rand() * 400 + 88;
    const amp = rand() * 40 + 10;
    const freq = rand() * 0.015 + 0.005;
    const phase = rand() * Math.PI * 2;
    let d = `M 0 ${y}`;
    for (let x = 0; x <= 1024; x += 16) {
      const wy = y + Math.sin(x * freq + phase) * amp;
      d += ` L ${x} ${wy.toFixed(1)}`;
    }
    out += `<path d="${d}" stroke="${color}" stroke-width="2" fill="none" opacity="0.15"/>`;
  }
  return out;
}

function svgForSpace(theme, rand, title) {
  const stars = makeStars(rand, 80);
  const bubbles = makeBubbles(rand, theme.accent1, 6);
  const sparkles = makeSparkles(rand, theme.accent3, 8);
  const planet1 = makePlanet(820, 120, 60, theme.accent1, theme.accent2);
  const planet2 = makePlanet(180, 430, 35, theme.accent2, theme.accent3);
  return `
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="${theme.bg2}"/>
        <stop offset="100%" stop-color="${theme.bg1}"/>
      </radialGradient>
      <radialGradient id="nebula" cx="30%" cy="60%" r="50%">
        <stop offset="0%" stop-color="${theme.accent1}" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="${theme.bg1}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1024" height="576" fill="url(#bg)"/>
    <rect width="1024" height="576" fill="url(#nebula)"/>
    ${stars}${bubbles}${planet1}${planet2}${sparkles}
  `;
}

function svgForBathroom(theme, rand, title) {
  const bubbles = makeBubbles(rand, theme.accent1, 10);
  const sparkles = makeSparkles(rand, theme.accent2, 10);
  // Swirling portal circle
  const portalGlow = `
    <circle cx="512" cy="288" r="180" fill="${theme.accent1}" opacity="0.08"/>
    <circle cx="512" cy="288" r="130" fill="${theme.accent2}" opacity="0.10"/>
    <circle cx="512" cy="288" r="80" fill="${theme.accent3}" opacity="0.12"/>
  `;
  const waves = makeWaves(rand, theme.accent1, 6);
  return `
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="${theme.bg2}"/>
        <stop offset="100%" stop-color="${theme.bg1}"/>
      </radialGradient>
    </defs>
    <rect width="1024" height="576" fill="url(#bg)"/>
    ${waves}${portalGlow}${bubbles}${sparkles}
  `;
}

function svgForCave(theme, rand, title) {
  const sparkles = makeSparkles(rand, theme.accent3, 6);
  const cheeseBubbles = makeCheeseBubbles(rand);
  // Cave stalactites at top
  let stalactites = '';
  for (let i = 0; i < 12; i++) {
    const x = (i / 11) * 1024 + (rand() - 0.5) * 40;
    const h = rand() * 80 + 20;
    const w = rand() * 30 + 10;
    stalactites += `<polygon points="${x},0 ${x - w/2},${h} ${x + w/2},${h}" fill="${theme.bg3}" opacity="0.8"/>`;
  }
  // Glowing cheese circles
  const cheeseCx = 512 + (rand() - 0.5) * 200;
  const cheeseCy = 300 + (rand() - 0.5) * 100;
  const cheesePiece = `
    <ellipse cx="${cheeseCx.toFixed(0)}" cy="${cheeseCy.toFixed(0)}" rx="160" ry="100" fill="${theme.accent1}" opacity="0.25"/>
    ${cheeseBubbles}
  `;
  return `
    <defs>
      <radialGradient id="bg" cx="50%" cy="70%" r="60%">
        <stop offset="0%" stop-color="${theme.bg2}"/>
        <stop offset="100%" stop-color="${theme.bg1}"/>
      </radialGradient>
    </defs>
    <rect width="1024" height="576" fill="url(#bg)"/>
    ${cheesePiece}${stalactites}${sparkles}
  `;
}

function svgForMagic(theme, rand, title) {
  const stars = makeStars(rand, 50);
  const bubbles = makeBubbles(rand, theme.accent1, 8);
  const sparkles = makeSparkles(rand, theme.accent3, 16);
  const magicCircle = `
    <circle cx="512" cy="288" r="200" fill="none" stroke="${theme.accent1}" stroke-width="2" opacity="0.4" stroke-dasharray="12 8"/>
    <circle cx="512" cy="288" r="150" fill="none" stroke="${theme.accent2}" stroke-width="1.5" opacity="0.3" stroke-dasharray="8 6"/>
    <circle cx="512" cy="288" r="260" fill="${theme.accent1}" opacity="0.05"/>
  `;
  return `
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="${theme.bg2}"/>
        <stop offset="100%" stop-color="${theme.bg1}"/>
      </radialGradient>
    </defs>
    <rect width="1024" height="576" fill="url(#bg)"/>
    ${stars}${bubbles}${magicCircle}${sparkles}
  `;
}

function svgForSchool(theme, rand, title) {
  const bubbles = makeBubbles(rand, theme.accent1, 8);
  const sparkles = makeSparkles(rand, theme.accent2, 8);
  const waves = makeWaves(rand, theme.accent1, 4);
  return `
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bg1}"/>
        <stop offset="100%" stop-color="${theme.bg2}"/>
      </linearGradient>
    </defs>
    <rect width="1024" height="576" fill="url(#bg)"/>
    ${waves}${bubbles}${sparkles}
  `;
}

function svgForDrama(theme, rand, title) {
  const bubbles = makeBubbles(rand, theme.accent1, 10);
  const sparkles = makeSparkles(rand, theme.accent3, 14);
  const spotlight = `
    <radialGradient id="spot" cx="50%" cy="100%" r="70%" gradientUnits="userSpaceOnUse" x1="0" y1="576" x2="1024" y2="0">
      <stop offset="0%" stop-color="${theme.accent1}" stop-opacity="0.2"/>
      <stop offset="60%" stop-color="${theme.bg1}" stop-opacity="0"/>
    </radialGradient>
    <rect width="1024" height="576" fill="url(#spot)"/>
  `;
  return `
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="${theme.bg2}"/>
        <stop offset="100%" stop-color="${theme.bg1}"/>
      </radialGradient>
    </defs>
    <rect width="1024" height="576" fill="url(#bg)"/>
    ${spotlight}${bubbles}${sparkles}
  `;
}

function svgForAdventure(theme, rand, title) {
  const stars = makeStars(rand, 30);
  const bubbles = makeBubbles(rand, theme.accent1, 8);
  const sparkles = makeSparkles(rand, theme.accent2, 10);
  const waves = makeWaves(rand, theme.accent1, 5);
  return `
    <defs>
      <radialGradient id="bg" cx="40%" cy="40%" r="70%">
        <stop offset="0%" stop-color="${theme.bg2}"/>
        <stop offset="100%" stop-color="${theme.bg1}"/>
      </radialGradient>
    </defs>
    <rect width="1024" height="576" fill="url(#bg)"/>
    ${waves}${stars}${bubbles}${sparkles}
  `;
}

function generateSVG(nodeId, imagePrompt, title) {
  const theme = detectTheme(imagePrompt);
  const rand = seededRand(hashStr(nodeId));

  let inner;
  switch (theme.type) {
    case 'space': inner = svgForSpace(theme, rand, title); break;
    case 'bathroom': inner = svgForBathroom(theme, rand, title); break;
    case 'cave': inner = svgForCave(theme, rand, title); break;
    case 'magic': inner = svgForMagic(theme, rand, title); break;
    case 'school': inner = svgForSchool(theme, rand, title); break;
    case 'drama': inner = svgForDrama(theme, rand, title); break;
    default: inner = svgForAdventure(theme, rand, title); break;
  }

  // Scene title overlay at the bottom
  const titleLabel = `
    <defs>
      <linearGradient id="titleFade" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.65"/>
      </linearGradient>
    </defs>
    <rect y="430" width="1024" height="146" fill="url(#titleFade)"/>
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="576" viewBox="0 0 1024 576">
  ${inner}
  ${titleLabel}
</svg>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const storyFiles = fs.readdirSync(STORIES_DIR).filter(f => f.endsWith('.json'));
let totalNodes = 0;

for (const file of storyFiles) {
  const filePath = path.join(STORIES_DIR, file);
  const story = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const node of story.nodes) {
    const filename = `${story.id}-${node.id}.svg`;
    const outPath = path.join(OUT_DIR, filename);
    const publicPath = `/illustrations/${filename}`;

    const svg = generateSVG(node.id, node.imagePrompt ?? '', node.title ?? '');
    fs.writeFileSync(outPath, svg, 'utf8');

    node.cachedImageUrl = publicPath;
    totalNodes++;
    console.log(`✓ ${story.id}/${node.id} → ${publicPath}`);
  }

  fs.writeFileSync(filePath, JSON.stringify(story, null, 2), 'utf8');
  console.log(`  Updated ${file}`);
}

console.log(`\nDone — generated ${totalNodes} SVG illustrations`);
