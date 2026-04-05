// src/app/(public)/layout.tsx
import { Navbar } from "@/components/public-layout-compo/Navbar"
import Footer from "@/components/public-layout-compo/Footer"
import { Toaster } from "@/components/ui/sonner"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Toaster richColors position="top-right" />
    </>
  )
}