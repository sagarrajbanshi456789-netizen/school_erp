// src/app/api/admin/publications/route.ts
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

import slugify from 'slugify'

export async function POST(
  req: NextRequest
) {
  try {
    // Check session
    const session =
      await auth.api.getSession({
        headers: req.headers,
      })

    const user = session?.user

    // Only admins
    if (
      !user ||
      user.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    // Parse body
    const body = await req.json()

    const {
      title,
      description,
      subjectId,
    } = body

    // Validation
    if (
      !title ||
      !description ||
      !subjectId
    ) {
      return NextResponse.json(
        {
          error:
            'Title, description and subject are required',
        },
        {
          status: 400,
        }
      )
    }

    // Generate slug
    let slug = slugify(title, {
      lower: true,
      strict: true,
    })

    // Prevent duplicate slugs
    const existingPublication =
      await prisma.publication.findUnique({
        where: {
          slug,
        },
      })

    // Add random suffix if exists
    if (existingPublication) {
      slug = `${slug}-${Date.now()}`
    }

    // Create publication
    const publication =
      await prisma.publication.create({
        data: {
          title: title.trim(),
          description:
            description.trim(),
          slug,
          subjectId,
        },
      })

    return NextResponse.json(
      publication,
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error(
      'CREATE_PUBLICATION_ERROR',
      error
    )

    return NextResponse.json(
      {
        error:
          'Failed to create publication',
      },
      {
        status: 500,
      }
    )
  }
}