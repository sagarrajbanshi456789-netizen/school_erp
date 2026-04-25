// src/app/api/employee/dashboard/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    console.log('================ DASHBOARD API HIT ================')

    // 1. SESSION CHECK
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    console.log('SESSION RESPONSE:', session)

    if (!session?.user?.id) {
      console.log('❌ No session user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employeeId = session.user.id
    console.log('✅ EMPLOYEE ID:', employeeId)

    // 2. CHECK USER EXISTS IN DB
    const userCheck = await prisma.user.findUnique({
      where: { id: employeeId },
    })

    console.log('👤 USER IN DB:', userCheck)

    if (!userCheck) {
      console.log('❌ USER NOT FOUND IN DATABASE')
    }

    // 3. FETCH ASSIGNED BOOKS (RAW)
    const assignedBooks = await prisma.assignedBook.findMany({
      where: { employeeId },
      include: {
        publication: {
          include: {
            pages: true,
          },
        },
      },
    })

    console.log('📚 RAW ASSIGNED BOOKS:', JSON.stringify(assignedBooks, null, 2))

    // 4. CHECK COUNT
    console.log('📊 ASSIGNED BOOKS COUNT:', assignedBooks.length)

    // 5. FORMAT RESPONSE
    const formatted = (assignedBooks || []).map((b) => {
      console.log('➡️ Mapping book:', b.publication?.title)

      return {
        id: b.publication.id,
        title: b.publication.title,
        publication: b.publication.title,
        totalPages: b.publication.pages?.length || 0,
        completedPages: b.completedPages || 0,
      }
    })

    console.log('✅ FORMATTED RESPONSE:', formatted)

    // 6. FINAL RESPONSE
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