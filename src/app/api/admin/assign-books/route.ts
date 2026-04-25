// src/app/api/admin/assign-books/route.ts

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type BookPayload = {
  id: string
  totalPages: number
}

export async function POST(req: Request) {
  try {
    const { employeeId, books } = await req.json()

    if (!employeeId) {
      return NextResponse.json(
        { success: false, message: "Employee ID is required" },
        { status: 400 }
      )
    }

    if (!Array.isArray(books)) {
      return NextResponse.json(
        { success: false, message: "Invalid books data" },
        { status: 400 }
      )
    }

    await prisma.$transaction(async (tx) => {
      /* ------------------------------------
         CHECK DUPLICATE BOOKS FOR OTHERS
      ------------------------------------ */
      const bookIds = books.map((book: BookPayload) => book.id)

      if (bookIds.length > 0) {
        const alreadyAssigned = await tx.assignedBook.findMany({
          where: {
            publicationId: { in: bookIds },
            employeeId: { not: employeeId },
          },
          select: {
            publicationId: true,
          },
        })

        if (alreadyAssigned.length > 0) {
          throw new Error("Some books are already assigned to another employee")
        }
      }

      /* ------------------------------------
         REMOVE OLD BOOKS OF CURRENT EMPLOYEE
      ------------------------------------ */
      await tx.assignedBook.deleteMany({
        where: { employeeId },
      })

      /* ------------------------------------
         INSERT NEW BOOKS
      ------------------------------------ */
      if (books.length > 0) {
        await tx.assignedBook.createMany({
          data: books.map((book: BookPayload) => ({
            employeeId,
            publicationId: book.id,
            totalPages: Number(book.totalPages) || 0,
            completedPages: 0,
          })),
        })
      }
    })

    /* ------------------------------------
       RETURN LIVE COUNT
    ------------------------------------ */
    return NextResponse.json({
      success: true,
      message: "Books assigned successfully",
      count: books.length,
    })
  } catch (error: any) {
    console.error("Assign Books Error:", error)

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Something went wrong",
      },
      { status: 500 }
    )
  }
}