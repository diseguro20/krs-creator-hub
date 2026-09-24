import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Firebase Configuration with env vars and safe default fallback
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoKeyForKrsCreatorHub2026",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "krs-creator-hub.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "krs-creator-hub",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "krs-creator-hub.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "10987654321",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:10987654321:web:abcdef123456",
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
