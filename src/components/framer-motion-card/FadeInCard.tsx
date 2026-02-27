"use client"

import { motion } from "framer-motion"

type FadeInCardProps = {
  children: React.ReactNode
  delay?: number
}

export default function FadeInCard({ children, delay = 0 }: FadeInCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className="relative rounded-2xl p-[2px] bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 shadow-md hover:shadow-2xl transition-all"
    >
      <div className="rounded-2xl bg-card text-card-foreground h-full w-full p-5">
        {children}
      </div>
    </motion.div>
  )
}
