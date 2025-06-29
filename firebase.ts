// app/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database"; 

const firebaseConfig = {
  apiKey: "AIzaSyCjh0fkZrJCNVPzRZMkUm54nNJWY59R_Os",
  authDomain: "safem8-ccdf0.firebaseapp.com",
  databaseURL: "https://safem8-ccdf0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "safem8-ccdf0",
  storageBucket: "safem8-ccdf0.firebasestorage.app",
  messagingSenderId: "902071117927",
  appId: "1:902071117927:web:25a1bd9b1b8cc7dfbb0cc2",
  measurementId: "G-302Y1Y1TR0"
};
// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firebaseApp = initializeApp(firebaseConfig);
const realtimeDb = getDatabase(app);

export { firebaseApp, auth, db, realtimeDb, ref, set };


