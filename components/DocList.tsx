"use client"
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs'
import { usePaginatedQuery } from 'convex/react';
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Doc } from '@/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { ChevronRight, FileText, QrCode, Sparkles, Stamp } from 'lucide-react';
import { Button } from './ui/button';


function DocList() {
    const router = useRouter();

    const {user} = useUser();
    
    const {results,status, loadMore } = usePaginatedQuery(
        api.docs.getDocs,
        {        userId:user?.id|| ""},
         { initialNumItems: 25 },
    
    )

        const docs = results


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

        <h2 className='text-xl font-semibold mb-4'>Your Docs</h2>
        <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[40px]'>

                        </TableHead>
                        <TableHead >Name</TableHead>
                        <TableHead>Uploaded</TableHead>
                        {/* <TableHead>Size</TableHead> */}
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className='w-[40px]'></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {docs.map((doc: Doc<"docs">)=>(
                        <TableRow
                        key={doc._id}
                        className='cursor-pointer hover:bg-gray-100'
                        onClick={()=>(router.push(`/docs/doc/${doc._id}`))}
                        >
                            <TableCell className='py-2'>
                                <FileText className='h-5 w-5 text-red-500'/>
                            </TableCell>
                                <TableCell className='font-medium'>
                                    {doc.docNumber ? doc.docNumber : doc.fileName}
                                </TableCell>
                                <TableCell>
{new Date(doc.uploadedAt).toLocaleDateString(undefined, {
  day: '2-digit',
  month: 'short', // or 'long' or '2-digit'
  year: 'numeric'
})}                                </TableCell>
                              
                                <TableCell>
                                    {doc.transactionTotalAmount ? `${doc.transactionTotalAmount} ${doc.currency ||""}`:"-"}
                                </TableCell>
                               <TableCell className="flex items-center gap-3">
  {/* Status badge (as in your code) */}
 

  {/* Magic button with badge */}
  <div className="relative">
    <button
      title="Magic Action"
    >
         <span
    className={`px-2 py-1 rounded-full text-xs ${
      doc.status === "pending"
        ? "bg-yellow-100 text-yellow-800"
        : doc.status === "processed"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`}
  >
    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
  </span>
    </button>

    {/* Badge shown only if QRCode URL is present */}
    {doc.qrcodeUrl && (
      <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full text-white text-[10px]">
        <QrCode className='text-green-900'/>
      </span>
    )}
  </div>
</TableCell>
                                <TableCell className='text-right'>
                                    <ChevronRight className='h-5 w-5 text-gray-400 ml-auto'/>
                                </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
               

            </Table>
            <div className='flex items-center space-x-2 p-2'>
                
               <Button variant="outline" className=' font-bold bg-blue-500 ' onClick={() => loadMore(5)} disabled={status !== "CanLoadMore"}>
        Prev
      </Button>
       <Button variant="outline" className=' font-bold ' onClick={() => loadMore(5)} disabled={status !== "CanLoadMore"}>
        1
      </Button> 
       <Button variant="outline" className=' font-bold bg-blue-500 ' onClick={() => loadMore(5)} disabled={status !== "CanLoadMore"}>
        Next
      </Button> 
            </div>
                                                {/* <Pagination loadMore={loadMore} /> */}

        </div>
    </div>
  )
}

export default DocList


