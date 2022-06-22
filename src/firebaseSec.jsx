// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "@firebase/firestore";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTDIyQunu1knIHSL9v85ER7mNAmM9EIeQ",
  authDomain: "fir-49681.firebaseapp.com",
  databaseURL: "https://fir-49681-default-rtdb.firebaseio.com",
  projectId: "fir-49681",
  storageBucket: "fir-49681.appspot.com",
  messagingSenderId: "309579234663",
  appId: "1:309579234663:web:b86c80d9515579277003c2",
  measurementId: "G-448196V9C8"
};

// Initialize Firebase
const secApp = initializeApp(firebaseConfig, "Secondary");

// Firebase Authentication object
const db = getFirestore(secApp);
const authSec = getAuth(secApp);
const provider = new GoogleAuthProvider()

export { authSec, provider, db }