import { FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const requiredConfigValues = [
  ['EXPO_PUBLIC_FIREBASE_API_KEY', firebaseConfig.apiKey],
  ['EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', firebaseConfig.authDomain],
  ['EXPO_PUBLIC_FIREBASE_PROJECT_ID', firebaseConfig.projectId],
  ['EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', firebaseConfig.storageBucket],
  ['EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', firebaseConfig.messagingSenderId],
  ['EXPO_PUBLIC_FIREBASE_APP_ID', firebaseConfig.appId],
] as const;

function validateFirebaseConfig(): FirebaseOptions {
  const missingVariables = requiredConfigValues
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingVariables.length > 0) {
    throw new Error(`Missing Firebase configuration: ${missingVariables.join(', ')}`);
  }

  return firebaseConfig;
}

export function getFirebaseFirestore(): Firestore {
  const config = validateFirebaseConfig();
  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  return getFirestore(app);
}
