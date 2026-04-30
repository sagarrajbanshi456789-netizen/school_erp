// src/app/api/employee/books/[bookId]/pages/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request, context: any) {
  try {
    console.log('================ PAGES API START ================')

    /* ---------------- PARAMS (FIXED) ---------------- */
    const { params } = context
    const { bookId } = await params

    console.log('📚 Book ID:', bookId)

    /* ---------------- QUERY PARAMS (FIXED) ---------------- */
    const publicationId = new URL(req.url).searchParams.get('publicationId')
    console.log('📚 Publication ID:', publicationId)

    /* ---------------- AUTH ---------------- */
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      console.log('❌ Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employeeId = session.user.id
    console.log('👤 Employee ID:', employeeId)

    /* ---------------- VALIDATE ASSIGNMENT ---------------- */
    const assignedBook = await prisma.assignedBook.findFirst({
      where: {
        publicationId: bookId,
        employeeId,
      },
      include: {
        publication: true,
      },
    })

    if (!assignedBook) {
      console.log('❌ Book not found for employee')
      return NextResponse.json(
        { error: 'Book not found or not assigned' },
        { status: 404 }
      )
    }

    console.log('📖 Assigned publication:', assignedBook.publicationId)

    /* ---------------- FINAL PUBLICATION ID ---------------- */
    const finalPublicationId = publicationId || assignedBook.publicationId

    console.log('🎯 Final publication ID used:', finalPublicationId)

    /* ---------------- FETCH PAGES (IMPORTANT FIX) ---------------- */
    const pages = await prisma.publicationPage.findMany({
      where: {
        publicationId: finalPublicationId, // ✅ IMPORTANT FIX
      },
      orderBy: {
        pageNumber: 'asc',
      },
      select: {
        id: true,
        publicationId: true,
        title: true,
        pageNumber: true,
        contentHtml: true,
        contentJson: true,
        thumbnail: true,
      },
    })

    console.log(`📄 Pages found: ${pages.length}`)

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