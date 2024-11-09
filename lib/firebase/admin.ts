import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 
  JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) : 
  undefined;

if (!getApps().length) {
  if (!serviceAccount) {
    throw new Error('Firebase service account is not configured');
  }
  
  initializeApp({
    credential: cert(serviceAccount)
  });
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();