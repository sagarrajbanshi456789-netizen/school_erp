"use client"

import PasswordInput from "@/components/password/password-input"

type ConfirmPasswordInputProps = {
  password: string
  confirmPassword: string
  setConfirmPassword: (val: string) => void
}

export default function ConfirmPasswordInput({
  password,
  confirmPassword,
  setConfirmPassword,
}: ConfirmPasswordInputProps) {

  const isMatch = password === confirmPassword
  const showError = confirmPassword.length > 0 && !isMatch

  return (
    <div className="space-y-1">
      <PasswordInput
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm password"
      />

      {showError && (
        <p className="text-xs text-red-500">
          Passwords do not match
        </p>
      )}

      {isMatch && confirmPassword && (
        <p className="text-xs text-green-600">
          Passwords match ✓
        </p>
      )}
    </div>
  )
}