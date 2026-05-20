// src/app/api/employee/dashboard/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const dynamic = "force-dynamic"
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employeeId = session.user.id

    const assignedBooks = await prisma.assignedBook.findMany({
      where: { employeeId },
      include: {
        publication: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    const formatted = await Promise.all(
      assignedBooks.map(async (b) => {
        const publicationId = b.publication.id

        // ✅ FAST COUNT: total pages
        const totalPages = await prisma.publicationPage.count({
          where: {
            publicationId,
          },
        })

        // ✅ FAST COUNT: completed pages
        const completedPages = await prisma.pageProgress.count({
          where: {
            userId: employeeId,
            completed: true,
            page: {
              publicationId,
            },
          },
        })
        console.log("hi")
        console.log(`📌 Employee ID: ${employeeId} - Publication: ${b.publication.title} - Total Pages: ${totalPages}, Completed Pages: ${completedPages}`)
        console.log(`📚 Book: ${b.publication.title} - Total Pages: ${totalPages}, Completed Pages: ${completedPages}`)
        return {
          id: publicationId,
          title: b.publication.title,
          slug: b.publication.slug,
          publication: b.publication.title,
          link: `/primary/class-3/math/${b.publication.slug}`, // construct dynamically
          totalPages,
          completedPages,
          employeeId,

        }
      })
    )

    return NextResponse.json({
      assignedBooks: formatted,
    })
  } catch (err) {
    console.error('🔥 DASHBOARD API ERROR:', err)

    return NextResponse.json(
      {
        error: 'Server error',
        details: err instanceof Error ? err.message : err,
      },
      { status: 500 }
    )
  }
}