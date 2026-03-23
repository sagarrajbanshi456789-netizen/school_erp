"use client"

import { useState, useLayoutEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
        checked ? "bg-blue-500" : "bg-gray-300"
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

export default function SettingsForm() {
  const { data: session } = authClient.useSession()

  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [mobile, setMobile] = useState<string | null>(null)
  const [theme, setTheme] = useState(false)

  const [originalName, setOriginalName] = useState<string | null>(null)
  const [originalEmail, setOriginalEmail] = useState<string | null>(null)
  const [originalMobile, setOriginalMobile] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const [editName, setEditName] = useState(false)
  const [editEmail, setEditEmail] = useState(false)
  const [editMobile, setEditMobile] = useState(false)
  const [editPassword, setEditPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  // Prevent theme flash
  useLayoutEffect(() => {
    if (session?.user) {
      setName(session.user.name || null)
      setOriginalName(session.user.name || null)
      setEmail(session.user.email || null)
      setOriginalEmail(session.user.email || null)
      setMobile((session.user as any)?.mobile || null)
      setOriginalMobile((session.user as any)?.mobile || null)
    }

    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      const isDark = savedTheme === "true"
      setTheme(isDark)
      document.documentElement.classList.toggle("dark", isDark)
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark)
      document.documentElement.classList.toggle("dark", prefersDark)
    }
  }, [session])

  const updateField = async (field: string, value: any) => {
    setLoading(true)
    try {
      const body = field === "password" ? value : { [field]: value }

      const res = await fetch(`/api/user/${field}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (res.ok) {
        alert(`${field} updated successfully!`)
        if (field === "password") {
          setCurrentPassword("")
          setNewPassword("")
        } else if (field === "name") setOriginalName(value)
        else if (field === "email") setOriginalEmail(value)
        else if (field === "mobile") setOriginalMobile(value)

        setEditName(false)
        setEditEmail(false)
        setEditMobile(false)
        setEditPassword(false)
      } else {
        alert(data.error || "Something went wrong")
      }
    } catch (err) {
      console.error(err)
      alert("Update failed")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, field: string, value: any) => {
    if (e.key === "Enter") updateField(field, value)
  }

  const toggleTheme = (val: boolean) => {
    setTheme(val)
    localStorage.setItem("theme", val.toString())
    document.documentElement.classList.toggle("dark", val)
  }

  const displayValue = (field: string, value: string | null) => value || `Add ${field}`

  const renderField = (
    label: string,
    value: string | null,
    originalValue: string | null,
    edit: boolean,
    setEdit: (v: boolean) => void,
    setValue: (v: string) => void,
    fieldKey: string
  ) => {
    const hasChanged = value !== originalValue
    return (
      <div className="flex items-center justify-between space-x-2">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">{label}</label>
          {edit ? (
            <Input
              value={value || ""}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, fieldKey, value)}
            />
          ) : (
            <p className="py-2">{displayValue(label.toLowerCase(), value)}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEdit(!edit)}
          >
            {edit ? "Cancel" : value ? "Edit" : `Add ${label}`}
          </Button>
          {edit && hasChanged && (
            <Button
              size="sm"
              onClick={() => updateField(fieldKey, value)}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 border p-6 rounded-2xl max-w-3xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

      {renderField("Full Name", name, originalName, editName, setEditName, setName, "name")}
      {renderField("Email", email, originalEmail, editEmail, setEditEmail, setEmail, "email")}
      {renderField("Mobile", mobile, originalMobile, editMobile, setEditMobile, setMobile, "mobile")}

      {/* Password */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between space-x-2">
          <span className="font-medium text-sm">Change Password</span>
          <Button size="sm" variant="outline" onClick={() => setEditPassword(!editPassword)}>
            {editPassword ? "Cancel" : "Edit"}
          </Button>
        </div>
        {editPassword && (
          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onKeyDown={(e) =>
                handleKeyPress(e, "password", { currentPassword, newPassword })
              }
            />
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) =>
                handleKeyPress(e, "password", { currentPassword, newPassword })
              }
            />
            <Button
              size="sm"
              onClick={() => updateField("password", { currentPassword, newPassword })}
              disabled={loading}
              className="mt-1"
            >
              {loading ? "Saving..." : "Save Password"}
            </Button>
          </div>
        )}
      </div>

      {/* Theme */}
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">Dark Mode</span>
        <Switch checked={theme} onChange={toggleTheme} />
      </div>
    </div>
  )
}