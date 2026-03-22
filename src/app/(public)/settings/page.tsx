"use client"

import SettingsForm from "@/components/settings/SettingsForm"

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Settings</h1>
      <SettingsForm />
    </div>
  )
}