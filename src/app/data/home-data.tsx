// app/data/home-data.tsx
import {
  Book,
  Users,
  UserCheck,
  Award,
  Code,
  Activity,
  TrendingUp,
  ShieldCheck,
  Network,
} from "lucide-react"

export type CardType = {
  id: string
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

export const cards: CardType[] = [
  {
    id: "primary",
    title: "Primary Level",
    description: "Class 3, Class 4, Class 5",
    href: "/primary",
    icon: <Book className="w-5 h-5 text-purple-500" aria-hidden="true" />,
  },
  {
    id: "lower-secondary",
    title: "Lower Secondary Level",
    description: "Class 6, Class 7, Class 8",
    href: "/lower-secondary",
    icon: <Book className="w-5 h-5 text-pink-500" aria-hidden="true" />,
  },
  {
    id: "secondary",
    title: "Secondary Level",
    description: "Class 9, Class 10",
    href: "/secondary",
    icon: <Book className="w-5 h-5 text-red-500" aria-hidden="true" />,
  },
  {
    id: "higher-secondary",
    title: "Higher Sec Level (+2 Level)",
    description:
      "Streams: Science, Management, Humanities, Education, Arts",
    href: "/higher-secondary",
    icon: <Award className="w-5 h-5 text-yellow-500" aria-hidden="true" />,
  },
  {
    id: "bachelors",
    title: "Bachelor’s Level",
    description: "Undergraduate Education",
    href: "/bachelors",
    icon: <Users className="w-5 h-5 text-green-500" aria-hidden="true" />,
  },
  {
    id: "masters",
    title: "Master’s Level",
    description: "Postgraduate Education",
    href: "/masters",
    icon: <UserCheck className="w-5 h-5 text-blue-500" aria-hidden="true" />,
  },
  {
    id: "programming",
    title: "Programming",
    description: "Coding & Development",
    href: "/programming",
    icon: <Code className="w-5 h-5 text-indigo-500" aria-hidden="true" />,
  },
  {
    id: "loksewa-aayog",
    title: "Loksewa Aayog",
    description: "Preparation resources",
    href: "/loksewa-aayog",
    icon: <Activity className="w-5 h-5 text-teal-500" aria-hidden="true" />,
  },
  {
    id: "gambling",
    title: "Gambling",
    description: "Chess, Ludo, BaghChal",
    href: "/gambling",
    icon: <TrendingUp className="w-5 h-5 text-orange-500" aria-hidden="true" />,
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    description: "Ethical hacking & defense",
    href: "/cyber-security",
    icon: <ShieldCheck className="w-5 h-5 text-red-600" aria-hidden="true" />,
  },
  {
    id: "networking",
    title: "Networking",
    description: "Networking fundamentals & labs",
    href: "/networking",
    icon: <Network className="w-5 h-5 text-blue-600" aria-hidden="true" />,
  },
]