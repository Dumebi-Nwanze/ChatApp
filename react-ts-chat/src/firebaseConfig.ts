import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC583TAT9KiNQTbcK-v9OGqLz24g0KVU2I",
  authDomain: "react-ts-chat-4df26.firebaseapp.com",
  projectId: "react-ts-chat-4df26",
  storageBucket: "react-ts-chat-4df26.appspot.com",
  messagingSenderId: "597770360128",
  appId: "1:597770360128:web:ef40e5a34fd9f1af4796a5",
  measurementId: "G-V1BS0W6512",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
