// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwL7ORGtV3j2rRpSddaU-PX-uEPZSL5l4",
  authDomain: "react-firebase-sh.firebaseapp.com",
  projectId: "react-firebase-sh",
  storageBucket: "react-firebase-sh.appspot.com",
  messagingSenderId: "778610877219",
  appId: "1:778610877219:web:70c73f2682ab63f7e7e296",
  measurementId: "G-41XC67N0X8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export default app;