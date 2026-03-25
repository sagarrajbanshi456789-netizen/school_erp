import LevelTemplate from "../LevelTemplate"
import { prisma } from "@/lib/prisma"
import { Book } from "lucide-react"

type ClassType = {
  id: string
  name: string
  slug: string
}

interface PageProps {
  params: {
    level: string
  }
}
export default async function LevelPage({ params }: PageProps) {
  const resolvedParams = await params;   // ✅ unwrap the promise
  const levelSlug = resolvedParams.level;

  const level = await prisma.level.findUnique({
    where: { slug: levelSlug },
    include: { classes: true },
  });

  if (!level) {
    return (
      <LevelTemplate
        title="Level Not Found"
        description="No level data found"
        cards={[]}
        showBackButton
      />
    );
  }

  const cards = level.classes?.map((cls, idx) => ({
    id: cls.id,
    title: cls.name,
    description: `Explore subjects for ${cls.name}`,
    href: `/${level.slug}/${cls.slug}`,
    icon: <Book className="w-5 h-5 text-purple-500" />,
    delay: idx * 0.1,
  })) ?? [];

  return (
    <LevelTemplate
      title={level.name}
      description={`Classes available in ${level.name}`}
      cards={cards}
      showBackButton
    />
  );
}