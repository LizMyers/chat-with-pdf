// pages/api/get-documents.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../../lib/firebaseAdmin';

interface Document {
  name: string;
  url: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  console.log('Received request with userId:', userId);

  if (!userId || typeof userId !== 'string') {
    console.error('Missing or invalid userId');
    res.status(400).json({ error: 'Missing or invalid userId' });
    return;
  }

  try {
    const prefix = `users/${userId}/files/`;
    const [files] = await storage.getFiles({ prefix });

    console.log('Fetched files:', files);

    const documents: Document[] = files.map(file => ({
      name: file.name.split('/').pop() || '',
      url: `https://storage.googleapis.com/${storage.name}/${file.name}`,
    }));

    console.log('Constructed document objects:', documents);

    res.status(200).json({ documents });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: (error as Error).message });
  }
}