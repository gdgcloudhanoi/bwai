import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

function buildTargetUrl(baseUrl: string, filename: string): string {
  const trimmedBase = baseUrl.replace(/\/+$/, '')
  return `${trimmedBase}/${encodeURIComponent(filename)}`
}

async function proxyUpstream(
  req: NextRequest,
  filename: string,
  method: 'GET' | 'HEAD',
): Promise<Response> {
  const baseUrl = process.env.IMAGES_URL
  if (!baseUrl) {
    return new Response('IMAGES_URL is not configured', { status: 500 })
  }

  if (!/^[\w.\-]+$/.test(filename)) {
    return new Response('Invalid filename', { status: 400 })
  }

  const targetUrl = buildTargetUrl(baseUrl, filename)
  console.log(targetUrl)

  const upstream = await fetch(targetUrl, {
    method,
    cache: 'no-store',
  })

  const headers = new Headers()
  const contentType = upstream.headers.get('content-type')
  const contentLength = upstream.headers.get('content-length')
  const cacheControl = upstream.headers.get('cache-control')
  const etag = upstream.headers.get('etag')
  const lastModified = upstream.headers.get('last-modified')

  if (contentType) headers.set('Content-Type', contentType)
  if (contentLength) headers.set('Content-Length', contentLength)
  if (cacheControl) headers.set('Cache-Control', cacheControl)
  if (etag) headers.set('ETag', etag)
  if (lastModified) headers.set('Last-Modified', lastModified)

  return new Response(method === 'HEAD' ? null : upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  })
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string }> },
): Promise<Response> {
  const { path } = await ctx.params
  return proxyUpstream(req, path[path.length - 1], 'GET')
}

export async function HEAD(
  req: NextRequest,
  ctx: { params: Promise<{ path: string }> },
): Promise<Response> {
  const { path } = await ctx.params
  return proxyUpstream(req, path[path.length - 1], 'HEAD')
}


