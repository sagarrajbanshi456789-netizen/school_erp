// src/app/%28public%29/PublicLayoutClient.tsx
"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/public-layout-compo/Navbar"
import Footer from "@/components/public-layout-compo/Footer"
import { Toaster } from "@/components/ui/sonner"
import PublicChatWidget from "@/components/chat/ChatWidget"
export default function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Hide navbar/footer for 4-segment dynamic route
  const hideLayout = /^\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/.test(pathname)

  return (
    <>
      {!hideLayout && <Navbar />}

      <main>{children}</main>

      {!hideLayout && <Footer />}
  {/* 💬 CUSTOMER CHAT ONLY */}
      {!hideLayout && <PublicChatWidget mode="PUBLIC" />}
      <Toaster richColors position="top-right" />
    </>
  )
}