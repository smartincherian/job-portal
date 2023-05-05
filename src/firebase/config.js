import fireBase from "firebase/compat/app";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrz13m861syrtPWEAObUxCmvNK8Eswz7s",
  authDomain: "job-portal---internship.firebaseapp.com",
  projectId: "job-portal---internship",
  storageBucket: "job-portal---internship.appspot.com",
  messagingSenderId: "1051131717649",
  appId: "1:1051131717649:web:733a76c79186b4bbdda9b0",
  measurementId: "G-8WHH23QEVX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
