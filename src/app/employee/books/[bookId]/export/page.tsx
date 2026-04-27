// src/app/admin/books/[bookId]/export/page.tsx
import { Button } from '@/components/ui/button'

export default function ExportPage(){
 return <div className='p-6 space-y-4'>
   <h1 className='text-2xl font-bold'>Export Book</h1>
   <div className='flex gap-2'>
     <Button>Export PDF</Button>
     <Button variant='outline'>Export HTML</Button>
     <Button variant='outline'>Export JSON</Button>
   </div>
 </div>
}
