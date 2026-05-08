export default function PageCardSkeleton() {
  return (
    <div className="border rounded-xl p-3 space-y-3 animate-pulse">
      {/* Preview */}
      <div className="bg-gray-300 dark:bg-gray-700 h-32 rounded-md" />

      {/* Title */}
      <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />

      {/* Subtitle */}
      <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />

      {/* Button */}
      <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 rounded-md" />
    </div>
  )
}
