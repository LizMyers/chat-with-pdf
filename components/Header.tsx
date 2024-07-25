
import React from 'react'
import Link  from 'next/link'
import { 
    UserButton,
    SignedIn,
    SignedOut
    } from '@clerk/nextjs'
import { Button } from './ui/button'
import { FilePlus2 } from 'lucide-react'

export default function Header() {
    // Define custom appearance
    const customAppearance = {
        elements: {
            userButtonAvatarBox: {
                width: '40px', 
                height: '40px', 
                border: '1px solid gray',
                borderRadius: '50%',
                
            },
            userButtonAvatarImage: {
                width: '40px', 
                height: '40px',
            },
        },
    };

    return (
        <div className="flex justify-between mx-10 mt-10 shadow-sm bg-white border-b p-5">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-2xl font-bold">
              <span className="text-gray-400">Chat to </span>
              <span className="text-red-600">PDF</span>
            </Link>
            <Button asChild variant="outline" className="border-none bg-red-600 md:flex">
              <Link href="/dashboard/upload" className="text-white hover:bg-red-600">
                <FilePlus2 className="text-white hover:text-white border-none" />
              </Link>
            </Button>
          </div>
      
          <SignedIn>
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" className="hover:bg-indigo-600 border-none hidden md:flex">
                <Link href="/dashboard/pricing" className="text-gray-500 hover:text-white">
                  Upgrade
                </Link>
              </Button>
      
              <Button asChild variant="outline" className="hover:bg-indigo-600 border-none hidden md:flex">
                <Link href="/dashboard" className="text-gray-500 hover:text-white">
                  My Documents
                </Link>
              </Button>
      
              {/* User button */}
              <UserButton m-2 appearance={customAppearance} />
            </div>
          </SignedIn>
        </div>
      );
}
