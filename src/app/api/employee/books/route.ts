import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const employeeId = 'CURRENT_USER_ID'

    const assignedBooks = await prisma.assignedBook.findMany({
      where: { employeeId },
      include: {
        publication: {
          include: {
            pages: true, // ✅ IMPORTANT FIX
          },
        },
      },
    })

    const result = assignedBooks.map((b) => ({
      id: b.id,
      title: b.publication.title,
      publication: b.publication.title,
      totalPages: b.publication.pages.length,
      completedPages: b.completedPages ?? 0,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}