import { NextRequest, NextResponse } from 'next/server';
import http from 'node:http';

function forwardRequest(options: {
  method: string;
  path: string;
  headers?: Record<string, string>;
  body?: string;
}): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 6000,
        path: options.path,
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      },
      (res) => {
        let rawData = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(rawData);
            resolve({ status: res.statusCode || 200, data: parsed });
          } catch {
            resolve({ status: res.statusCode || 200, data: rawData });
          }
        });
      }
    );

    req.on('error', (err) => {
      reject(err);
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const subpath = resolvedParams.path ? resolvedParams.path.join('/') : '';
    const search = request.nextUrl.search || '';
    const cleanPath = `/api/v1/${subpath}${subpath.endsWith('/') ? '' : '/'}${search}`;

    const { status, data } = await forwardRequest({
      method: 'GET',
      path: cleanPath,
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    console.warn('[Proxy GET] Error forwarding to Django (port 6000):', error);
    return NextResponse.json({ error: 'Backend connection failure' }, { status: 502 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const subpath = resolvedParams.path ? resolvedParams.path.join('/') : '';
    const search = request.nextUrl.search || '';
    const cleanPath = `/api/v1/${subpath}${subpath.endsWith('/') ? '' : '/'}${search}`;
    const body = await request.text();

    const { status, data } = await forwardRequest({
      method: 'POST',
      path: cleanPath,
      body,
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    console.warn('[Proxy POST] Error forwarding to Django (port 6000):', error);
    return NextResponse.json({ error: 'Backend connection failure' }, { status: 502 });
  }
}
