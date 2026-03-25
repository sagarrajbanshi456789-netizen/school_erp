import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const classId = req.nextUrl.searchParams.get('classId')
  if (!classId) return NextResponse.json([], { status: 400 })

  const subjects = await prisma.subject.findMany({
    where: { classId },
    select: { id: true, name: true, classId: true }
  })
  return NextResponse.json(subjects)
}