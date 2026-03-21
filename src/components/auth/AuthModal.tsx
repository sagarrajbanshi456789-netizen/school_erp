"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

import { useAuthModal } from "@/store/useAuthModal"
import LoginForm from "../form-compo/LoginForm"
import SignupForm from "../form-compo/SignupForm"
import ForgotPasswordForm from "../form-compo/ForgotPasswordForm"
import ResetPasswordForm from "../form-compo/ResetPasswordForm"

export default function AuthModal() {
  const { open, view, close } = useAuthModal()
  const modalRef = useRef<HTMLDivElement>(null)

  /* -------------------------------- */
  /* Body scroll lock (no layout shift) */
  /* -------------------------------- */
  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow
    const originalPadding = document.body.style.paddingRight

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = "hidden"
    document.body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPadding
    }
  }, [open])

  /* -------------------------------- */
  /* ESC key close support */
  /* -------------------------------- */
  useEffect(() => {
    if (!open) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close()
      }
    }

    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [open, close])

  return (
    <AnimatePresence mode="wait" initial={false}>
      {open && (
        <motion.div
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close} // backdrop click closes modal
        >
          <motion.div
            ref={modalRef}
            className="
              relative
              w-full
              md:w-[420px]
              max-h-[90vh]
              bg-background
              text-foreground
              rounded-t-3xl md:rounded-2xl
              p-6
              shadow-2xl
              overflow-y-auto
            "
            initial={{ y: 80, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 80, scale: 0.98, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={close}
              className="
                absolute top-4 right-4
                text-muted-foreground
                hover:text-foreground
                transition
              "
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Smooth View Switch */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {view === "login" && <LoginForm />}
                {view === "signup" && <SignupForm />}
                {view === "forgot-password" && <ForgotPasswordForm />}
                {view === "reset-password" && <ResetPasswordForm />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}