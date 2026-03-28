import { NextRequest, NextResponse } from 'next/server';

// Simple image proxy so the browser doesn't hit Pollinations directly.
// External image hosts can block non-browser IPs/referrers; routing through
// our Vercel function avoids that entirely.
//
// GET /api/image-proxy?url=<encoded-pollinations-url>

const ALLOWED_HOSTS = ['image.pollinations.ai'];

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url');
  if (!raw) {
    return new NextResponse('Missing url param', { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(raw);
  } catch {
    return new NextResponse('Invalid url param', { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(targetUrl.hostname)) {
    return new NextResponse('Host not allowed', { status: 403 });
  }

  try {
    const upstream = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
        Referer: 'https://pollinations.ai/',
      },
      // Vercel serverless functions time out at 10-30s; Pollinations can be slow
      // on cold cache. We'll propagate whatever we get.
      signal: AbortSignal.timeout(25_000),
    });

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.status}`, {
        status: upstream.status,
      });
    }

    const contentType = upstream.headers.get('content-type') ?? 'image/jpeg';
    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache aggressively — same seed always gives same image
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('[image-proxy]', err);
    return new NextResponse('Failed to fetch image', { status: 502 });
  }
}
