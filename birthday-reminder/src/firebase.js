import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEIB-wucASYvCzzbr5Ofv5ryjR-Hig0mE",
  authDomain: "birthday-reminder-system-bef9b.firebaseapp.com",
  projectId: "birthday-reminder-system-bef9b",
  storageBucket: "birthday-reminder-system-bef9b.firebasestorage.app",
  messagingSenderId: "412808568432",
  appId: "1:412808568432:web:ab44ff2c2b0aef494fdeb5",
  measurementId: "G-RP20M71R6V"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);