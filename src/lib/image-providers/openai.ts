import OpenAI from 'openai';

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? 'missing' });
  }
  return _client;
}

export async function generateImage(prompt: string): Promise<string> {
  const response = await getClient().images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });

  const url = (response.data ?? [])[0]?.url;
  if (!url) {
    throw new Error('OpenAI image generation returned no URL');
  }

  return url;
}
