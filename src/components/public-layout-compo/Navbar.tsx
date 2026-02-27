"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="w-full border-b bg-white relative z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          MyApp
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>

          <Link href="/signup">
            <Button>Signup</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown From Top */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 w-full bg-white border-b shadow-md md:hidden"
          >
            <div className="flex flex-col gap-4 p-4">

              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>

              <Link href="/signup" onClick={() => setOpen(false)}>
                <Button className="w-full">
                  Signup
                </Button>
              </Link>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}