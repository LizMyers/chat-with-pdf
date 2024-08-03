'use client';

import { useSearchParams } from 'next/navigation';
import { ClerkLoaded } from '@clerk/nextjs';
import Header from '../components/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
 
  

  return (
    <ClerkLoaded>
       <Header />
      <div className='flex-1 flex flex-col h-screen overflow-auto'>
        <main className='flex-1'>
       
          {children}
        </main>
      </div>
    </ClerkLoaded>
  );
}

export default DashboardLayout;