
// prisma/seed.ts
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
/* Generate Demo Page Content */
/* --------------------- */
function generatePageContent(subject: string, className: string, page: number) {
  const imageSeed = (page % 8) + 1

  const html = `
  <div style="font-family: system-ui; line-height:1.7; padding:12px">

    <h1 style="color:#4f46e5">${subject}</h1>
    <h2>📘 Chapter ${page} - ${className}</h2>

    <p>
      This is a <strong>${subject}</strong> lesson designed for <strong>${className}</strong>.
      It includes structured learning, visuals, and practice.
    </p>

    <img 
      src="https://source.unsplash.com/900x450/?${subject},education,learning"
      style="width:100%; border-radius:12px; margin:15px 0;"
    />

    <h3>🎯 Learning Objectives</h3>
    <ul>
      <li>Understand core ${subject} concepts</li>
      <li>Develop problem-solving skills</li>
      <li>Learn through visuals</li>
      <li>Prepare for exams</li>
    </ul>

    <h3>📚 Core Concept</h3>
    <p>
      ${subject} is an important topic in ${className}.
      This chapter explains it in a simple and structured way.
    </p>

    <img 
      src="https://source.unsplash.com/900x450/?school,study,${imageSeed}"
      style="width:100%; border-radius:12px; margin:15px 0;"
    />

    <h3>🧪 Example</h3>
    <div style="background:#f3f4f6; padding:12px; border-radius:10px;">
      <strong>Example ${page}:</strong>
      <p>Practical application of ${subject} with real-world understanding.</p>
    </div>

    <h3>📌 Key Points</h3>
    <ol>
      <li>Core concept of ${subject}</li>
      <li>Step-by-step understanding</li>
      <li>Practice improves mastery</li>
    </ol>

    <img 
      src="https://source.unsplash.com/900x450/?diagram,education,${page}"
      style="width:100%; border-radius:12px; margin:15px 0;"
    />

    <div style="
      margin-top:15px;
      padding:15px;
      border-left:5px solid #22c55e;
      background:#ecfdf5;
      border-radius:8px;
    ">
      💡 Tip: Practice ${subject} daily for better results.
    </div>

  </div>
  `

  const text = `
${subject} - Chapter ${page} (${className})

Topics:
- Core concepts
- Examples
- Practice questions
- Key points
`

  return { html, text }
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
      data: { role: "ADMIN", emailVerified: true },
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
    loksewa: ["Loksewa Level 1", "Loksewa Level 2", "Loksewa Level 3"],
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
    include: { level: true },
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
          id: `pub-${subject.id}-${slug}`,
          title,
          slug,
          description: `${subject.name} Book`,
          href: `/${slugify(level.name)}/${subject.class.slug}/${subject.slug}/${slug}`,
          subjectId: subject.id,
        },
      })

for (let i = 1; i <= 20; i++) {
  const pageContent = generatePageContent(
    subject.name,
    subject.class.name,
    i
  )

  await prisma.publicationPage.upsert({
    where: {
      publicationId_pageNumber: {
        publicationId: publication.id,
        pageNumber: i,
      },
    },
    update: {},
    create: {
      pageNumber: i,
      title: `Page ${i}`,

      contentJson: {
        html: pageContent.html,
      },

      contentText: pageContent.text,

      publicationId: publication.id,
    }
  })
}
    }
  }

  console.log("📚 Books Created")

  /* --------------------- */
  /* Chess Demo Users */
  /* --------------------- */

  console.log("♟️ Creating Chess Users...")

  const chessUsers = [
    { email: "player1@chess.com", name: "Player One" },
    { email: "player2@chess.com", name: "Player Two" },
    { email: "player3@chess.com", name: "Player Three" },
  ]

  for (const user of chessUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
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