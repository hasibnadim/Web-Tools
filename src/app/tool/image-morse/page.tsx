import ImageMorse from '@/components/ImageMorse';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Image to Morse Code Converter",
    description: "Image and Morse Code",
  };
  
const page = () => {
  return (
    <div className="w-full h-screen">
        <ImageMorse />
    </div>
  )
}

export default page