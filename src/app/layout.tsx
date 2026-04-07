// src/app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import Providers from "@/components/providers/ThemeProvider"

export const metadata: Metadata = {
  title: "School ERP",
  description: "School Enterprise Resource Planning System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}