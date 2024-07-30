// lib/firebaseAdmin.js

import admin from 'firebase-admin';
import serviceAccount from '../serviceKey.json';

// Ensure this file is only executed once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: 'pdf-chat-ebe1f.appspot.com',
  });
}

const storage = admin.storage().bucket();

export { storage };