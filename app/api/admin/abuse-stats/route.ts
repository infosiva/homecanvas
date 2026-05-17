import { NextRequest, NextResponse } from 'next/server'
import { getAbuseStats } from '@/lib/abuse-guard'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return NextResponse.json(getAbuseStats())
}
