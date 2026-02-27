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

export const cards = [
  { title: "Primary Level", description: "Class 3, Class 4, Class 5", href: "/primary", delay: 0, icon: <Book className="w-5 h-5 text-purple-500" /> },
  { title: "Lower Secondary Level", description: "Class 6, Class 7, Class 8", href: "/lower-secondary", delay: 0.1, icon: <Book className="w-5 h-5 text-pink-500" /> },
  { title: "Secondary Level", description: "Class 9, Class 10", href: "/secondary", delay: 0.2, icon: <Book className="w-5 h-5 text-red-500" /> },
  { title: "Higher Sec Level (+2 Level)", description: "Streams: Science, Management, Humanities, Education, Arts", href: "/higher-secondary", delay: 0.3, icon: <Award className="w-5 h-5 text-yellow-500" /> },
  { title: "Bachelor’s Level", description: "Undergraduate Education", href: "/bachelors", delay: 0.4, icon: <Users className="w-5 h-5 text-green-500" /> },
  { title: "Master’s Level", description: "Postgraduate Education", href: "/masters", delay: 0.5, icon: <UserCheck className="w-5 h-5 text-blue-500" /> },
  { title: "Programming", description: "Coding & Development", href: "/programming", delay: 0.6, icon: <Code className="w-5 h-5 text-indigo-500" /> },
  { title: "Loksewa Aayog", description: "Preparation resources", href: "/loksewa-aayog", delay: 0.7, icon: <Activity className="w-5 h-5 text-teal-500" /> },
  { title: "Gambling", description: "Chess, Ludo, BaghChal", href: "/gambling", delay: 0.8, icon: <TrendingUp className="w-5 h-5 text-orange-500" /> },
  { title: "Cyber Security", description: "Ethical hacking & defense", href: "/cyber-security", delay: 0.9, icon: <ShieldCheck className="w-5 h-5 text-red-600" /> },
  { title: "Networking", description: "Networking fundamentals & labs", href: "/networking", delay: 1.0, icon: <Network className="w-5 h-5 text-blue-600" /> },
]
