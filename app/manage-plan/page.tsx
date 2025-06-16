import SchematicComponent from '@/components/schematic/SchematicComponent'
import React from 'react'

function Page() {
  return (
    <div className='container xl:max-w-5xl mx-auto p-4 md:p-0'>
        <h1 className='text-2xl font-bold mb-4 -scroll-my-8'>Manage Your Plan</h1>
        <p className='text-gray-500 mb-8'>Manage your subscription and billing details here</p>
        <SchematicComponent
        componentId={process.env.SCHEMATIC_PUBLIC_CUSTOMER_PORTAL_COMPONENT_ID}
        />
    </div>
  )
}

export default Page