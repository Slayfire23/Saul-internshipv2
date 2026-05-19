// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbnPhsITwkDuhu0lIFO0jeV95o3T0w0ms",
  authDomain: "internship-summarist.firebaseapp.com",
  projectId: "internship-summarist",
  storageBucket: "internship-summarist.firebasestorage.app",
  messagingSenderId: "645544836127",
  appId: "1:645544836127:web:605f1cb74adb182e74a92a",
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
