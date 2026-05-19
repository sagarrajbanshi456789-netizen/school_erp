'use client'

import { useState } from 'react'
import slugify from 'slugify'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import AsyncSelect from './AsyncSelect'

import { toast } from 'react-hot-toast'

import { apiFetch } from '@/lib/api'
import { useFetch } from '@/hooks/useFetch'

import {
  Level,
  Class,
  Subject,
} from '@/types'

interface PublicationFormProps {
  levels: Level[]
}

export default function PublicationForm({
  levels,
}: PublicationFormProps) {
  const [levelId, setLevelId] = useState('')
  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] =
    useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  // Fetch classes
  const { data: classes } =
    useFetch<Class>(
      levelId
        ? `/api/classes?levelId=${levelId}`
        : undefined
    )

  // Fetch subjects
  const { data: subjects } =
    useFetch<Subject>(
      classId
        ? `/api/subjects?classId=${classId}`
        : undefined
    )

  async function handleSubmit() {
    if (
      !title ||
      !description ||
      !subjectId
    ) {
      return toast.error(
        'Please fill all fields'
      )
    }

    try {
      setLoading(true)

      // Generate slug automatically
      const slug = slugify(title, {
        lower: true,
        strict: true,
      })

      await apiFetch(
        '/api/admin/publications',
        {
          method: 'POST',
          body: JSON.stringify({
            title,
            description,
            slug,
            subjectId,
          }),
        }
      )

      toast.success(
        'Publication added'
      )

      // Reset form
      setTitle('')
      setDescription('')
      setSubjectId('')
    } catch (err: any) {
      toast.error(
        err.message ||
          'Failed to add publication'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Level */}
      <AsyncSelect
        value={levelId}
        onChange={(value) => {
          setLevelId(value)
          setClassId('')
          setSubjectId('')
        }}
        options={levels}
        placeholder="Select Level"
        getLabel={(l) => l.name}
        getValue={(l) => l.id}
      />

      {/* Class */}
      <AsyncSelect
        value={classId}
        onChange={(value) => {
          setClassId(value)
          setSubjectId('')
        }}
        options={classes}
        placeholder="Select Class"
        getLabel={(c) => c.name}
        getValue={(c) => c.id}
      />

      {/* Subject */}
      <AsyncSelect
        value={subjectId}
        onChange={setSubjectId}
        options={subjects}
        placeholder="Select Subject"
        getLabel={(s) => s.name}
        getValue={(s) => s.id}
      />

      {/* Title */}
      <Input
        placeholder="Publication Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      {/* Description */}
      <Input
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
      />

      {/* URL Preview */}
      {title && (
        <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
          URL Preview:
          <span className="ml-2 font-medium">
            /publications/
            {slugify(title, {
              lower: true,
              strict: true,
            })}
          </span>
        </div>
      )}

      {/* Submit */}
      <Button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full"
      >
        {loading
          ? 'Adding...'
          : 'Add Publication'}
      </Button>
    </div>
  )
}