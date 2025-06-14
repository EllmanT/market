import DocList from '@/components/DocList'
import PDFDropzone from '@/components/PDFDropzone'
import React from 'react'

function Page() {
  return (
    <div
    className="container mx-auto py-10 px-4 sm:px-6 lg:px-8"
    >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            <PDFDropzone/>

            <DocList/>
        </div>
    </div>
  )
}

export default Page