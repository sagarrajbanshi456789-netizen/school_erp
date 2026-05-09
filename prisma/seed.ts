
import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"
import { auth } from "../src/lib/auth"
import sharp from "sharp"

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate())

/* --------------------- */
/* Utils */
/* --------------------- */

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "")

/* --------------------- */
/* Generate Images (FIXED: return Buffer directly) */
/* --------------------- */

async function generatePageImages(
  subject: string,
  className: string,
  page: number
) {
  const imageBuffer = await sharp({
    create: {
      width: 1200,
      height: 1600,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .png()
    .toBuffer()

  const hdBuffer = await sharp({
    create: {
      width: 2400,
      height: 3200,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .png()
    .toBuffer()

  const thumbBuffer = await sharp({
    create: {
      width: 400,
      height: 600,
      channels: 3,
      background: { r: 240, g: 240, b: 240 },
    },
  })
    .png()
    .toBuffer()

return {
  imageData: Uint8Array.from(imageBuffer),
  mimeType: "image/png",

  hdImageData: Uint8Array.from(hdBuffer),
  hdMimeType: "image/png",

  thumbnailData: Uint8Array.from(thumbBuffer),
  thumbnailMimeType: "image/png",
}
}

/* --------------------- */
/* Content */
/* --------------------- */

function generatePageContent(subject: string, className: string, page: number) {
  return `${subject} - Chapter ${page} (${className})
Topics:
- Core concepts
- Examples
- Practice questions
- Key points`
}

/* --------------------- */
/* MAIN */
/* --------------------- */

async function main() {
  console.log("🌱 Starting Seed...")

  /* ---------------- ADMIN ---------------- */

  const adminEmail = process.env.ADMIN_EMAIL || "admin@school.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  let admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!admin) {
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Super Admin",
      },
    })

    admin = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: "ADMIN",
        emailVerified: true,
      },
    })

    console.log("✅ Admin Created")
  }

  /* ---------------- LEVELS ---------------- */

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

  for (const name of levels) {
    await prisma.level.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) },
    })
  }

  console.log("✅ Levels Seeded")

  /* ---------------- CLASSES ---------------- */

  const levelMap: Record<string, string[]> = {
    primary: ["Class 3", "Class 4", "Class 5"],
    "lower-secondary": ["Class 6", "Class 7", "Class 8"],
    secondary: ["Class 9", "Class 10"],
    "higher-secondary": ["Class 11", "Class 12"],
    bachelors: ["B1", "B2", "B3", "B4"],
    masters: ["M1", "M2"],
    gaming: ["Chess", "Ludo"],
    loksewa: ["L1", "L2", "L3"],
  }

  const levelsDB = await prisma.level.findMany()

  for (const [levelSlug, classes] of Object.entries(levelMap)) {
    const level = levelsDB.find((l) => l.slug === levelSlug)
    if (!level) {
      console.warn("⚠️ Missing level:", levelSlug)
      continue
    }

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

  /* ---------------- SUBJECTS ---------------- */

  const allClasses = await prisma.class.findMany({
    include: { level: true },
  })

  for (const cls of allClasses) {
    if (cls.isGame) continue

    const subjects = ["Math", "Science", "English"]

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

  /* ---------------- ONLY MATH BOOK 1 ---------------- */

  const mathClass = await prisma.class.findFirst({
    where: { name: "Class 3" },
  })

  const mathSubject = await prisma.subject.findFirst({
    where: {
      name: "Math",
      classId: mathClass?.id,
    },
  })

  if (!mathClass || !mathSubject) {
    throw new Error("Math setup missing")
  }

  const publication = await prisma.publication.upsert({
    where: { slug: "math-book-1" },
    update: {},
    create: {
      title: "Math Book 1",
      slug: "math-book-1",
      description: "Math Book",
      href: "/math-book-1",
      author: "School ERP",
      totalPages: 8,
      subjectId: mathSubject.id,
    },
  })

  console.log("📚 Math Book Ready")

  /* ---------------- PAGES ---------------- */

  /* ---------------- PAGES ---------------- */

for (let i = 1; i <= 8; i++) {
  const img = await generatePageImages("Math", "Class 3", i)

  await prisma.publicationPage.upsert({
    where: {
      publicationId_pageNumber: {
        publicationId: publication.id,
        pageNumber: i,
      },
    },

    update: {
      imageData: img.imageData,
      mimeType: img.mimeType,
    },

    create: {
      publicationId: publication.id,
      pageNumber: i,
      imageData: img.imageData,
      mimeType: img.mimeType,
    },
  })
}

  console.log("📄 Pages Seeded")

  console.log("🎉 SEED COMPLETE")
}

main()
  .catch((e) => {
    console.error("❌ SEED ERROR:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })