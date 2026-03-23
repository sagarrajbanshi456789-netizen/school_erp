"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  User,
  CreditCard,
  Settings,
  ChevronDown,
  Home,
  LogOut
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { authClient } from "@/lib/auth-client"
import { useAuthModal } from "@/store/useAuthModal"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const { data: session, isPending } = authClient.useSession()
  const { openModal } = useAuthModal()

  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)

  const closeMenu = () => setOpen(false)

  // 🔥 ACTIVE LOGIC
  const isActive = (path: string) => pathname === path

  const navClass = (path: string) =>
    isActive(path)
      ? "bg-primary text-white"
      : "hover:bg-muted"

  /* ---------------- Outside Click ---------------- */
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
    router.push("/")
    router.refresh()
  }

  const user = session?.user

  return (
    <nav className="w-full border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          MyApp
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">

          {isPending && <SessionSkeleton />}

          {/* NOT LOGGED IN */}
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

          {/* LOGGED IN */}
          {!isPending && session && (
            <>
              {/* HOME */}
              <Link href="/">
                <Button className={`flex items-center gap-2 ${navClass("/")}`}>
                  <Home size={16} />
                  Home
                </Button>
              </Link>

              {/* ACCOUNT */}
              <div ref={accountRef} className="relative">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setAccountOpen((prev) => !prev)}
                >
                  <User size={16} />
                  {user?.name || user?.email}

                  <motion.div animate={{ rotate: accountOpen ? 180 : 0 }}>
                    <ChevronDown size={16} />
                  </motion.div>
                </Button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-56 bg-popover border rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                      <DropdownItem href="/profile" active={isActive("/profile")}>
                        <User size={16} /> Profile
                      </DropdownItem>

                      <DropdownItem href="/transactions" active={isActive("/transactions")}>
                        <CreditCard size={16} /> Transactions
                      </DropdownItem>

                      <DropdownItem href="/settings" active={isActive("/settings")}>
                        <Settings size={16} /> Settings
                      </DropdownItem>

                      <div className="border-t" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
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
            className="absolute top-16 left-0 w-full bg-background border-b shadow-md md:hidden z-40"
          >
            <div className="flex flex-col gap-3 p-4">

              {isPending && <MobileSkeleton />}

              {!isPending && !session && (
                <>
                  <Button onClick={() => { openModal("login"); closeMenu(); }}>
                    Login
                  </Button>
                  <Button onClick={() => { openModal("signup"); closeMenu(); }}>
                    Signup
                  </Button>
                </>
              )}

              {!isPending && session && (
                <>
                  <MobileItem href="/" active={isActive("/")} onClick={closeMenu}>
                    <Home size={16} /> Home
                  </MobileItem>

                  <MobileItem href="/profile" active={isActive("/profile")} onClick={closeMenu}>
                    <User size={16} /> Profile
                  </MobileItem>

                  <MobileItem href="/transactions" active={isActive("/transactions")} onClick={closeMenu}>
                    <CreditCard size={16} /> Transactions
                  </MobileItem>

                  <MobileItem href="/settings" active={isActive("/settings")} onClick={closeMenu}>
                    <Settings size={16} /> Settings
                  </MobileItem>

                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
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

function DropdownItem({
  href,
  children,
  active
}: {
  href: string
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer ${
          active ? "bg-primary text-white" : "hover:bg-muted"
        }`}
      >
        {children}
      </div>
    </Link>
  )
}

function MobileItem({
  href,
  children,
  active,
  onClick,
}: {
  href: string
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Link href={href} onClick={onClick}>
      <Button
        variant={active ? "default" : "secondary"}
        className="w-full flex items-center gap-2"
      >
        {children}
      </Button>
    </Link>
  )
}

function SessionSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="h-9 w-28 bg-muted rounded" />
      <div className="h-9 w-20 bg-muted rounded" />
    </div>
  )
}

function MobileSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="h-10 w-full bg-muted rounded" />
      <div className="h-10 w-full bg-muted rounded" />
    </div>
  )
}