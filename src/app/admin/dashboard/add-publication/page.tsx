'use client'

import PublicationForm from '@/components/admin/PublicationForm'
import BookForm from '@/components/admin/BookForm'

import { useFetch } from '@/hooks/useFetch'
import { Level } from '@/types'

export default function AddPublicationPage() {
  const { data: levels, loading } =
    useFetch<Level>('/api/levels')

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-10">
      <section>
        <h1 className="text-3xl font-bold mb-4">
          Add Publication
        </h1>

        <PublicationForm levels={levels} />
      </section>

      <section>
        <h1 className="text-3xl font-bold mb-4">
          Add Book
        </h1>

        <BookForm levels={levels} />
      </section>
    </main>
  )
}