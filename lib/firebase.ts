import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Firebase Configuration with real project credentials and env fallback
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBjjLjymHOrOs3Ekex5xcIJ-tmP4-YVQBg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bubblecash-blockerino-2026.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bubblecash-blockerino-2026",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bubblecash-blockerino-2026.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "796275482668",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:796275482668:web:aee7a956b1bcb456cdf189",
};

// Initialize Firebase safely for SSR/Next.js
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

// Helper functions for cloud syncing
export async function saveCreatorToFirebase(creatorId: string, data: any) {
  try {
    const userRef = doc(db, "creators", creatorId);
    await setDoc(userRef, { ...data, updated_at: new Date().toISOString() }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn("Firebase save error (running local mode):", error);
    return { success: false, error };
  }
}

export async function fetchCreatorFromFirebase(creatorId: string) {
  try {
    const userRef = doc(db, "creators", creatorId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.warn("Firebase fetch error:", error);
    return null;
  }
}

export default app;
