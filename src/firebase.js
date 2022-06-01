// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwxbFWnsAVxcuxaXmWtX4hVAY-Dqn1CIg",
  authDomain: "coocoo-tracker.firebaseapp.com",
  databaseURL: "https://coocoo-tracker-default-rtdb.firebaseio.com",
  projectId: "coocoo-tracker",
  storageBucket: "coocoo-tracker.appspot.com",
  messagingSenderId: "679449245484",
  appId: "1:679449245484:web:d7d9628f8eb475dfe05e89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);