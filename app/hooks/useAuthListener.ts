
// authListener.tsx
'use client'
import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { signInWithCustomToken } from 'firebase/auth';
import { auth as firebaseAuth } from '../../firebase';

const useAuthListener = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const setFirebaseToken = async () => {
      const token = await getToken({ template: "firebase" });
      if (token) {
        signInWithCustomToken(firebaseAuth, token).catch((error) => {
          console.error("Error signing in with custom token: ", error);
        });
      }
    };

    setFirebaseToken();
  }, [getToken]);
};

export default useAuthListener;