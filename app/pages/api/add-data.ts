// import type { NextApiRequest, NextApiResponse } from 'next';
// import { verifyClerkToken } from '../../../lib/verifyClerkToken';
// import { admin } from '../../../lib/firebaseAdmin';

// const db = admin.firestore();

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { token, data } = req.body;

//   try {
//     const firebaseToken = await verifyClerkToken(token);
//     const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

//     if (decodedToken) {
//       const docRef = db.collection('your-collection').doc();
//       await docRef.set(data);
//       res.status(200).send({ message: 'Data added successfully' });
//     } else {
//       res.status(401).send({ message: 'Unauthorized' });
//     }
//   } catch (error) {
//     res.status(500).send({ error: (error as Error).message });
//   }
// }