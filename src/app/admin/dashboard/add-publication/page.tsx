'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AnimatedCard from '@/components/framer-motion-card/AnimatedCard'
import { Book } from 'lucide-react'
import { toast } from 'react-hot-toast'

// Types
interface Level {
  id: string
  name: string
}

interface Class {
  id: string
  name: string
  levelId: string
}

interface Subject {
  id: string
  name: string
  classId: string
}

interface Publication {
  id: string
  title: string
  description: string
  href: string
  subjectId: string
}

interface BookItem {
  id: string
  title: string
  author: string
  href: string
  levelId: string
  classId: string
}

export default function AddPublicationPage() {
  // Levels
  const [levels, setLevels] = useState<Level[]>([])

  // Classes & Subjects for publications
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])

  // Selection state
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')

  const [selectedBookLevel, setSelectedBookLevel] = useState('')
  const [selectedBookClass, setSelectedBookClass] = useState('')

  // Form state
  const [pubTitle, setPubTitle] = useState('')
  const [pubDesc, setPubDesc] = useState('')
  const [pubHref, setPubHref] = useState('')

  const [bookTitle, setBookTitle] = useState('')
  const [bookAuthor, setBookAuthor] = useState('')
  const [bookHref, setBookHref] = useState('')

  // Preview state
  const [publications, setPublications] = useState<Publication[]>([])
  const [books, setBooks] = useState<BookItem[]>([])

  // Fetch levels on load
  useEffect(() => {
    fetch('/api/levels').then(res => res.json()).then(setLevels)
  }, [])

  // Fetch classes for publications
  useEffect(() => {
    if (!selectedLevel) return
    fetch(`/api/classes?levelId=${selectedLevel}`)
      .then(res => res.json())
      .then(setClasses)
  }, [selectedLevel])

  // Fetch subjects for publications
  useEffect(() => {
    if (!selectedClass) return
    fetch(`/api/subjects?classId=${selectedClass}`)
      .then(res => res.json())
      .then(setSubjects)
  }, [selectedClass])

  // Fetch classes for books
  const [bookClasses, setBookClasses] = useState<Class[]>([])
  useEffect(() => {
    if (!selectedBookLevel) return
    fetch(`/api/classes?levelId=${selectedBookLevel}`)
      .then(res => res.json())
      .then(setBookClasses)
  }, [selectedBookLevel])

  // --- Add Publication ---
  const handleAddPublication = async () => {
    if (!selectedSubject || !pubTitle || !pubDesc || !pubHref) return toast.error('Fill all fields for publication')

    const body = {
      title: pubTitle,
      description: pubDesc,
      href: pubHref,
      subjectId: selectedSubject,
    }

    try {
      const res = await fetch('/api/admin/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Failed to add publication')
      const pub = await res.json()
      setPublications([...publications, pub])
      setPubTitle('')
      setPubDesc('')
      setPubHref('')
      toast.success('Publication added successfully')
    } catch (err: any) {
      toast.error(err.message || 'Error adding publication')
    }
  }

  // --- Add Book ---
  const handleAddBook = async () => {
    if (!selectedBookLevel || !selectedBookClass || !bookTitle || !bookAuthor || !bookHref) 
      return toast.error('Fill all fields for book')

    const body = {
      title: bookTitle,
      author: bookAuthor,
      href: bookHref,
      levelId: selectedBookLevel,
      classId: selectedBookClass,
    }

    try {
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Failed to add book')
      const book = await res.json()
      setBooks([...books, book])
      setBookTitle('')
      setBookAuthor('')
      setBookHref('')
      toast.success('Book added successfully')
    } catch (err: any) {
      toast.error(err.message || 'Error adding book')
    }
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Publication & Book</h1>

      {/* --- Publications Section --- */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add Publication</h2>
        <div className="grid gap-4 mb-4">
          <select className="p-2 border rounded" value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}>
            <option value="">Select Level</option>
            {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <select className="p-2 border rounded" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="p-2 border rounded" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="grid gap-4 mb-4">
          <Input placeholder="Title" value={pubTitle} onChange={e => setPubTitle(e.target.value)} />
          <Input placeholder="Description" value={pubDesc} onChange={e => setPubDesc(e.target.value)} />
          <Input placeholder="Href" value={pubHref} onChange={e => setPubHref(e.target.value)} />
          <Button onClick={handleAddPublication}>Add Publication</Button>
        </div>
      </div>

      {/* --- Books Section --- */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add Book</h2>

        <div className="grid gap-4 mb-4">
          <select className="p-2 border rounded" value={selectedBookLevel} onChange={e => setSelectedBookLevel(e.target.value)}>
            <option value="">Select Level</option>
            {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <select className="p-2 border rounded" value={selectedBookClass} onChange={e => setSelectedBookClass(e.target.value)}>
            <option value="">Select Class</option>
            {bookClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="grid gap-4 mb-4">
          <Input placeholder="Book Title" value={bookTitle} onChange={e => setBookTitle(e.target.value)} />
          <Input placeholder="Author" value={bookAuthor} onChange={e => setBookAuthor(e.target.value)} />
          <Input placeholder="Href" value={bookHref} onChange={e => setBookHref(e.target.value)} />
          <Button onClick={handleAddBook}>Add Book</Button>
        </div>
      </div>

      {/* --- Preview Sections --- */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Publications Preview</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {publications.map((pub, idx) => (
            <AnimatedCard
              key={pub.id}
              title={pub.title}
              description={pub.description}
              href={pub.href}
              icon={<Book className="w-5 h-5 text-blue-500" />}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Books Preview</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {books.map((b, idx) => (
            <AnimatedCard
              key={b.id}
              title={b.title}
              description={`Author: ${b.author}`}
              href={b.href}
              icon={<Book className="w-5 h-5 text-green-500" />}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </section>
    </main>
  )
}