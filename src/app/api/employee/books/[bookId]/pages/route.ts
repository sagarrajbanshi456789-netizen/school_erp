// src/app/api/employee/books/[bookId]/pages/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  req: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    /* ---------------- AUTH ---------------- */
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employeeId = session.user.id
    const { bookId } = params

    /* ---------------- QUERY PARAMS ---------------- */
    const { searchParams } = new URL(req.url)
    const publicationId = searchParams.get('publicationId')

    /* ---------------- VALIDATE BOOK ---------------- */
    const assignedBook = await prisma.assignedBook.findFirst({
      where: {
        id: bookId,
        employeeId,
      },
      include: {
        publication: true,
      },
    })

    if (!assignedBook) {
      return NextResponse.json(
        { error: 'Book not found or not assigned' },
        { status: 404 }
      )
    }

    /* ---------------- SECURITY CHECK ---------------- */
    if (publicationId && publicationId !== assignedBook.publicationId) {
      return NextResponse.json(
        { error: 'Invalid publication access' },
        { status: 403 }
      )
    }

    /* ---------------- FINAL PUBLICATION ---------------- */
    const finalPublicationId =
      publicationId || assignedBook.publicationId

    /* ---------------- FETCH PAGES ---------------- */
   const pages = await prisma.publicationPage.findMany({
  where: {
    publicationId: publicationId || assignedBook.publicationId,
  },
  orderBy: {
    pageNumber: 'asc',
  },
  select: {
    id: true,
    title: true,
    pageNumber: true,
    contentHtml: true,
    contentJson: true, // ✅ ADD THIS BACK
    thumbnail: true,
  },
})

    /* ---------------- FETCH PROGRESS ---------------- */
    const progress = await prisma.pageProgress.findMany({
      where: {
        userId: employeeId,
        page: {
          publicationId: finalPublicationId,
        },
      },
      select: {
        pageId: true,
        completed: true,
      },
    })

    /* ---------------- MERGE PROGRESS ---------------- */
    const progressMap = new Map(
      progress.map((p) => [p.pageId, p.completed])
    )

    const pagesWithProgress = pages.map((page) => ({
      ...page,
      completed: progressMap.get(page.id) || false,
    }))

    /* ---------------- RESPONSE ---------------- */
    return NextResponse.json({
      pages: pagesWithProgress,
      publication: assignedBook.publication,
    })
  } catch (err) {
    console.error('🔥 PAGES API ERROR:', err)

    return NextResponse.json(
      {
        error: 'Server error',
        details: err instanceof Error ? err.message : err,
      },
      { status: 500 }
    )
  }
}