// root layout for the app

import { ClerkProvider } from '@clerk/nextjs';
import { dark, neobrutalism, shadesOfPurple } from '@clerk/themes';
import { Toaster } from '@/components/ui/toaster';
import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <ClerkProvider
    appearance={{
      baseTheme: [dark, neobrutalism],
      variables: { colorPrimary: 'red' },
      signIn: {
        baseTheme: [shadesOfPurple],
        variables: { colorPrimary: 'blue' }
      }
    }}
    afterSignOutUrl= 'http://localhost:3000' // Ensure user is redirected to root page after sign out
    >
      <html lang="en">
        <body className="min-h-screen h-screen overflow-hidden flex flex-col">
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
