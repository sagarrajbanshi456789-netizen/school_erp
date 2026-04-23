"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/public-layout-compo/Navbar"
import Footer from "@/components/public-layout-compo/Footer"
import { Toaster } from "@/components/ui/sonner"

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

      <Toaster richColors position="top-right" />
    </>
  )
}