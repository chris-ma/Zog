import type { Story, StoryNode, DynamicContext, GeneratedScene } from '@/types/story';
import { generateScene as claudeGenerateScene } from '@/lib/claude';

/**
 * Retrieve a node from a pre-authored (static) story by node ID.
 * Returns undefined if the node does not exist in the story.
 */
export function getStaticNode(story: Story, nodeId: string): StoryNode | undefined {
  if (!story.nodes) {
    return undefined;
  }
  return story.nodes.find((node) => node.id === nodeId);
}

/**
 * Generate a dynamic scene for a story using the Claude AI model.
 * Delegates to the claude.ts integration.
 */
export async function getDynamicScene(context: DynamicContext): Promise<GeneratedScene> {
  return claudeGenerateScene(context);
}

/**
 * Build a detailed image generation prompt from a story node and its parent story.
 * Combines the node's own image prompt with story-level art style and mood.
 */
export function buildImagePrompt(node: StoryNode, story: Story): string {
  const styleContext = [
    story.artStyle ? `Art style: ${story.artStyle}` : null,
    story.mood ? `Mood: ${story.mood}` : null,
  ]
    .filter(Boolean)
    .join('. ');

  const base = node.imagePrompt.trim();

  if (!styleContext) {
    return base;
  }

  // Append style context if it's not already in the prompt
  if (base.toLowerCase().includes(story.artStyle?.toLowerCase() ?? '___nomatch___')) {
    return base;
  }

  return `${base}. ${styleContext}.`;
}

/**
 * Return the first N words of a prose string, appending an ellipsis if truncated.
 * Useful for summary/preview displays.
 */
export function summarizeProse(prose: string, wordCount: number): string {
  const words = prose.trim().split(/\s+/);
  if (words.length <= wordCount) {
    return prose.trim();
  }
  return words.slice(0, wordCount).join(' ') + '…';
}
