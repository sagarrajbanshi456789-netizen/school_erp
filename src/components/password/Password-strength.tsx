"use client"

type Props = {
  password: string
}

export default function PasswordStrength({ password }: Props) {

  const calculateStrength = () => {
    let score = 0

    if (password.length >= 6) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    return score
  }

  const strength = calculateStrength()

  const getLabel = () => {
    if (strength <= 1) return "Weak"
    if (strength === 2) return "Medium"
    if (strength === 3) return "Strong"
    return "Very Strong"
  }

  const getColor = () => {
    if (strength <= 1) return "bg-red-500"
    if (strength === 2) return "bg-yellow-500"
    if (strength === 3) return "bg-blue-500"
    return "bg-green-500"
  }

  if (!password) return null

  return (
    <div className="space-y-1">
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className={`h-2 rounded-full transition-all ${getColor()}`}
          style={{ width: `${strength * 25}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Strength: {getLabel()}
      </p>
    </div>
  )
}