"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

type PasswordInputProps = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  showForgot?: boolean
  onForgotClick?: () => void
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Enter password",
  showForgot = false,
  onForgotClick,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pr-10"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showForgot && (
        <div className="text-right">
          <button
            type="button"
            onClick={onForgotClick}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Forgot password?
          </button>
        </div>
      )}
    </div>
  )
}