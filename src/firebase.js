// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqm6o0LhJzPXCPxGX38XFJHtmGLGwnf4c",
  authDomain: "reels-91218.firebaseapp.com",
  projectId: "reels-91218",
  storageBucket: "reels-91218.appspot.com",
  messagingSenderId: "851172419981",
  appId: "1:851172419981:web:35538d61e8ff48a71175c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, provider, storage, db };
