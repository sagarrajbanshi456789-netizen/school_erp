import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth' // ✅ use instance

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  const user = session?.user

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, author, href, levelId, classId } = await req.json()

  if (!title || !author || !href || !levelId || !classId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const book = await prisma.book.create({
      data: { title, author, href, levelId, classId }
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}