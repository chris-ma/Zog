/**
 * Generates rich cover SVGs for each story based on its title, genre, mood and theme.
 * Saves to public/illustrations/{storyId}-cover.svg and updates coverImageUrl in JSON.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const STORIES_DIR = path.join(ROOT, 'src', 'stories');
const OUT_DIR = path.join(ROOT, 'public', 'illustrations');

// ─── Per-story cover designs ───────────────────────────────────────────────────

const COVER_DESIGNS = {
  'burp-quest': {
    bg1: '#020818', bg2: '#0d1b4b', bg3: '#1a0a3d',
    accent1: '#7c3aed', accent2: '#fbbf24', accent3: '#22d3ee',
    title: 'The Galaxy-Brained Burp Quest',
    emoji: '🚽',
    render: (c) => `
      <!-- Deep space background -->
      <defs>
        <radialGradient id="bg" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="${c.bg2}"/>
          <stop offset="100%" stop-color="${c.bg1}"/>
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="55%" r="40%">
          <stop offset="0%" stop-color="${c.accent2}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${c.bg1}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="portal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${c.accent3}" stop-opacity="0.9"/>
          <stop offset="40%" stop-color="${c.accent1}" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="${c.bg1}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="titleFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#bg)"/>
      <rect width="800" height="450" fill="url(#glow)"/>

      <!-- Stars -->
      ${stars(80, 800, 450)}

      <!-- Glowing portal in toilet bowl shape -->
      <ellipse cx="400" cy="250" rx="140" ry="90" fill="url(#portal)" opacity="0.8"/>
      <ellipse cx="400" cy="250" rx="100" ry="65" fill="${c.accent3}" opacity="0.15"/>
      <ellipse cx="400" cy="250" rx="60" ry="38" fill="${c.accent3}" opacity="0.25"/>

      <!-- Toilet outline (stylised) -->
      <ellipse cx="400" cy="260" rx="155" ry="100" fill="none" stroke="${c.accent2}" stroke-width="3" opacity="0.6"/>
      <rect x="330" y="155" width="140" height="40" rx="10" fill="none" stroke="${c.accent2}" stroke-width="3" opacity="0.5"/>

      <!-- Stars/sparkles around portal -->
      ${sparkles(c.accent2, 16, 800, 450)}

      <!-- Floating planets -->
      <circle cx="680" cy="100" r="45" fill="${c.accent1}" opacity="0.7"/>
      <ellipse cx="680" cy="100" rx="72" ry="18" fill="none" stroke="${c.accent2}" stroke-width="2.5" opacity="0.5"/>
      <circle cx="120" cy="340" r="28" fill="${c.accent2}" opacity="0.5"/>
      <circle cx="700" cy="360" r="18" fill="${c.accent3}" opacity="0.6"/>

      <!-- Bottom title fade -->
      <rect width="800" height="450" fill="url(#titleFade)"/>
    `,
  },

  'double-life-drama': {
    bg1: '#0d0015', bg2: '#1a003a', bg3: '#0a0020',
    accent1: '#ec4899', accent2: '#a855f7', accent3: '#fde68a',
    title: 'Double Life Drama',
    emoji: '🎭',
    render: (c) => `
      <defs>
        <radialGradient id="bg" cx="50%" cy="60%" r="70%">
          <stop offset="0%" stop-color="${c.bg2}"/>
          <stop offset="100%" stop-color="${c.bg1}"/>
        </radialGradient>
        <!-- Stage spotlight from top -->
        <radialGradient id="spot1" cx="35%" cy="0%" r="65%">
          <stop offset="0%" stop-color="${c.accent1}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${c.bg1}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="spot2" cx="65%" cy="0%" r="65%">
          <stop offset="0%" stop-color="${c.accent2}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${c.bg1}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="stage" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="75%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#1a003a" stop-opacity="0.9"/>
        </linearGradient>
        <linearGradient id="titleFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#bg)"/>
      <rect width="800" height="450" fill="url(#spot1)"/>
      <rect width="800" height="450" fill="url(#spot2)"/>

      <!-- Stage curtain hints -->
      <rect x="0" y="0" width="80" height="450" fill="${c.accent1}" opacity="0.08"/>
      <rect x="720" y="0" width="80" height="450" fill="${c.accent2}" opacity="0.08"/>

      <!-- Stars -->
      ${stars(40, 800, 450)}
      ${sparkles(c.accent3, 20, 800, 450)}

      <!-- Drama masks - comedy (right) -->
      <circle cx="520" cy="200" r="70" fill="${c.accent1}" opacity="0.18"/>
      <circle cx="520" cy="200" r="70" fill="none" stroke="${c.accent1}" stroke-width="2" opacity="0.5"/>
      <!-- smile -->
      <path d="M495 215 Q520 235 545 215" stroke="${c.accent1}" stroke-width="3" fill="none" opacity="0.8" stroke-linecap="round"/>
      <!-- eyes -->
      <circle cx="506" cy="190" r="6" fill="${c.accent1}" opacity="0.7"/>
      <circle cx="534" cy="190" r="6" fill="${c.accent1}" opacity="0.7"/>

      <!-- Drama masks - tragedy (left) -->
      <circle cx="280" cy="210" r="70" fill="${c.accent2}" opacity="0.18"/>
      <circle cx="280" cy="210" r="70" fill="none" stroke="${c.accent2}" stroke-width="2" opacity="0.5"/>
      <!-- frown -->
      <path d="M255 230 Q280 210 305 230" stroke="${c.accent2}" stroke-width="3" fill="none" opacity="0.8" stroke-linecap="round"/>
      <!-- eyes -->
      <circle cx="266" cy="198" r="6" fill="${c.accent2}" opacity="0.7"/>
      <circle cx="294" cy="198" r="6" fill="${c.accent2}" opacity="0.7"/>

      <!-- Microphone in centre -->
      <rect x="390" y="140" width="20" height="50" rx="10" fill="${c.accent3}" opacity="0.6"/>
      <ellipse cx="400" cy="140" rx="16" ry="22" fill="${c.accent3}" opacity="0.7"/>
      <path d="M375 190 Q375 220 400 220 Q425 220 425 190" stroke="${c.accent3}" stroke-width="2" fill="none" opacity="0.5"/>
      <line x1="400" y1="220" x2="400" y2="245" stroke="${c.accent3}" stroke-width="2" opacity="0.5"/>

      <rect width="800" height="450" fill="url(#stage)"/>
      <rect width="800" height="450" fill="url(#titleFade)"/>
    `,
  },

  'hollow-king': {
    bg1: '#000a05', bg2: '#001a0f', bg3: '#050f08',
    accent1: '#10b981', accent2: '#6d28d9', accent3: '#d4af37',
    title: 'The Hollow King',
    emoji: '👑',
    render: (c) => `
      <defs>
        <radialGradient id="bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stop-color="${c.bg2}"/>
          <stop offset="100%" stop-color="${c.bg1}"/>
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="35%" r="35%">
          <stop offset="0%" stop-color="${c.accent1}" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="${c.bg1}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="titleFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.75"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#bg)"/>
      <rect width="800" height="450" fill="url(#glow)"/>

      <!-- Distant stars (fewer, dimmer for dark fantasy) -->
      ${stars(35, 800, 450)}

      <!-- Throne silhouette -->
      <!-- seat -->
      <rect x="310" y="260" width="180" height="130" rx="4" fill="${c.accent2}" opacity="0.25"/>
      <!-- back -->
      <rect x="320" y="120" width="160" height="155" rx="4" fill="${c.accent2}" opacity="0.3"/>
      <!-- armrests -->
      <rect x="280" y="220" width="50" height="20" rx="3" fill="${c.accent2}" opacity="0.25"/>
      <rect x="470" y="220" width="50" height="20" rx="3" fill="${c.accent2}" opacity="0.25"/>
      <!-- crown spires on top of throne -->
      <polygon points="340,120 355,80 370,120" fill="${c.accent3}" opacity="0.5"/>
      <polygon points="385,120 400,65 415,120" fill="${c.accent3}" opacity="0.6"/>
      <polygon points="430,120 445,80 460,120" fill="${c.accent3}" opacity="0.5"/>

      <!-- Crown above throne -->
      <polygon points="350,105 370,60 390,95 410,55 430,95 450,60 470,105" fill="${c.accent3}" opacity="0.7"/>
      <circle cx="370" cy="62" r="6" fill="${c.accent1}" opacity="0.9"/>
      <circle cx="410" cy="57" r="8" fill="${c.accent1}" opacity="0.9"/>
      <circle cx="450" cy="62" r="6" fill="${c.accent1}" opacity="0.9"/>

      <!-- Eerie green mist at base -->
      <ellipse cx="400" cy="390" rx="300" ry="60" fill="${c.accent1}" opacity="0.08"/>
      <ellipse cx="400" cy="420" rx="350" ry="50" fill="${c.accent1}" opacity="0.06"/>

      ${sparkles(c.accent3, 10, 800, 450)}

      <rect width="800" height="450" fill="url(#titleFade)"/>
    `,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function seededRand(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const rand = seededRand(42);

function stars(count, w, h) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = (rand() * w).toFixed(1);
    const y = (rand() * h).toFixed(1);
    const r = (rand() * 2 + 0.5).toFixed(1);
    const op = (rand() * 0.6 + 0.3).toFixed(2);
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${op}"/>`;
  }
  return out;
}

function sparkles(color, count, w, h) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = (rand() * (w - 30) + 15).toFixed(0);
    const y = (rand() * (h - 30) + 15).toFixed(0);
    const size = (rand() * 14 + 8).toFixed(0);
    const op = (rand() * 0.7 + 0.3).toFixed(2);
    out += `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" opacity="${op}" text-anchor="middle">✦</text>`;
  }
  return out;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const storyFiles = fs.readdirSync(STORIES_DIR).filter(f => f.endsWith('.json'));

for (const file of storyFiles) {
  const filePath = path.join(STORIES_DIR, file);
  const story = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const design = COVER_DESIGNS[story.id];

  if (!design) {
    console.log(`⚠  No cover design for ${story.id}, skipping`);
    continue;
  }

  const c = design;
  const inner = design.render(c);
  const filename = `${story.id}-cover.svg`;
  const outPath = path.join(OUT_DIR, filename);
  const publicPath = `/illustrations/${filename}`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  ${inner}
</svg>`;

  fs.writeFileSync(outPath, svg, 'utf8');
  story.coverImageUrl = publicPath;
  fs.writeFileSync(filePath, JSON.stringify(story, null, 2), 'utf8');
  console.log(`✓ ${story.id} → ${publicPath}`);
}

console.log('\nDone');
