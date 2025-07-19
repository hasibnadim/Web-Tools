import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex justify-center items-center h-20 w-full'>
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
    </div>
  )
}

export default Loading