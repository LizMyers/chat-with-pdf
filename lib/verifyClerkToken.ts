import { admin } from './firebaseAdmin';
import { decode } from 'jsonwebtoken';

export const verifyClerkToken = async (token: string) => {
  try {
    const decodedToken = decode(token);
    const uid = decodedToken?.sub; // Clerk user ID
    const firebaseToken = await admin.auth().createCustomToken(uid as string);
    return firebaseToken;
  } catch (error) {
    console.error('Error verifying Clerk token:', error);
    throw new Error('Unauthorized');
  }
};