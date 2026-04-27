// components/book-editor/Toolbar.tsx
'use client'
import { Button } from '@/components/ui/button'
export default function Toolbar(){
 return <div className='border-b p-2 flex gap-2'><Button variant='outline'>Bold</Button><Button variant='outline'>Image</Button><Button variant='outline'>Math</Button><Button variant='outline'>Table</Button></div>
}
