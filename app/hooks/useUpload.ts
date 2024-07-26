'use client';

import { useState } from "react";
import { useUser } from "@clerk/nextjs"; 
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
//firebase
import { db, storage } from "../../firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { generateEmbeddings } from "@/actions/generateEmbeddings";

export enum StatusText {
    UPLOADING = "Uploading",
    UPLOADED = "File uploaded successfully",
    SAVING = "Saving file to dtabase...",
    GENERATING = "Generating AI Embeddings, This will only take a few seconds",
}

export type Status = StatusText[keyof StatusText];

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null> (null);
  const { user } = useUser();
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (!file || !user) return;
    //TODO FREE/PRO limitations 
 
    const fileIdToUploadTo = uuidv4(); 
    const storageRef = ref(storage, `users/${user.id}/files/${fileIdToUploadTo}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
        const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setStatus(StatusText.UPLOADING);
        setProgress(percent);
    
    }, (error) => {
        console.error("Error uploading the file: " , error);
    }, async() => {
      
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setStatus(StatusText.SAVING);
        await setDoc(doc(db, "users", user.id, "files", fileIdToUploadTo), {
            name: file.name,
            size: file.size,
            type: file.type,
            downloadUrl: downloadURL,
            ref: uploadTask.snapshot.ref.fullPath,
            createdAt: serverTimestamp(),
        });

        setStatus(StatusText.GENERATING);

        //Generate AI embeddings
        await generateEmbeddings(fileIdToUploadTo);
        //await router.push(`/dashboard/files/${fileIdToUploadTo}`);

        setFileId(fileIdToUploadTo);
        
    });
    
  }
 
 return { progress, fileId, status, handleUpload };
}

export default useUpload;