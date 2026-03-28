import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const { employeeId, books } = await req.json()

  await prisma.assignedBook.deleteMany({
    where: { employeeId }
  })

  await prisma.assignedBook.createMany({
    data: books.map((id: string) => ({
      employeeId,
      publicationId: id
    }))
  })

  return NextResponse.json({ success: true })
}