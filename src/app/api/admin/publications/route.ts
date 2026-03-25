import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { betterAuth } from 'better-auth'

export async function POST(req: NextRequest) {
  const user = await betterAuth.getUser({ req })
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, description, href, subjectId } = await req.json()

  if (!title || !description || !href || !subjectId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const publication = await prisma.publication.create({
    data: { title, description, href, subjectId }
  })

  return NextResponse.json(publication)
}