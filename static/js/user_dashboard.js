import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

import { auth } from "./firebase.js";
import { initCharts, startDataUpdates } from "./dashboardData.js";
import { startMockDataGeneration } from "./mockData.js";

let therapyActive = false;
let currentTherapy = null;

const audioPlayer = document.getElementById("audio-player");

/* -------------------------------
   Noise Map
-------------------------------- */
const NOISE_LIBRARY = {
    white: "/static/audio/white-noise.mp3",
    pink: "/static/audio/pink-noise.mp3",
    brown: "/static/audio/brown-noise.mp3",
    green: "/static/audio/green-noise.mp3"
};

/* -------------------------------
   Play / Stop Therapy
-------------------------------- */
function startTherapy(type) {
    if (therapyActive && currentTherapy === type) return;

    therapyActive = true;
    currentTherapy = type;

    audioPlayer.src = NOISE_LIBRARY[type];
    audioPlayer.loop = true;
    audioPlayer.volume = document.getElementById("intensity-slider").value / 10;
    audioPlayer.play();

    document.getElementById("now-playing").style.display = "flex";
    document.getElementById("now-playing-title").textContent =
        `${type.toUpperCase()} Noise (Auto Therapy)`;
}

function stopTherapy() {
    if (!therapyActive) return;

    audioPlayer.pause();
    audioPlayer.currentTime = 0;

    therapyActive = false;
    currentTherapy = null;

    document.getElementById("now-playing").style.display = "none";
}

/* -------------------------------
   Auth + Dashboard Init
-------------------------------- */
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "/";
        return;
    }

    const name = user.email.split("@")[0];
    document.getElementById("user-name").textContent = name;
    document.getElementById("details-name").textContent = name;

    initCharts();

    startDataUpdates((state) => {
        if (!state) {
            stopTherapy();
            return;
        }

        const { heartRate, activity } = state;

        if (heartRate > 90 && activity > 7) {
            startTherapy("brown");
        } else if (heartRate > 90) {
            startTherapy("pink");
        } else {
            startTherapy("white");
        }
    });

    startMockDataGeneration();
});

/* -------------------------------
   Sidebar + Logout
-------------------------------- */
document.querySelectorAll(".sidebar li").forEach(tab => {
    tab.addEventListener("click", async () => {

        if (tab.id === "tab-logout") {
            await signOut(auth);
            window.location.href = "/";
            return;
        }

        document.querySelectorAll(".sidebar li")
            .forEach(t => t.classList.remove("active"));

        document.querySelectorAll(".view")
            .forEach(v => v.classList.remove("active"));

        tab.classList.add("active");

        const view = document.getElementById(
            tab.id.replace("tab-", "") + "-view"
        );
        if (view) view.classList.add("active");
    });
});
