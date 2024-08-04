// APP/sign-in/[[...sign-in]]/page.tsx
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div className="
      flex 
      items-center 
      justify-center 
      h-screen 
      overflow-scroll 
      p-2 lg:p-5 
      bg-gradient-to-bl from-white to-indigo-600">
      <SignIn />
    </div>
  );
};

export default SignInPage;