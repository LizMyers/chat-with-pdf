"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { UserButton, SignedIn } from '@clerk/nextjs';
import { Button } from './ui/button';
import { FilePlus2, Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="flex justify-between mx-10 mt-10 shadow-sm bg-white border-b p-5 relative">
      <div className="flex items-center space-x-4">
        {/* Hamburger Menu for small screens */}
        <div className="relative" ref={menuRef}>
          <button
            className="md:hidden cursor-pointer mt-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          {menuOpen && (
            <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md z-10 w-48 flex flex-col space-y-2 p-2">
            <Link href="/" className="text-gray-500 hover:bg-gray-200 p-2 rounded" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/dashboard/upgrade" className="text-gray-500 hover:bg-gray-200 p-2 rounded" onClick={() => setMenuOpen(false)}>
                Upgrade
              </Link>
              <Link href="/dashboard" className="text-gray-500 hover:bg-gray-200 p-2 rounded" onClick={() => setMenuOpen(false)}>
                My Documents
              </Link>
            </div>
          )}
        </div>

        <Link href="/" className="text-2xl font-bold">
          <span className="text-gray-400">Chat to </span>
          <span className="text-red-600">PDF</span>
        </Link>
        <Button asChild variant="outline" className="border-none bg-red-600 md:flex tooltip">
          <Link href="/dashboard/upload" className="text-white hover:bg-red-600">
            <FilePlus2 className="text-white hover:text-white border-none" />
            <span className="tooltiptext">Add New Doc</span>
          </Link>
        </Button>
      </div>

      <SignedIn>
        <div className="flex items-center space-x-2">
          <Button
            asChild
            variant="outline"
            className="hover:bg-indigo-600 border-none hidden md:flex"
          >
            <Link href="/dashboard/upgrade" className="text-gray-500 hover:text-white">
              Upgrade
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="hover:bg-indigo-600 border-none hidden md:flex"
          >
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