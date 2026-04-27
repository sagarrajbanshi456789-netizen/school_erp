// src/app/employee/books/[bookId]/editor/page.tsx
import BookEditor from "@/components/book-editor/BookEditor"

export default async function EditorPage({
  params,
}: {
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = await params

  return (
    <div className="h-screen w-full overflow-hidden">
      <BookEditor bookId={bookId} />
    </div>
  )
}