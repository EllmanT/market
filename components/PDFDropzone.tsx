"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'

import {
    DndContext,useSensor,useSensors,PointerSensor
} from "@dnd-kit/core";
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useSchematicEntitlement } from '@schematichq/schematic-react';
// import { uploadPDF } from '@/actions/uploadPDF';
import { AlertCircle, CheckCircle, CloudUpload, FileWarning } from 'lucide-react';
import { Button } from './ui/button';
import { useQuery } from 'convex/react';
// import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { backendapi } from '@/lib/api';
import ProcessingItem from './Progress';

function PDFDropzone() {

    const [isDraggingOver, setIsDraggingOver]= useState(false);
    const [uploadFiles, setUploadFiles]= useState<string[]>([])
    const [isUploading, setIsUploading]= useState(false);
    const [docId, setDocId] = useState<Id<"docs">|null>(null);
    const [isDocValid, setIsDocValid]= useState(true)

      // Fetch the doc details
    const doc = useQuery(
        api.docs.getDocById,
        docId?{id:docId}: "skip",
    )

    useEffect(()=>{
if(doc===null && docId!==null){
    setIsDocValid(false)
     setTimeout(()=>(
            setDocId(null),
            setIsDocValid(true)
        ),5000)
}
    
    },[doc,docId])


    const fileInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const {user } = useUser();

    const {value:isFeatureEnabled, featureUsageExceeded, featureAllocation} = useSchematicEntitlement("scans")


const handleUpload = useCallback (async(files:FileList| File[])=>{
    if(!user){
        alert("Please sign in to upload file")

        return;
    }
    const fileArray = Array.from(files);
    const pdfFiles = fileArray.filter((file)=> file.type ==="application/pdf"|| file.name.toLocaleLowerCase().endsWith(".pdf"))

    if(pdfFiles.length ===0){
        alert("Please upload PDF files only")

        return;
    }
    setIsUploading(true)

    try {
        // upload file 
        const newUploadedFiles:string []=[];

        for(const file of pdfFiles){
            // Create a formData object to use with the server action

            const formData = new FormData();

            formData.append("file", file);

      const { success, data:responseData, error } = await backendapi.ai.processDocument(formData)
  newUploadedFiles.push(file.name)

    if (success && responseData?.docId) {
     const id =responseData?.docId as Id<"docs">
     console.log("id", id)
            setDocId(id)
    }else{
        console.log(error)
    }

        }
        setUploadFiles((prev)=>[...prev, ...newUploadedFiles])

        setTimeout(()=>(
            setUploadFiles([])
        ),30000)

          
        router.push("/docs")


    } catch (error) {
        console.log("Upload failed", error);
        alert(`Upload of the document failed ${error instanceof Error ? error.message:"unknown error"}`)
    } finally{
        setIsUploading(false);
    }
},[user,router])

  //  Convert the URL string to a Convex Id
    const handleDragLeave = useCallback((e:React.DragEvent)=>{
        e.preventDefault();
        setIsDraggingOver(false);
},[]);
const handleDragOver = useCallback((e:React.DragEvent)=>{
    e.preventDefault();
    setIsDraggingOver(true);
},[]);

const handleDrop = useCallback((e:React.DragEvent)=>{
    e.preventDefault();
    setIsDraggingOver(false);
    console.log("Dropped")
console.log("user", user)
    if(!user){
        alert("Please sign in to upload file")

        return;
    }
    if(e.dataTransfer.files && e.dataTransfer.files.length>0){
        handleUpload(e.dataTransfer.files)
    }
},[]);

const handleFileInputChange = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
   if(e.target.files?.length){
    handleUpload(e.target.files)
   }
},[handleUpload]);

const triggerFileInput = useCallback(()=>{
   fileInputRef.current?.click()
    
 },[]);

    const sensors = useSensors(useSensor(PointerSensor))

   const isUserSignedIn = !!user;

   const canUpload = isUserSignedIn&& isFeatureEnabled;
  return (
    <DndContext sensors={sensors}>
        <div className='w-full max-w-md mx-auto bg-red'>
            <div
            onDragOver={canUpload ?handleDragOver:undefined}
            onDragLeave={canUpload? handleDragLeave:undefined}
            onDrop={canUpload?handleDrop:(e)=>e.preventDefault()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? "border-blue-600 bg-blue-50": "border-gray-300"}${!canUpload?"opacity-70 cursor-not-allowed":""}`}
            >
                    {
                        isUploading?(
                            <div className='flex flex-col items-center'>
                                <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2'>

                                </div>
                                <p>Uploading</p>
                            </div>
                        ): !isUserSignedIn?(
                            <>
                            <CloudUpload className='mx-auto h-12 w-12 text-gray-100'/>
                            <p className='mt-2 text-sm text-gray-600'>Please sign in to upload files</p>
                            </>
                        ):(
                           <>
                           <CloudUpload className='mx-auto h-12 w-12 text-gray-400'/>
                           <p className='mt-2 text-sm text-gray-600'>Drag and drop PDF files here, or click to select files</p>
                           <input
                           type='file'
                           ref={fileInputRef}
                           accept='application/pdf'
                           multiple
                           onChange={handleFileInputChange}
                           className='hidden'
                           />
                           <Button
                           className='hover:cursor-pointer mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
                           disabled={!isFeatureEnabled}
                           onClick={triggerFileInput}
                           >
                            {isFeatureEnabled? "Select files":"Upgrade to upload"}
                           </Button>
                           </> 
                        )
                    }
            </div>

            <div className='mt-4'>
{
    featureUsageExceeded && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
            <AlertCircle
            className="h-5 w-5 mr-2 flex-shrink-0"
            />
            <span>
                You have exceeded your limit of {featureAllocation} scans,

                Please upgrade to continue
                </span>
        </div>
    )
}
            </div>
            {(uploadFiles.length>0) && (
                <div className='mt-4'>
                    <h3 className='font-medium'>Uploaded Files:</h3>

                    <ul className='mt-2 text-sm text-gray-600 space-y-1'>
                        {
                            uploadFiles.map((fileName,i)=>(
                              <ProcessingItem fileName={fileName} key={i}/>
                            ))
                        }
                       

                    </ul>
                </div>
            )}
              {(!isDocValid) && (
                <div className='mt-4'>
                    <h3 className='font-medium'>INVALID DOCUMENT</h3>

                    <ul className='mt-2 text-sm text-gray-600 space-y-1'>
                     
                       
                                   <li className='flex items-center'>
                                    <FileWarning className='h-5 w-5 text-red-500 mr-2'/>
                                   Please upload a valid Invoice, Credit Note or Debit Note. ONLY.
                                   Fiscalisation error
                                </li>
                       

                    </ul>
                </div>
            )}
            </div>    
    </DndContext>
  )
}

export default PDFDropzone