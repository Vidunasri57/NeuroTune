import { db } from './firebase.js';
import {
  collection, addDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const auth = getAuth();
let interval;

export function startMockDataGeneration() {
    if (interval) return;

    interval = setInterval(async () => {
        const user = auth.currentUser;
        if (!user) return;

        await addDoc(collection(db, "users", user.uid, "sensorData"), {
            heartRate: 65 + Math.random() * 30,
            activity: Math.floor(Math.random() * 10),
            temperature: 36 + Math.random(),
            timestamp: serverTimestamp()
        });
    }, 30000);
}
