import fs from 'fs';
import path from 'path';
import type { Story, StoryNode } from '@/types/story';

const STORIES_DIR = path.join(process.cwd(), 'src', 'stories');

export type StoryWithNodes = Story & { nodes: StoryNode[] };

function readAllStoryFiles(): StoryWithNodes[] {
  const files = fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith('.json'));
  return files.map((file) => {
    const content = fs.readFileSync(path.join(STORIES_DIR, file), 'utf-8');
    return JSON.parse(content) as StoryWithNodes;
  });
}

export function loadStory(idOrSlug: string): StoryWithNodes | null {
  const stories = readAllStoryFiles();
  return stories.find((s) => s.id === idOrSlug || s.slug === idOrSlug) ?? null;
}

export function listStories(): Omit<StoryWithNodes, 'nodes'>[] {
  const stories = readAllStoryFiles();
  return stories.map(({ nodes: _nodes, ...meta }) => meta);
}

export function getNodeFromStory(story: StoryWithNodes, nodeId: string): StoryNode | null {
  return story.nodes.find((n) => n.id === nodeId) ?? null;
}
