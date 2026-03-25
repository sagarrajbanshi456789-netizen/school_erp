import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const levelId = req.nextUrl.searchParams.get('levelId')
  if (!levelId) return NextResponse.json([], { status: 400 })

  const classes = await prisma.class.findMany({
    where: { levelId },
    select: { id: true, name: true, levelId: true }
  })
  return NextResponse.json(classes)
}