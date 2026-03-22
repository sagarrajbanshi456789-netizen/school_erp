import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsForm() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)

    // 🔥 Replace with API call
    await new Promise((res) => setTimeout(res, 1000))

    setLoading(false)
    alert("Saved!")
  }

  return (
    <div className="space-y-4 border p-4 rounded-2xl">
      <Input
        placeholder="Update name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}