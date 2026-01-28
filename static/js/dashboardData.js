import { db } from "./firebase.js";
import {
    collection,
    query,
    orderBy,
    limit,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const auth = getAuth();

let heartRateChart = null;
let activityChart = null;
let temperatureChart = null;

/* -------------------------------
   Thresholds
-------------------------------- */
const HR_THRESHOLD = 90;
const ACTIVITY_THRESHOLD = 7;

/* -------------------------------
   Initialize Charts
-------------------------------- */
export function initCharts() {

    const createChart = (id, label, color, min, max) => {
        const canvas = document.getElementById(id);
        if (!canvas || typeof Chart === "undefined") return null;

        return new Chart(canvas.getContext("2d"), {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label,
                    data: [],
                    borderColor: color,
                    tension: 0.4,
                    pointRadius: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { min, max }
                }
            }
        });
    };

    heartRateChart = createChart("heartRateChart", "Heart Rate (BPM)", "#4a90e2", 60, 110);
    activityChart = createChart("activityChart", "Activity Level", "#7cb342", 0, 10);
    temperatureChart = createChart("temperatureChart", "Temperature (°C)", "#e74c3c", 36, 38);
}

/* -------------------------------
   Data Updates + Anxiety Detection
-------------------------------- */
export function startDataUpdates(onAnxietyDetected) {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
        collection(db, "users", user.uid, "sensorData"),
        orderBy("timestamp", "desc"),
        limit(20)
    );

    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) return;

        const labels = [];
        const hr = [];
        const act = [];
        const temp = [];

        let latestHR = null;
        let latestActivity = null;

        snapshot.forEach(doc => {
            const d = doc.data();
            const time = d.timestamp?.seconds
                ? new Date(d.timestamp.seconds * 1000)
                : new Date();

            labels.unshift(time.toLocaleTimeString());
            hr.unshift(d.heartRate);
            act.unshift(d.activity);
            temp.unshift(d.temperature);

            latestHR = d.heartRate;
            latestActivity = d.activity;
        });

        heartRateChart.data.labels = labels;
        heartRateChart.data.datasets[0].data = hr;
        heartRateChart.update();

        activityChart.data.labels = labels;
        activityChart.data.datasets[0].data = act;
        activityChart.update();

        temperatureChart.data.labels = labels;
        temperatureChart.data.datasets[0].data = temp;
        temperatureChart.update();

        /* -------- Anxiety Logic -------- */
        if (latestHR > HR_THRESHOLD || latestActivity > ACTIVITY_THRESHOLD) {
            onAnxietyDetected({
                heartRate: latestHR,
                activity: latestActivity
            });
        } else {
            onAnxietyDetected(null); // Normal state
        }
    });
}
