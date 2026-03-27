/**
 * Image provider factory.
 * Reads IMAGE_PROVIDER from the environment and re-exports the appropriate
 * generateImage function. Defaults to 'openai' if the variable is not set.
 */

type ImageProvider = 'openai' | 'nanobanana';

const provider = (process.env.IMAGE_PROVIDER as ImageProvider) ?? 'openai';

let _generateImage: (prompt: string) => Promise<string>;

if (provider === 'nanobanana') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  _generateImage = require('./nanobanana').generateImage;
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  _generateImage = require('./openai').generateImage;
}

export const generateImage = _generateImage;
