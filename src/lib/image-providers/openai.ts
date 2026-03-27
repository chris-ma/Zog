import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an image using OpenAI DALL-E 3.
 * @param prompt  The image generation prompt
 * @returns       The URL of the generated image
 */
export async function generateImage(prompt: string): Promise<string> {
  const response = await client.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });

  const url = response.data[0]?.url;
  if (!url) {
    throw new Error('OpenAI image generation returned no URL');
  }

  return url;
}
