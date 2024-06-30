import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbjH5WfooPmDUdSwcTN3dPrToLzPNF3xo",
  authDomain: "reels-71064.firebaseapp.com",
  projectId: "reels-71064",
  storageBucket: "reels-71064.appspot.com",
  messagingSenderId: "941125028635",
  appId: "1:941125028635:web:6b5f4c09102e2863c1e1be"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, storage };
