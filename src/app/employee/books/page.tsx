// src/app/admin/books/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BooksPage(){
  const books=[{id:'1',title:'Math Book'},{id:'2',title:'Science Book'}]
  return <div className='p-6 space-y-4'>
    <div className='flex justify-between items-center'>
      <h1 className='text-2xl font-bold'>Books</h1>
      <Link href='/admin/books/create'><Button>Create Book</Button></Link>
    </div>
    <div className='grid gap-3'>
      {books.map(b=><Link key={b.id} href={`/admin/books/${b.id}`} className='rounded-xl border p-4 block'>{b.title}</Link>)}
    </div>
  </div>
}