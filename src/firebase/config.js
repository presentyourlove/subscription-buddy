import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace with your project's config object
// You can find this in the Firebase Console -> Project Settings
const firebaseConfig = {
    apiKey: "AIzaSyDZtJVFdMr-bomkEFjFlHjdohggFH7aS88",
    authDomain: "subscription-buddy-2353b.firebaseapp.com",
    projectId: "subscription-buddy-2353b",
    storageBucket: "subscription-buddy-2353b.firebasestorage.app",
    messagingSenderId: "699854859216",
    appId: "1:699854859216:web:82b8b51da0731ac72d27d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
