"use client"

import { authClient } from "@/lib/auth-client"
import ProfileCard from "@/components/profile/ProfileCard"

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <p className="p-6">Loading...</p>
  if (!session) return <p className="p-6">Not logged in</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ProfileCard user={session.user} />
    </div>
  )
}