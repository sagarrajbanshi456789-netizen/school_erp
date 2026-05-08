import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

/* ---------------- GET SINGLE PDF ---------------- */
export async function GET(req: Request, context: any) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pdfId } = context.params

    const pdf = await prisma.bookPdf.findUnique({
      where: { id: pdfId },
    })

    if (!pdf) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
    }

    return NextResponse.json({ pdf })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/* ---------------- DELETE PDF ---------------- */
export async function DELETE(req: Request, context: any) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pdfId } = context.params

    const pdf = await prisma.bookPdf.findUnique({
      where: { id: pdfId },
    })

    if (!pdf) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
    }

    /* delete file from disk */
    const filePath = path.join(process.cwd(), 'public', pdf.fileUrl)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await prisma.bookPdf.delete({
      where: { id: pdfId },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}