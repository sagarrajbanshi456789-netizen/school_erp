"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  defaultValues?: {
    name: string
    email: string
    phone?: string
  }
  action: (formData: FormData) => Promise<void>
  buttonText: string
}

export default function EmployeeForm({
  defaultValues,
  action,
  buttonText,
}: Props) {
  const [pending, startTransition] = useTransition()

  const [form, setForm] = useState({
    name: defaultValues?.name || "",
    email: defaultValues?.email || "",
    phone: defaultValues?.phone || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("email", form.email)
    formData.append("phone", form.phone)

    startTransition(async () => {
      try {
        await action(formData)
        toast.success("Employee saved ✅")

        if (!defaultValues) {
          setForm({ name: "", email: "", phone: "" })
        }
      } catch {
        toast.error("Error saving employee ❌")
      }
    })
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{buttonText}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Optional phone"
          />
        </div>

        <Button onClick={handleSubmit} disabled={pending} className="w-full">
          {pending ? "Saving..." : buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}
