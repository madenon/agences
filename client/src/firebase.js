// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-e37fe.firebaseapp.com",
  projectId: "mern-estate-e37fe",
  storageBucket: "mern-estate-e37fe.appspot.com",
  messagingSenderId: "688370229964",
  appId: "1:688370229964:web:f2280dc95d68ad655a1869"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);