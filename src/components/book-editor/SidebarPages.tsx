
// components/book-editor/SidebarPages.tsx
'use client'
import { Button } from '@/components/ui/button'
export default function SidebarPages({pages,active,setActive,setPages}:any){
 return <div className='border-r p-3'>
   <div className='flex justify-between mb-3'><b>Pages</b><Button size='sm' onClick={()=>setPages([...pages,{id:String(Date.now()),title:`Page ${pages.length+1}`}])}>Add</Button></div>
   <div className='space-y-2'>{pages.map((p:any)=><button key={p.id} onClick={()=>setActive(p.id)} className={`block w-full rounded border p-2 text-left ${active===p.id?'border-primary':''}`}>{p.title}</button>)}</div>
 </div>
}
