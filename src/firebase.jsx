// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDMQ8Bpb-tD_U-drRtIFaExNFUpk1jmte0",
    authDomain: "rabbit-dash-1dc42.firebaseapp.com",
    projectId: "rabbit-dash-1dc42",
    storageBucket: "rabbit-dash-1dc42.appspot.com",
    messagingSenderId: "878526308368",
    appId: "1:878526308368:web:bd57031df423571f83aa95",
    measurementId: "G-5H0ZSC8CYV"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication object
const auth = getAuth(app);
const provider = new GoogleAuthProvider()

export { auth, provider }