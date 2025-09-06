import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the API key from the request headers
  const apiKey = request.headers.get('x-api-key');
  
  // Skip middleware for non-API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Check if the API key is valid
  if (!apiKey || apiKey !== 'pdf_qa_dev_secret_key') {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing API key' },
      { status: 401 }
    );
  }
  
  // If the API key is valid, continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/api/:path*',
};
