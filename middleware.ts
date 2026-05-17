import { NextRequest, NextResponse } from 'next/server'
import { middlewareGuard } from '@/lib/abuse-guard'

export function middleware(req: NextRequest) {
  const block = middlewareGuard(req)
  if (block) return block
  return NextResponse.next()
}

export const config = { matcher: ['/api/:path*'] }
