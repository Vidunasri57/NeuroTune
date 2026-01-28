import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDmn_JJqNhv2zKQaSXfT_jFYudXIrqNF1U",
    authDomain: "neurotune-f6f9e.firebaseapp.com",
    projectId: "neurotune-f6f9e",
    storageBucket: "neurotune-f6f9e.appspot.com",
    messagingSenderId: "346910285711",
    appId: "1:346910285711:web:b6755fb38ecc91de6735fa"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
