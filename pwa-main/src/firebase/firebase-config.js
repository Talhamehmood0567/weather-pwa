// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_SZW89VxVGdpD9VQ6pj3CYL3ZDrJqBhE",
  authDomain: "weather-pwa-f69e7.firebaseapp.com",
  projectId: "weather-pwa-f69e7",
  storageBucket: "weather-pwa-f69e7.firebasestorage.app",
  messagingSenderId: "27071407991",
  appId: "1:27071407991:web:a63eabe618ea8c719a6372",
  measurementId: "G-CY1JQW7TFF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);