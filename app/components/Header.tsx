"use client";

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { UserButton, SignedIn, useUser, useClerk } from '@clerk/nextjs';
import { Button } from './ui/button';
import { FilePlus2, Menu, X } from 'lucide-react';
import useSubscription from '../hooks/useSubscription';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/actions/createCheckoutSession';
import createStripePortal from '@/actions/createStripePortal';
import getStripe from '@/lib/stripe-js';
import { UserDetails } from '../dashboard/upgrade/page';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isLoaded } = useUser(); // Correct usage of useUser
  const router = useRouter();
  const { hasActiveMembership, loading } = useSubscription();
  const [isPending, startTransition] = useTransition();
  const { signOut } = useClerk(); // Destructure signOut from useClerk

  const handleUpgrade = () => {
    if (!user) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString()!,
      name: user.fullName!,
    };

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasActiveMembership) {
        const stripePortalUrl = await createStripePortal();
        return router.push(stripePortalUrl);
      }

      const sessionId = await createCheckoutSession(userDetails);

      await stripe?.redirectToCheckout({
        sessionId,
      });
    });
  };

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

  const handleManagePlan = () => {
    if (!user) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString()!,
      name: user.fullName!,
    };

    startTransition(async () => {
      const stripe = await getStripe();

      if (hasActiveMembership) {
        const stripePortalUrl = await createStripePortal();
        return router.push(stripePortalUrl);
      }

      const sessionId = await createCheckoutSession(userDetails);

      await stripe?.redirectToCheckout({
        sessionId,
      });
    });
  };

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

  if (!isLoaded) {
    return <div>Loading...</div>; // Ensure the component waits for user data to load
  }

  return (
    <div className="flex justify-between mx-10 mt-10 shadow-sm bg-white border-b p-5 relative">
      <div className="flex items-center space-x-4">
        <div className="relative" ref={menuRef}>
          <button
            className="md:hidden cursor-pointer mt-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          {menuOpen && (
            <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md z-10 w-48 flex flex-col space-y-2 p-2">
              <Link
                href="/"
                target='_top'
                className="text-gray-500 hover:bg-gray-200 p-2 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  signOut();
                }}
                >
                  Home
                </Link>
             
              {!hasActiveMembership && (
                <Link href="/dashboard/upgrade" target='_top' className="text-gray-500 hover:bg-gray-200 p-2 rounded" onClick={() => setMenuOpen(false)}>
                  Upgrade
                </Link>
              )}
          
              {hasActiveMembership && (
                <Link onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  handleManagePlan();
                }} href="#" target='_top' className="text-gray-500 hover:bg-gray-200 p-2 rounded">
                  Pro Tier
                </Link>
              )}
              <Link href="/dashboard" target='_top' className="text-gray-500 hover:bg-gray-200 p-2 rounded" onClick={() => setMenuOpen(false)}>
                My Documents
              </Link>
            </div>
          )}
        </div>

        <Link href='#' target='_top' className="text-2xl font-bold cursor-pointer">
          <span className="text-gray-400">Chat to </span>
          <span className="text-red-600">PDF</span>
        </Link>

        <Button asChild variant="outline" className="border-none bg-red-600 md:flex tooltip">
          <Link href="/dashboard/upload" target='_top' className="text-white hover:bg-red-600">
            <FilePlus2 className="text-white hover:text-white border-none" />
            <span className="tooltiptext">Add New Doc</span>
          </Link>
        </Button>
      </div>

      <SignedIn>
        <div className="flex items-center space-x-2">
          {!hasActiveMembership && (
            <Button
              asChild
              variant="outline"
              className="hover:bg-indigo-600 border-none hidden md:flex"
            >
              <Link href="/dashboard/upgrade" target='_top' className="text-gray-500 hover:text-white">
                Upgrade
              </Link>
            </Button>
          )}
           <Button
            asChild
            variant="outline"
            className="hover:bg-indigo-600 border-none hidden md:flex"
          >
            <Link 
              href="#" 
              target='_top' 
              onClick={handleManagePlan}
              className="text-gray-500 hover:text-white"
              >
              Pro Tier
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="hover:bg-indigo-600 border-none hidden md:flex"
          >
            <Link href="/dashboard" target='_top' className="text-gray-500 hover:text-white">
              My Documents
            </Link>
          </Button>
         
          <UserButton m-2 appearance={customAppearance} />
        </div>
      </SignedIn>
    </div>
  );
};

export default Header;