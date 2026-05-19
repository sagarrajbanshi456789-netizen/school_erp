'use client'

import { useState } from 'react'
import slugify from 'slugify'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { toast } from 'react-hot-toast'

import AsyncSelect from './AsyncSelect'

import { useFetch } from '@/hooks/useFetch'
import { apiFetch } from '@/lib/api'

interface Level {
  id: string
  name: string
}

interface Class {
  id: string
  name: string
}

interface BookFormProps {
  levels: Level[]
}

export default function BookForm({
  levels,
}: BookFormProps) {
  const [levelId, setLevelId] = useState('')
  const [classId, setClassId] = useState('')

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')

  const [loading, setLoading] = useState(false)

  // Fetch classes dynamically
  const {
    data: classes,
    loading: classesLoading,
  } = useFetch<Class>(
    levelId
      ? `/api/classes?levelId=${levelId}`
      : undefined
  )

  async function handleSubmit() {
    if (!levelId || !classId) {
      return toast.error(
        'Please select level and class'
      )
    }

    if (!title || !author) {
      return toast.error(
        'Please fill all fields'
      )
    }

    try {
      setLoading(true)

      // Auto generate slug
      const slug = slugify(title, {
        lower: true,
        strict: true,
      })

      await apiFetch('/api/admin/books', {
        method: 'POST',
        body: JSON.stringify({
          title,
          author,
          slug,
          levelId,
          classId,
        }),
      })

      toast.success(
        'Book added successfully'
      )

      // Reset form
      setTitle('')
      setAuthor('')
      setClassId('')
    } catch (err: any) {
      toast.error(
        err?.message ||
          'Failed to add book'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Level Select */}
      <AsyncSelect
        value={levelId}
        onChange={(value) => {
          setLevelId(value)
          setClassId('')
        }}
        options={levels}
        placeholder="Select Level"
        getLabel={(item) => item.name}
        getValue={(item) => item.id}
      />

      {/* Class Select */}
      <AsyncSelect
        value={classId}
        onChange={setClassId}
        options={classes}
        placeholder={
          classesLoading
            ? 'Loading classes...'
            : 'Select Class'
        }
        getLabel={(item) => item.name}
        getValue={(item) => item.id}
      />

      {/* Book Title */}
      <Input
        placeholder="Book Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      {/* Author */}
      <Input
        placeholder="Author Name"
        value={author}
        onChange={(e) =>
          setAuthor(e.target.value)
        }
      />

      {/* Preview URL */}
      {title && (
        <div className="text-sm text-muted-foreground border rounded-md p-3 bg-muted">
          URL Preview:
          <span className="font-medium ml-2">
            /books/
            {slugify(title, {
              lower: true,
              strict: true,
            })}
          </span>
        </div>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full"
      >
        {loading
          ? 'Adding Book...'
          : 'Add Book'}
      </Button>
    </div>
  )
}