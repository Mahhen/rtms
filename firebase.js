// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";      

const firebaseConfig = {
  apiKey: "AIzaSyDPJys3xMpVR5X4nYhvyVlmGPWtzwQp_Mg",
  authDomain: "rtms-74cc6.firebaseapp.com",
  projectId: "rtms-74cc6",
  storageBucket: "rtms-74cc6.firebasestorage.app",
  messagingSenderId: "723206051993",
  appId: "1:723206051993:web:cf8f68a174310fda0b4008",
  measurementId: "G-2NQ33JBQ84"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
