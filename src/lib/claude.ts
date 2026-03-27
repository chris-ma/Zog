import Anthropic from '@anthropic-ai/sdk';
import type { DynamicContext, GeneratedScene, Choice, EndingType } from '@/types/story';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a master storyteller for an interactive Choose Your Own Adventure game.
Your task is to generate compelling, immersive story scenes in strict JSON format.

Rules:
- Always respond with valid JSON matching the GeneratedScene schema.
- Match the genre, art style, and mood of the story exactly.
- Write vivid, atmospheric prose (150–300 words per scene).
- Provide 2–4 meaningful choices that branch the narrative meaningfully.
- Image prompts should be detailed, cinematic, and suitable for DALL-E image generation.
- Terminal nodes (isTerminal: true) should have no choices and include an endingType.
- Non-terminal nodes must have at least 2 choices.
- Keep the story coherent with the choices made so far.

Response schema:
{
  "title": "string — short scene title",
  "prose": "string — narrative prose for this scene",
  "imagePrompt": "string — detailed image generation prompt",
  "choices": [
    { "id": "string", "text": "string — player-facing choice text", "nextNodeId": "dynamic", "consequence": "optional hint" }
  ],
  "isTerminal": false,
  "endingType": null
}`;

/**
 * Generate a dynamic story scene using Claude.
 * @param context  The dynamic context carrying story state and history
 * @returns        A GeneratedScene ready to be rendered
 */
export async function generateScene(context: DynamicContext): Promise<GeneratedScene> {
  const userMessage = `
Story: "${context.story.title}"
Description: ${context.story.description}
Genre: ${context.story.genre.join(', ')}
Art Style: ${context.story.artStyle}
Mood: ${context.story.mood}
Scene depth: ${context.nodeDepth}
${context.lastChoice ? `Player's last choice: "${context.lastChoice}"` : ''}
${
  context.previousProse.length > 0
    ? `Story so far (condensed):\n${context.previousProse.slice(-3).join('\n---\n')}`
    : 'This is the opening scene.'
}

Generate the next scene as JSON. ${
    context.nodeDepth >= 8
      ? 'This should be a terminal (ending) scene — set isTerminal: true and include an appropriate endingType.'
      : 'This should continue the story with meaningful choices.'
  }
`.trim();

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Claude returned no text content');
  }

  const raw = textBlock.text.trim();

  // Strip markdown code fences if present
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  let parsed: GeneratedScene;
  try {
    parsed = JSON.parse(jsonStr) as GeneratedScene;
  } catch {
    throw new Error(`Failed to parse Claude response as JSON: ${raw.slice(0, 200)}`);
  }

  // Assign deterministic IDs to dynamically-generated choices
  const choices: Choice[] = (parsed.choices ?? []).map((c, i) => ({
    ...c,
    id: c.id && c.id !== 'dynamic' ? c.id : `choice-${context.nodeDepth}-${i}`,
    nextNodeId:
      c.nextNodeId && c.nextNodeId !== 'dynamic'
        ? c.nextNodeId
        : `node-${context.nodeDepth + 1}-${i}`,
  }));

  return {
    title: parsed.title,
    prose: parsed.prose,
    imagePrompt: parsed.imagePrompt,
    choices: parsed.isTerminal ? [] : choices,
    isTerminal: parsed.isTerminal ?? false,
    endingType: parsed.endingType as EndingType | undefined,
  };
}
