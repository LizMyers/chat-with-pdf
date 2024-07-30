// app/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Documents from "@/app/components/Documents";

interface Document {
  name: string;
  url: string;
}

export const dynamic = "force-dynamic";

function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    console.log('Authenticated user:', user);

    const fetchDocuments = async () => {
      try {
        const url = `/api/get-documents?userId=${user.id}`;
        console.log(`Fetching documents from URL: ${url}`);

        const response = await fetch(url);

        console.log('Response status:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch documents:', response.statusText, errorText);
          return;
        }

        const data = await response.json();
        console.log('Fetched documents data:', data);
        setDocuments(data.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full max-w-7xl mx-auto bg-gray-100">
      <h1 className="text-gray-500 ml-6 pt-10 text-3xl p-10 bg-gray-100 font-extralight">
        My Documents
      </h1>
      <div className="ml-11">
        <Documents documents={documents} />
      </div>
    </div>
  );
}

export default Dashboard;