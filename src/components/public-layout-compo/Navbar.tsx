
// src/components/public-layout-compo/Navbar.tsx
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
  LogOut,
  LogIn,
  UserPlus,
  Download,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { authClient } from "@/lib/auth-client"
import { useAuthModal } from "@/store/useAuthModal"
import ThemeToggle from "@/components/ThemeToggle"

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
  const isActive = (path: string) => pathname === path
  const navClass = (path: string) =>
    isActive(path) ? "bg-primary text-white" : "hover:bg-muted"

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) setOpen(false)

      if (accountRef.current && !accountRef.current.contains(event.target as Node))
        setAccountOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await authClient.signOut()
    setAccountOpen(false)
    closeMenu()
    router.push("/")
    router.refresh()
  }

  const user = session?.user
const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
const [installable, setInstallable] = useState(false)

useEffect(() => {
  const handler = (e: any) => {
    e.preventDefault()
    setDeferredPrompt(e)
    setInstallable(true)
  }

  window.addEventListener("beforeinstallprompt", handler)

  return () =>
    window.removeEventListener(
      "beforeinstallprompt",
      handler
    )
}, [])

const handleInstall = async () => {
  if (!deferredPrompt) {
    alert("Install option not available yet.")
    return
  }

  deferredPrompt.prompt()

  const { outcome } =
    await deferredPrompt.userChoice

  if (outcome === "accepted") {
    setDeferredPrompt(null)
    setInstallable(false)
  }
}
  return (
    <nav className="w-full border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">MyApp</Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {isPending && <SessionSkeleton />}

          {!isPending && !session && (
            <>
              <Button className="flex items-center gap-2" variant="outline" onClick={() => openModal("login")}><LogIn size={16} />Login</Button>
              <Button className="flex items-center gap-2" variant="outline" onClick={() => openModal("signup")}><UserPlus size={16} />Signup</Button>
            </>
          )}

          {!isPending && session && (
            <>
              {/* Home */}
              <Link href="/">
                <Button className={`flex items-center gap-2 ${navClass("/")}`}>
                  <Home size={16} /> Home
                </Button>
              </Link>
{installable && (
  <Button
    className="
      flex items-center gap-2

      bg-gradient-to-r
      from-[#ffe4c4]
      via-[#f5d2a0]
      to-[#e6b980]

      text-black
      border-0

      hover:scale-105
      transition-all
      duration-300

      dark:from-[#3b2d20]
      dark:via-[#2a2119]
      dark:to-[#1a1410]
      dark:text-white
    "
    onClick={handleInstall}
  >
    <Download size={16} />
    Install App
  </Button>
)}
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Account Dropdown */}
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
                      className="absolute right-0 mt-2 w-56 bg-background border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden transition-colors duration-300"
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
                      <div className="border-t border-gray-200 dark:border-gray-700" />
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-2  text-red-500 hover:text-red-600"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
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
            className="
              absolute top-16 left-0 w-full md:hidden z-40
              bg-white dark:bg-black
              border-b border-gray-200 dark:border-gray-800
              shadow-sm
              transition-colors duration-300
            "
          >
            <div className="flex flex-col gap-3 p-4">
              {isPending && <MobileSkeleton />}

              {!isPending && !session && (
                <>
                  <Button className="flex items-center gap-2" variant="outline" onClick={() => { openModal("login"); closeMenu(); }}>
                    <LogIn size={16} /> Login
                  </Button>
                  <Button className="flex items-center gap-2" variant="outline" onClick={() => { openModal("signup"); closeMenu(); }}>
                    <UserPlus size={16} /> Signup
                  </Button>
                </>
              )}

              {!isPending && session && (
                <>
                  <MobileItem href="/" active={isActive("/")} onClick={closeMenu}>
                    <Home size={16} /> Home
                  </MobileItem>
         {installable && (
  <Button
    className="
      w-full
      flex items-center gap-2

      bg-gradient-to-r
      from-[#ffe4c4]
      via-[#f5d2a0]
      to-[#e6b980]

      text-black
      border-0

      dark:from-[#3b2d20]
      dark:via-[#2a2119]
      dark:to-[#1a1410]
      dark:text-white
    "
    onClick={() => {
      handleInstall()
      closeMenu()
    }}
  >
    <Download size={16} />
    Install App
  </Button>
)}
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
                    variant="outline"
                    className="w-full flex items-center gap-2  text-red-500 hover:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </>
              )}
            </div>
            <hr />
            <hr />
            <hr />
            <hr />
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
        className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer rounded-md transition-colors duration-300 ${active
          ? "bg-primary text-white"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
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
      <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

function MobileSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}