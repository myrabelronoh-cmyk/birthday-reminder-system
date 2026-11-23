// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEIB-wucASYvCzzbr5Ofv5ryjR-Hig0mE",
  authDomain: "birthday-reminder-system-bef9b.firebaseapp.com",
  projectId: "birthday-reminder-system-bef9b",
  storageBucket: "birthday-reminder-system-bef9b.firebasestorage.app",
  messagingSenderId: "412808568432",
  appId: "1:412808568432:web:ab44ff2c2b0aef494fdeb5",
  measurementId: "G-RP20M71R6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);