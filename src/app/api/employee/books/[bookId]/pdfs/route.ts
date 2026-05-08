// src/app/api/employee/books/[bookId]/pdfs/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

/* ---------------- GET ALL PDFS ---------------- */
export async function GET(req: Request, context: any) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookId } = context.params

    const pdfs = await prisma.bookPdf.findMany({
      where: {   publicationId: bookId,},
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ pdfs })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/* ---------------- UPLOAD PDF ---------------- */
export async function POST(req: Request, context: any) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookId } = context.params
    const formData = await req.formData()

    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public/uploads/pdfs')

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, fileName)

    fs.writeFileSync(filePath, buffer)

    const fileUrl = `/uploads/pdfs/${fileName}`

    const pdf = await prisma.bookPdf.create({
      data: {
        publicationId: bookId,
        fileName: file.name,
        fileUrl,
        uploadedById: session.user.id,
      },
    })

    return NextResponse.json({ pdf })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}