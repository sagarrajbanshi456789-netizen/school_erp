import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    const user = session?.user

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const {
      title,
      author,
      href,
      subjectId,
      totalPages,
      description,
      slug,
    } = await req.json()

    if (!title || !href || !subjectId || !slug) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    const publication = await prisma.publication.create({
      data: {
        title,
        author,
        href,
        subjectId,
        description: description || "",
        slug,
        totalPages: Number(totalPages) || 0,
      },
    })

    return NextResponse.json(publication)
  } catch (error) {
    console.error("Create Publication Error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}