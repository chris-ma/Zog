// TODO: Implement NanoBanana image generation once the API spec is finalised.
// The NanoBanana provider is a placeholder — replace this implementation with
// actual API calls when the endpoint/auth details are available.

/**
 * Generate an image using the NanoBanana provider.
 *
 * @param prompt  The image generation prompt
 * @returns       The URL of the generated image
 */
export async function generateImage(_prompt: string): Promise<string> {
  throw new Error(
    'NanoBanana image provider is not yet implemented. ' +
      'Set IMAGE_PROVIDER=openai or implement this provider once the API is available.',
  );
}
