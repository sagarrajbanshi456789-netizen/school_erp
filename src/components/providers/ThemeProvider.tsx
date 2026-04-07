// src/components/ThemeProvider.tsx
'use client'

import { useEffect, useState, ReactNode } from 'react'

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [])

  return <>{children}</>
}