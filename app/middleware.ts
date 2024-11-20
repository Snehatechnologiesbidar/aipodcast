import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = 100; // requests per minute
const rateLimitWindow = 60 * 1000; // 1 minute in milliseconds
const ipRequests = new Map<string, number[]>();

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/synthesize-speech')) {
    const ip = request.ip ?? 'anonymous';
    const now = Date.now();
    const requests = ipRequests.get(ip) || [];
    
    // Clean old requests
    const recentRequests = requests.filter(time => now - time < rateLimitWindow);
    
    if (recentRequests.length >= rateLimit) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    recentRequests.push(now);
    ipRequests.set(ip, recentRequests);
  }

  return NextResponse.next();
} 