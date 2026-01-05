import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyAX7nop2AbcPc9Rbn4nsjHz7OQlwVAPnho",
    authDomain: "deepfake-analyzer.firebaseapp.com",
    projectId: "deepfake-analyzer",
    storageBucket: "deepfake-analyzer.firebasestorage.app",
    messagingSenderId: "35202913586",
    appId: "1:35202913586:web:6e5bfac5dcf24ff5a0732b",
    measurementId: "G-2VGN1ZZJK1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};