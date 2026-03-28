#!/usr/bin/env node
/**
 * generate-burp-quest-images.mjs
 *
 * Builds stable Pollinations.ai image URLs for every node in burp-quest.json
 * and writes them back as cachedImageUrl. No API key required — Pollinations
 * serves images directly from the URL.
 *
 * Usage:  node scripts/generate-burp-quest-images.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORY_PATH = path.join(__dirname, '../src/stories/burp-quest.json');

const STYLE_PREFIX =
  'vibrant cartoon illustration, bold outlines, bright colours, whimsical children\'s book style, no text, no watermarks,';

function buildPollinationsUrl(rawPrompt, seed) {
  const prompt = `${STYLE_PREFIX} ${rawPrompt}`;
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=576&nologo=true&seed=${seed}&model=flux`;
}

/** Deterministic seed from node ID so the same node always gets the same image */
function seedFromId(id) {
  const hash = createHash('sha256').update(id).digest('hex');
  return parseInt(hash.slice(0, 8), 16) % 1_000_000;
}

const story = JSON.parse(readFileSync(STORY_PATH, 'utf8'));

let updated = 0;
for (const node of story.nodes) {
  if (!node.imagePrompt) continue;
  const seed = seedFromId(node.id);
  node.cachedImageUrl = buildPollinationsUrl(node.imagePrompt, seed);
  updated++;
  console.log(`✓ ${node.id.padEnd(12)} seed=${seed}`);
}

writeFileSync(STORY_PATH, JSON.stringify(story, null, 2) + '\n');
console.log(`\nDone — updated ${updated} nodes in burp-quest.json`);
