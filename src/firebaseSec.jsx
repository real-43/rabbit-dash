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
  apiKey: "AIzaSyBcXhVjq-UscCcW7cHcOfcPpJWZ1v7p4Og",
  authDomain: "rab3-bf963.firebaseapp.com",
  projectId: "rab3-bf963",
  storageBucket: "rab3-bf963.appspot.com",
  messagingSenderId: "525510448549",
  appId: "1:525510448549:web:3821e39a84ba574cdf444c",
  measurementId: "G-ZRFPT54ZK1"
};

// Initialize Firebase
const secApp = initializeApp(firebaseConfig, "Secondary");

// Firebase Authentication object
const db = getFirestore(secApp);
const authSec = getAuth(secApp);
const provider = new GoogleAuthProvider()

export { authSec, provider, db }