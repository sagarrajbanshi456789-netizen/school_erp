/// <reference types="node" />

import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"
import { auth } from "../src/lib/auth"

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate())

/* --------------------- */
/* Utils */
/* --------------------- */

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")

/* --------------------- */
/* Dynamic Unsplash Images */
/* --------------------- */

function generatePageImages(
  subject: string,
  className: string,
  page: number
) {
  const query = encodeURIComponent(
    `${subject} education ${className} learning`
  )

  return {
    imageUrl: `https://source.unsplash.com/1200x1600/?${query}&sig=${page}`,
    hdImageUrl: `https://source.unsplash.com/2400x3200/?${query}&sig=${page + 50}`,
    thumbnailUrl: `https://source.unsplash.com/400x600/?${query}&sig=${page + 100}`,
  }
}

/* --------------------- */
/* Generate Demo Text */
/* --------------------- */

function generatePageContent(
  subject: string,
  className: string,
  page: number
) {
  return `
${subject} - Chapter ${page} (${className})

Topics:
- Core concepts
- Examples
- Practice questions
- Key points

This chapter explains ${subject} for ${className}
with visual learning and practical examples.
`
}

/* --------------------- */
/* Main */
/* --------------------- */

async function main() {
  console.log("🌱 Seeding database...")

  /* --------------------- */
  /* Seed Admin Account */
  /* --------------------- */

  const adminEmail = process.env.ADMIN_EMAIL || "admin@school.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Super Admin",
      },
    })

    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: "ADMIN",
        emailVerified: true,
      },
    })

    console.log("✅ Admin account created")
  }

  /* --------------------- */
  /* Levels */
  /* --------------------- */

  const levels = [
    "Primary",
    "Lower Secondary",
    "Secondary",
    "Higher Secondary",
    "Bachelors",
    "Masters",
    "Gaming",
    "Loksewa",
  ]

  const levelMap: Record<string, string[]> = {
    primary: ["Class 3", "Class 4", "Class 5"],
    "lower-secondary": ["Class 6", "Class 7", "Class 8"],
    secondary: ["Class 9", "Class 10"],
    "higher-secondary": ["Class 11", "Class 12"],
    bachelors: [
      "Bachelors Year 1",
      "Bachelors Year 2",
      "Bachelors Year 3",
      "Bachelors Year 4",
    ],
    masters: ["Masters Year 1", "Masters Year 2"],
    gaming: ["Chess", "Ludo", "Carrom", "Bagchal", "Tic Tac Toe"],
    loksewa: [
      "Loksewa Level 1",
      "Loksewa Level 2",
      "Loksewa Level 3",
    ],
  }

  const classSubjectsMap: Record<string, string[]> = {
    "Class 3": ["Math", "Science", "Nepali", "Social"],
    "Class 4": ["Math", "Science", "Nepali", "Social"],
    "Class 5": ["Math", "Science", "Nepali", "Social"],
    "Class 6": ["Math", "Science", "English", "Nepali", "Social"],
    "Class 7": ["Math", "Science", "English", "Nepali", "Social"],
    "Class 8": ["Math", "Science", "English", "Nepali", "Social"],
    "Class 9": ["Math", "Science", "English", "Nepali", "Social"],
    "Class 10": ["Math", "Science", "English", "Nepali", "Social"],

    "Class 11": [
      "Math",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Economics",
    ],

    "Class 12": [
      "Math",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Economics",
    ],
  }

  /* --------------------- */
  /* Seed Levels */
  /* --------------------- */

  for (const levelName of levels) {
    const slug = slugify(levelName)

    await prisma.level.upsert({
      where: { slug },
      update: {},
      create: {
        name: levelName,
        slug,
      },
    })
  }

  console.log("✅ Levels Seeded")

  /* --------------------- */
  /* Seed Classes */
  /* --------------------- */

  for (const [levelSlug, classes] of Object.entries(levelMap)) {
    const level = await prisma.level.findUnique({
      where: { slug: levelSlug },
    })

    if (!level) continue

    for (const cls of classes) {
      await prisma.class.upsert({
        where: {
          slug_levelId: {
            slug: slugify(cls),
            levelId: level.id,
          },
        },

        update: {},

        create: {
          name: cls,
          slug: slugify(cls),
          levelId: level.id,
          isGame: level.slug === "gaming",
        },
      })
    }
  }

  console.log("✅ Classes Seeded")

  /* --------------------- */
  /* Seed Subjects */
  /* --------------------- */

  const allClasses = await prisma.class.findMany({
    include: {
      level: true,
    },
  })

  for (const cls of allClasses) {
    if (cls.isGame) continue

    const subjects =
      classSubjectsMap[cls.name] || ["Math", "Science", "English"]

    for (const subject of subjects) {
      await prisma.subject.upsert({
        where: {
          slug_classId: {
            slug: slugify(subject),
            classId: cls.id,
          },
        },

        update: {},

        create: {
          name: subject,
          slug: slugify(subject),
          classId: cls.id,
        },
      })
    }
  }

  console.log("✅ Subjects Seeded")

  /* --------------------- */
  /* Seed Publications */
  /* --------------------- */

  const allSubjects = await prisma.subject.findMany({
    include: {
      class: {
        include: {
          level: true,
        },
      },
    },
  })

  const seedUser = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  })

  if (!seedUser) {
    throw new Error("Admin user not found")
  }

  for (const subject of allSubjects) {
    if (subject.class.isGame) continue

    const level = subject.class.level

    for (let book = 1; book <= 2; book++) {
      const title = `${subject.name} Book ${book}`
      const slug = slugify(title)

      const publication = await prisma.publication.upsert({
        where: { slug },

        update: {},

        create: {
          title,
          slug,

          description: `${subject.name} learning book for ${subject.class.name}`,

          href: `/${slugify(level.name)}/${subject.class.slug}/${subject.slug}/${slug}`,

          author: "School ERP",

          coverImage: `https://source.unsplash.com/900x1200/?${encodeURIComponent(
            `${subject.name} book education`
          )}`,

          totalPages: 8,

          subjectId: subject.id,
        },
      })

      /* --------------------- */
      /* Pages */
      /* --------------------- */

      const pagesData = []

      for (let i = 1; i <= 8; i++) {
        const images = generatePageImages(
          subject.name,
          subject.class.name,
          i
        )

        const contentText = generatePageContent(
          subject.name,
          subject.class.name,
          i
        )

        pagesData.push({
          publicationId: publication.id,

          pageNumber: i,

          title: `Page ${i}`,

          imageUrl: images.imageUrl,

          hdImageUrl: images.hdImageUrl,

          thumbnailUrl: images.thumbnailUrl,

          contentText,

          width: 1200,

          height: 1600,

          backgroundColor: "#ffffff",

          template: "BOOK_PAGE",

          isPublished: true,
        })
      }

      const createdPages = []

for (const page of pagesData) {
  const createdPage = await prisma.publicationPage.upsert({
    where: {
      publicationId_pageNumber: {
        publicationId: page.publicationId,
        pageNumber: page.pageNumber,
      },
    },

    update: page,

    create: page,
  })

  createdPages.push(createdPage)
}

      /* --------------------- */
      /* Page Progress */
      /* --------------------- */

      for (const page of createdPages) {
  await prisma.pageProgress.upsert({
    where: {
      userId_pageId: {
        userId: seedUser.id,
        pageId: page.id,
      },
    },

    update: {
      completed: page.pageNumber <= 5,
    },

    create: {
      userId: seedUser.id,
      pageId: page.id,
      completed: page.pageNumber <= 5,
    },
  })
}
    }
  }

  console.log("📚 Books & Pages Seeded")

  /* --------------------- */
  /* Chess Demo Users */
  /* --------------------- */

  console.log("♟️ Creating Chess Users...")

  const chessUsers = [
    {
      email: "player1@chess.com",
      name: "Player One",
    },
    {
      email: "player2@chess.com",
      name: "Player Two",
    },
    {
      email: "player3@chess.com",
      name: "Player Three",
    },
  ]

  for (const user of chessUsers) {
    const existing = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    })

    if (!existing) {
      await auth.api.signUpEmail({
        body: {
          email: user.email,
          password: "password123",
          name: user.name,
        },
      })
    }
  }

  const players = await prisma.user.findMany({
    where: {
      email: {
        in: chessUsers.map((u) => u.email),
      },
    },
  })

  /* --------------------- */
  /* Matchmaking Queue */
  /* --------------------- */

  for (const player of players) {
    await prisma.matchmakingQueue.upsert({
      where: {
        userId_gameType: {
          userId: player.id,
          gameType: "CHESS",
        },
      },

      update: {},

      create: {
        userId: player.id,
        gameType: "CHESS",
        timeControl: "10+0",
      },
    })
  }

  /* --------------------- */
  /* Demo Chess Game */
  /* --------------------- */

  if (players.length >= 2) {
    await prisma.game.create({
      data: {
        whitePlayerId: players[0].id,

        blackPlayerId: players[1].id,

        status: "ACTIVE",

        gameType: "CHESS",

        position:
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",

        currentTurn: "WHITE",

        moveCount: 0,

        startedAt: new Date(),

        timeControl: "10+0",
      },
    })
  }

  console.log("♟️ Chess Demo Ready")
  console.log("🎉 Database Seeded Successfully")
}

main()
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })