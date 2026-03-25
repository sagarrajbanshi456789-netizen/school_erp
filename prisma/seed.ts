import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate())

// slug generator
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")

async function main() {
  console.log("🌱 Seeding database...")

  // ---------------------
  // Levels
  // ---------------------

  const levels = [
    "Primary",
    "Lower Secondary",
    "Secondary",
    "Higher Secondary",
    "Bachelors",
    "Masters",
    "Programming",
    "Loksewa",
    "Cyber Security",
    "Networking",
  ]

  for (const level of levels) {
    await prisma.level.upsert({
      where: { slug: slugify(level) },
      update: {},
      create: {
        name: level,
        slug: slugify(level),
      },
    })
  }

  console.log("✅ Levels Seeded")

  // ---------------------
  // Classes
  // ---------------------

  const primary = await prisma.level.findFirst({
    where: { slug: "primary" },
  })

  const lowerSecondary = await prisma.level.findFirst({
    where: { slug: "lower-secondary" },
  })

  const secondary = await prisma.level.findFirst({
    where: { slug: "secondary" },
  })

  if (primary) {
    const classes = ["Class 3", "Class 4", "Class 5"]

    for (const cls of classes) {
      await prisma.class.upsert({
        where: {
          slug_levelId: {
            slug: slugify(cls),
            levelId: primary.id,
          },
        },
        update: {},
        create: {
          name: cls,
          slug: slugify(cls),
          levelId: primary.id,
        },
      })
    }
  }

  if (lowerSecondary) {
    const classes = ["Class 6", "Class 7", "Class 8"]

    for (const cls of classes) {
      await prisma.class.upsert({
        where: {
          slug_levelId: {
            slug: slugify(cls),
            levelId: lowerSecondary.id,
          },
        },
        update: {},
        create: {
          name: cls,
          slug: slugify(cls),
          levelId: lowerSecondary.id,
        },
      })
    }
  }

  if (secondary) {
    const classes = ["Class 9", "Class 10"]

    for (const cls of classes) {
      await prisma.class.upsert({
        where: {
          slug_levelId: {
            slug: slugify(cls),
            levelId: secondary.id,
          },
        },
        update: {},
        create: {
          name: cls,
          slug: slugify(cls),
          levelId: secondary.id,
        },
      })
    }
  }

  console.log("✅ Classes Seeded")

  // ---------------------
  // Subjects
  // ---------------------

  const classes = await prisma.class.findMany()

  const subjects = [
    "Math",
    "Science",
    "English",
    "Nepali",
    "Social",
  ]

  for (const cls of classes) {
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
  console.log("🎉 Database Seeded Successfully")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("❌ Seed Error:", e)
    await prisma.$disconnect()
    process.exit(1)
  })