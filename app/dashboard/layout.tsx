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
      <div className='flex flex-col flex-1'>
        <Header  />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </ClerkLoaded>
  );
}

export default DashboardLayout;