export default function ProfileCard({ user }: any) {
  return (
    <div className="border rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>

      <div className="space-y-3">
        <p><strong>Name:</strong> {user.name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  )
}