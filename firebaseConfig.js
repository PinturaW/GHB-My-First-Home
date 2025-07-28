import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBvQJHeAle-gMW5W6GpwA0p_Ed0vq-XOQY",
  authDomain: "ghbhome-6ce63.firebaseapp.com",
  projectId: "ghbhome-6ce63",
  storageBucket: "ghbhome-6ce63.firebasestorage.app",
  messagingSenderId: "727378665479",
  appId: "1:727378665479:web:d60e35b5bba21b7883caa2",
  measurementId: "G-BJZ8Z87TNR"
};


const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
