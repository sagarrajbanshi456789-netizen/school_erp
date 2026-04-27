// components/book-editor/LivePreview.tsx
'use client'
export default function LivePreview({html}:{html:string}){ return <div className='p-4 overflow-auto'><div className='mx-auto aspect-[210/297] max-w-[280px] border bg-white text-black p-6' dangerouslySetInnerHTML={{__html:html}} /></div> }
