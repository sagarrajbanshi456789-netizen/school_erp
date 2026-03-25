import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const levels = await prisma.level.findMany({
    select: { id: true, name: true }
  })
  return NextResponse.json(levels)
}