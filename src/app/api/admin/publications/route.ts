// src/app/api/admin/publications/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  const user = session?.user

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, description, href, subjectId } = await req.json()

  if (!title || !description || !href || !subjectId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const publication = await prisma.publication.create({
    data: {
      title,
      description,
      href,
      subjectId,
      slug: slugify(title), // ✅ FIXED
    },
  })

  return NextResponse.json(publication)
}