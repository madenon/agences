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



// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: "estate-mern-f7da7.firebaseapp.com",
//   projectId: "estate-mern-f7da7",
//   storageBucket: "estate-mern-f7da7.appspot.com",
//   messagingSenderId: "702229633810",
//   appId: "1:702229633810:web:c5bc76341b2fc3f40231cb"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);