// prisma/seed.ts

import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"
import { auth } from "../src/lib/auth"

const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL, }).$extends(withAccelerate())
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

function generatePageContent(
  subject: string,
  className: string,
  page: number
) {
  return `
  <div style="font-family: system-ui; line-height:1.6">

    <h1>${subject}</h1>

    <h2>Chapter ${page}</h2>

    <p>
      This is demo content for <strong>${subject}</strong>
      for <strong>${className}</strong>.
    </p>

    <p>
      This page exists to test book flip animation,
      page layout and rendering.
    </p>

    <h3>Learning Objectives</h3>

    <ul>
      <li>Understand core concept</li>
      <li>Practice exercises</li>
      <li>Visual learning</li>
      <li>Examples & explanation</li>
    </ul>

    <h3>Example</h3>

    <p>
      Example ${page}: This demonstrates structured
      educational content formatting.
    </p>

    <div style="
      background:#f5f5f5;
      padding:12px;
      border-radius:8px;
      margin-top:12px;
    ">
      Tip: Books should flip smoothly with content like this.
    </div>

  </div>
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
      role: "ADMIN",
    },
  })

  // make admin role
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
    "Programming",
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
    programming: [
      "Intro to Programming",
      "Advanced Programming",
      "Web Development",
      "Mobile Development",
    ],
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
        },
      })
    }
  }

  console.log("✅ Classes Seeded")

  /* --------------------- */
  /* Seed Subjects */
  /* --------------------- */

  const allClasses = await prisma.class.findMany()

  for (const cls of allClasses) {
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
  /* Seed Publications + Books */
  /* --------------------- */

  const allSubjects = await prisma.subject.findMany({
    include: { class: true },
  })

  for (const subject of allSubjects) {
    const level = await prisma.level.findUnique({
      where: { id: subject.class.levelId },
    })

    if (!level) continue

    /* Create 2 books per subject */
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
          description: `${subject.name} Book for ${subject.class.name}`,
          href: `/${slugify(level.name)}/${subject.class.slug}/${subject.slug}/${slug}`,
          subjectId: subject.id,
        },
      })

      /* Create 20 pages */
      for (let i = 1; i <= 20; i++) {
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
            content: generatePageContent(subject.name, subject.class.name, i),
            publicationId: publication.id,
          },
        })
      }
    }
  }

  console.log("✅ Demo Books Created")
  console.log("📚 Flipbook Pages Created")
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