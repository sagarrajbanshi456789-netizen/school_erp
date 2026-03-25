import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { betterAuth } from 'better-auth'

export async function POST(req: NextRequest) {
  const user = await betterAuth.getUser({ req })
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, author, href, levelId, classId } = await req.json()

  if (!title || !author || !href || !levelId || !classId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const book = await prisma.book.create({
    data: { title, author, href, levelId, classId }
  })

  return NextResponse.json(book)
}