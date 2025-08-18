// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";      
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPJys3xMpVR5X4nYhvyVlmGPWtzwQp_Mg",
  authDomain: "rtms-74cc6.firebaseapp.com",
  projectId: "rtms-74cc6",
  storageBucket: "rtms-74cc6.firebasestorage.app",
  messagingSenderId: "723206051993",
  appId: "1:723206051993:web:cf8f68a174310fda0b4008",
  measurementId: "G-2NQ33JBQ84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.useDeviceLanguage(); // Set the language code to the user's device language