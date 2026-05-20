// Import Next.js request/response helpers
import { NextRequest, NextResponse } from "next/server"

// Import Prisma client
import { prisma } from "@/lib/prisma"

// System admin ID from environment variables
const SYSTEM_ADMIN_ID = process.env.SYSTEM_ADMIN_ID!

// Handle POST request
export async function POST(req: NextRequest) {

  try {

    // Parse request body
    const body = await req.json()

    // Extract values from request body
    const { userId, adminId } = body

    // Final user ID
    const finalUserId = userId

    // Final admin ID
    const finalAdminId = adminId || SYSTEM_ADMIN_ID

    // If no user ID provided
    if (!finalUserId) {

      // Return error response
      return NextResponse.json(
        {
          error: "Missing userId",
        },
        {
          status: 400,
        }
      )
    }

    // ======================================
    // VALIDATE USER EXISTS
    // ======================================

    // Find user
    const user = await prisma.user.findUnique({

      // Search by user ID
      where: {
        id: finalUserId,
      },

      // Select required fields only
      select: {
        id: true,
        name: true,
      },
    })

    // If user not found
    if (!user) {

      // Return 404
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      )
    }

    // ======================================
    // VALIDATE ADMIN EXISTS
    // ======================================

    // Find admin
    const admin = await prisma.user.findUnique({

      // Search by admin ID
      where: {
        id: finalAdminId,
      },

      // Select required fields only
      select: {
        id: true,
      },
    })

    // If admin not found
    if (!admin) {

      // Return 404
      return NextResponse.json(
        {
          error: "Admin not found",
        },
        {
          status: 404,
        }
      )
    }

    // ======================================
    // FIND EXISTING CONVERSATION
    // ======================================

    // Search existing conversation
    const existingConversation =
      await prisma.conversation.findFirst({

        where: {

          // Conversation must contain both users
          AND: [

            // Logged-in user
            {
              participants: {
                some: {
                  userId: finalUserId,
                },
              },
            },

            // Admin user
            {
              participants: {
                some: {
                  userId: finalAdminId,
                },
              },
            },
          ],
        },

        // Include related data
        include: {

          // Include participants
          participants: {

            // Include user info
            include: {
              user: true,
            },
          },

          // Include messages
          messages: {

            // Sort oldest first
            orderBy: {
              createdAt: "asc",
            },

            // Include sender
            include: {
              sender: true,
            },
          },
        },
      })

    // If conversation already exists
    if (existingConversation) {

      // Return existing conversation
      return NextResponse.json({
        success: true,
        conversation: existingConversation,
      })
    }

    // ======================================
    // CREATE NEW CONVERSATION
    // ======================================

    // Create conversation
    const newConversation =
      await prisma.conversation.create({

        data: {

          // Create participants
          participants: {

            create: [

              // Logged-in user
              {
                userId: finalUserId,
              },

              // Admin user
              {
                userId: finalAdminId,
              },
            ],
          },
        },

        // Include related data
        include: {

          // Include participants
          participants: {

            // Include user info
            include: {
              user: true,
            },
          },

          // Include messages
          messages: true,
        },
      })

    // Return created conversation
    return NextResponse.json({
      success: true,
      conversation: newConversation,
    })

  } catch (error) {

    // Log server error
    console.error(
      "CHAT_CONVERSATION_API_ERROR:",
      error
    )

    // Return generic error
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create conversation",
      },
      {
        status: 500,
      }
    )
  }
}