// src/app/data/types.ts

import React from "react"

export type CardType = {
  id: string
  title: string
  description: string
  href: string
  icon: React.ReactNode
  delay?: number
}

export type ClassType = {
  id: string
  name: string
  slug: string
}

export type SubjectType = {
  id: string
  name: string
  slug: string
}