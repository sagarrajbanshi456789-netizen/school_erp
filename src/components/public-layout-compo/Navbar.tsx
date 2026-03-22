"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, CreditCard, Settings, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { authClient } from "@/lib/auth-client"
import { useAuthModal } from "@/store/useAuthModal"

export function Navbar() {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const { data: session, isPending } = authClient.useSession()
  const { openModal } = useAuthModal()

  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)

  const closeMenu = () => setOpen(false)

  /* ---------------- Outside Click (Mobile + Account) ---------------- */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }

      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ---------------- Logout ---------------- */
  const handleLogout = async () => {
    await authClient.signOut()

    setAccountOpen(false)
    closeMenu()

    router.refresh() // ✅ important
  }

  return (
    <nav className="w-full border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:opacity-80 transition"
        >
          MyApp
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">

          {/* Loading */}
          {isPending && <SessionSkeleton />}

          {/* Not Logged In */}
          {!isPending && !session && (
            <>
              <Button variant="outline" onClick={() => openModal("login")}>
                Login
              </Button>
              <Button onClick={() => openModal("signup")}>
                Signup
              </Button>
            </>
          )}

          {/* Logged In */}
          {!isPending && session && (
            <div ref={accountRef} className="relative">
              <Button
                variant="outline"
                className="flex items-center gap-2 px-4"
                onClick={() => setAccountOpen((prev) => !prev)}
              >
                <User size={18} />
                <span className="whitespace-nowrap max-w-[150px] truncate">
                  {session.user?.name || session.user?.email}
                </span>

                <motion.div
                  animate={{ rotate: accountOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="opacity-70" />
                </motion.div>
              </Button>

              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-52 bg-popover border rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <DropdownItem href="/profile" onClick={() => setAccountOpen(false)}>
                      <User size={16} /> Profile
                    </DropdownItem>

                    <DropdownItem href="/transactions" onClick={() => setAccountOpen(false)}>
                      <CreditCard size={16} /> Transactions
                    </DropdownItem>

                    <DropdownItem href="/settings" onClick={() => setAccountOpen(false)}>
                      <Settings size={16} /> Settings
                    </DropdownItem>

                    <div className="border-t" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <Button
            ref={toggleRef}
            variant="outline"
            size="icon"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute top-16 left-0 w-full bg-background border-b shadow-md md:hidden z-40"
          >
            <div className="flex flex-col gap-3 p-4">

              {isPending && <MobileSkeleton />}

              {!isPending && !session && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => { openModal("login"); closeMenu(); }}
                  >
                    Login
                  </Button>

                  <Button
                    onClick={() => { openModal("signup"); closeMenu(); }}
                  >
                    Signup
                  </Button>
                </>
              )}

              {!isPending && session && (
                <>
                  <MobileItem href="/profile" onClick={closeMenu}>
                    Profile
                  </MobileItem>

                  <MobileItem href="/transactions" onClick={closeMenu}>
                    Transactions
                  </MobileItem>

                  <MobileItem href="/settings" onClick={closeMenu}>
                    Settings
                  </MobileItem>

                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

/* ---------------- Components ---------------- */

function SessionSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="h-9 w-28 rounded-md bg-muted" />
      <div className="h-9 w-20 rounded-md bg-muted" />
    </div>
  )
}

function MobileSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="h-10 w-full rounded-md bg-muted" />
      <div className="h-10 w-full rounded-md bg-muted" />
    </div>
  )
}

function DropdownItem({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link href={href} onClick={onClick}>
      <div className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition cursor-pointer">
        {children}
      </div>
    </Link>
  )
}

function MobileItem({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link href={href} onClick={onClick}>
      <Button variant="secondary" className="w-full">
        {children}
      </Button>
    </Link>
  )
}