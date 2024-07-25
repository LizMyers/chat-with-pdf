'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { PlusCircleIcon } from 'lucide-react'



function PlaceholderDoc() {

    const router = useRouter();

    const handleClick = () => {
        //check if user is pro or free tier and if they have reached their limit
        router.push('/dashboard/upload/')
    }

  return (
    
        <Button onClick={handleClick} 
                className="flex 
                          flex-col 
                          items-center 
                          justify-center 
                          w-64 h-64 
                          text-gray-500
                          bg-gray-200
                          rounded-xl
                          hover:text-white
                          drop-shadow-md
                          ">

            <PlusCircleIcon className="h-16 w-16" />
            <p>Add a doument</p>
        </Button>
  
  )
}

export default PlaceholderDoc