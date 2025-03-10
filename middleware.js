import { NextResponse } from 'next/server';

export const config = {
  matcher: '/api/:path*',
};

export default async function middleware(request) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Add the D1 database to the request environment
  // This is automatically handled by Cloudflare Workers when deployed
  // For local development, you'll need to use wrangler
  
  // Continue with the request
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  return response;
} 