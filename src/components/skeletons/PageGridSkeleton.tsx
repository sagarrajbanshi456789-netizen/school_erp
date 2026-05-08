import PageCardSkeleton from './PageCardSkeleton'

export default function PageGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PageCardSkeleton key={i} />
      ))}
    </div>
  )
}