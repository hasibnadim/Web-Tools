
import { Metadata } from 'next';
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Scanner from './Scanner';

export const metadata: Metadata = {
  title: "Barcode Generator/Scanner",
  description: "Barcode",
};

const page = () => {
  return (
    <div className="w-full h-screen">
      <div className='py-2 container mx-auto'>
        <p>Scan QR Code, Barcode and more</p>
      </div>
      <div className='py-2 container mx-auto'>

        <Tabs defaultValue="scan" className="w-full">
          <TabsList>
            <TabsTrigger value="scan">Scanner</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="scan"><Scanner /></TabsContent>
          <TabsContent value="upload">
            adf
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default page