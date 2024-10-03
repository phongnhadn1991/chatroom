import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, getAdditionalUserInfo, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyB5E47eBF-bn4xXLkFolmQb4wCbLMh2MXM",
    authDomain: "nextjs-chat-71a63.firebaseapp.com",
    projectId: "nextjs-chat-71a63",
    storageBucket: "nextjs-chat-71a63.appspot.com",
    messagingSenderId: "882661686622",
    appId: "1:882661686622:web:a624051af61ef67894e3cf"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(firebaseApp);

if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, 'localhost', 8080);
}

export { firebaseApp, auth, getAuth, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, db, collection, getDocs, getAdditionalUserInfo };