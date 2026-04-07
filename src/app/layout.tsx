import type { Metadata } from "next"
import AuthProvider from "@/components/providers/AuthProvider"
import "./globals.css"
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
      <body className="min-h-screen bg-background antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}