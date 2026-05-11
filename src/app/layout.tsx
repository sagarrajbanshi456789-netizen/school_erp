// src/app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"

import AuthProvider from "@/components/providers/AuthProvider"
import ThemeProvider from "@/components/providers/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { Suspense } from "react"
import Providers from "@/components/providers/providers"
export const metadata: Metadata = {
  title: "School ERP",
  description: "School Enterprise Resource Planning System",
    manifest: "/manifest.json",
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading School ERP...</p>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={<LoadingScreen />}>
              <div className="min-h-screen flex flex-col">
                {/* Main Content */}
                <main className="flex-1">{children}</main>
              </div>
            </Suspense>
          </AuthProvider>

          <Toaster />
        </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
