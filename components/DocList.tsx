"use client"
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Doc } from '@/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { ChevronRight, FileText } from 'lucide-react';

function DocList() {
    const router = useRouter();

    const {user} = useUser();
    
    const docs = useQuery(api.docs.getDocs,{
        userId:user?.id|| "",
    })

    if(!user){
        return (
            <div className='w-full p-8 text-center'>
                <p className='text-gray-600'>Please sign in to view your docs</p>


            </div>
        )
    }
    if(!docs){
        return (
            <div className='w-full p-8 text-center'>
                <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
                <p className='text-gray-600 mt-2'>Loading docs</p>

                


            </div>
        )
    }

    if(docs.length ===0){
        return (
            <div className='w-full p-8 text-center border border-gray-200 rounded-lg bg-gray-50'>
                <p className='text-gray-600'>No Docs have been uploaded yet</p>



            </div>
        )
    }
    

  return (
    <div className='w-full'>

        <h2 className='text-xl font-smibold mb-4'>Your Docs</h2>
        <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[40px]'>

                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className='w-[40px]'></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {docs.map((doc: Doc<"docs">)=>(
                        <TableRow
                        key={doc._id}
                        className='cursor-pointer hover:bg-gray-50'
                        onClick={()=>(router.push(`/docs/doc/${doc._id}`))}
                        >
                            <TableCell className='py-2'>
                                <FileText className='h-5 w-5 text-red-500'/>
                            </TableCell>
                                <TableCell className='font-medium'>
                                    {doc.taxPayerName ? doc.taxPayerName : doc.fileName}
                                </TableCell>
                                <TableCell>
                                    {new Date(doc.uploadedAt).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        doc.status ==="pending"
                                        ?"bg-yellow-100 text-yello-800": doc.status ==="processed"? "bg-green-100 text-green-800":"bg-red-100 text-red-800"
                                    }`}>
                                            {doc.status.charAt(0).toUpperCase()+ doc.status.slice(1)}
                                    </span>
                                </TableCell>
                                <TableCell className='text-right'>
                                    <ChevronRight className='h-5 w-5 text-gray-400 ml-auto'/>
                                </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
  )
}

export default DocList

