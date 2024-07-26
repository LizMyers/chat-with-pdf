'use server'
import { generateEmbeddingsInPineconeVectorStore } from '@/lib/langchain';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function generateEmbeddings(docId: string) {
    
    // send users who are not authenticated to the login page
    auth().protect(); 
    
    //Turn a PDF into embeddings
    await generateEmbeddingsInPineconeVectorStore(docId);
    
    // revalidate the file page to show the new status 
    revalidatePath(`/dashboard`); 

    return { completed: true };
    
}

