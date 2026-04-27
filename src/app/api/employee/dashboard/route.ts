import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    console.log('================ DASHBOARD API HIT ================')

    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employeeId = session.user.id

    const userCheck = await prisma.user.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (!userCheck) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const assignedBooks = await prisma.assignedBook.findMany({
      where: { employeeId },
      include: {
        publication: {
          select: {
            id: true,
            title: true,
            totalPages: true,
          },
        },
      },
    })

    const formatted = assignedBooks
      .map((b) => {
        if (!b.publication) return null

        return {
          id: b.publication.id,
          title: b.publication.title,
          publication: b.publication.title,
          totalPages: b.publication.totalPages || 0,
          completedPages: b.completedPages || 0,
        }
      })
      .filter(Boolean)

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
  } finally {
    console.log('================ DASHBOARD API END ================')
  }
}