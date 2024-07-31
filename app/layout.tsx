// root layout for the app

import { ClerkProvider } from '@clerk/nextjs';
import { dark, neobrutalism, shadesOfPurple } from '@clerk/themes';
import "./globals.css";

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
    }}>
      <html lang="en">
        <body className="min-h-screen h-screen overflow-hidden flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
