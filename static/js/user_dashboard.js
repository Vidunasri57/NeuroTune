import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

import { auth } from "./firebase.js";
import { initCharts, startDataUpdates } from "./dashboardData.js";
import { startMockDataGeneration } from "./mockData.js";

document.addEventListener("DOMContentLoaded", () => {

    /* ================= ELEMENT REFERENCES ================= */
    const audio = document.getElementById("audio-player");
    const soundList = document.querySelector(".sound-list");
    const fileInput = document.getElementById("file-upload");
    const uploadStatus = document.getElementById("upload-status");
    const customSoundList = document.getElementById("custom-sound-list");
    const intensitySlider = document.getElementById("intensity-slider");
    const thoughtInput = document.getElementById("text-input");
    const thoughtHistory = document.getElementById("thought-history");

    let currentSrc = null;
    let audioUnlocked = false;
    let autoMode = false;

    /* ================= BUILT-IN SOUNDS ================= */
    const DEFAULT_SOUNDS = [
        { key: "white", title: "White Noise", src: "/static/audio/white-noise.mp3", builtIn: true },
        { key: "pink",  title: "Pink Noise",  src: "/static/audio/pink-noise.mp3",  builtIn: true },
        { key: "green", title: "Green Noise", src: "/static/audio/green-noise.mp3", builtIn: true },
        { key: "brown", title: "Brown Noise", src: "/static/audio/brown-noise.mp3", builtIn: true }
    ];

    /* ================= LOCAL STORAGE HELPERS ================= */
    const getCustomSounds = () =>
        JSON.parse(localStorage.getItem("customSounds")) || [];

    const saveCustomSounds = (sounds) =>
        localStorage.setItem("customSounds", JSON.stringify(sounds));

    const getThoughts = () =>
        JSON.parse(localStorage.getItem("thoughts")) || [];

    const saveThoughts = (thoughts) =>
        localStorage.setItem("thoughts", JSON.stringify(thoughts));

    /* ================= AUDIO UNLOCK (FIXED) ================= */
    function unlockAudio() {
        if (audioUnlocked) return;

        audio.muted = true;
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false;
            audio.volume = intensitySlider.value / 10;
            audioUnlocked = true;
        }).catch(() => {});
    }

    ["click", "keydown", "touchstart"].forEach(evt =>
        document.addEventListener(evt, unlockAudio, { once: true })
    );

    /* ================= AUDIO PLAYER (FIXED) ================= */
    function playSound(sound, isAuto = false) {
        if (!sound || !sound.src) return;

        unlockAudio(); // 🔑 critical fix

        if (currentSrc === sound.src && !audio.paused) return;

        audio.pause();
        audio.currentTime = 0;
        audio.src = sound.src;
        audio.loop = true;
        audio.volume = intensitySlider.value / 10;

        audio.play().catch(() => {});
        currentSrc = sound.src;
        autoMode = isAuto;

        document.getElementById("now-playing").style.display = "flex";
        document.getElementById("now-playing-title").textContent =
            sound.title + (isAuto ? " (Auto)" : "");
        document.getElementById("last-played-title").textContent = sound.title;
    }

    function stopSound() {
        audio.pause();
        audio.currentTime = 0;
        autoMode = false;
        currentSrc = null;
        document.getElementById("now-playing").style.display = "none";
    }

    intensitySlider.oninput = () => {
        audio.volume = intensitySlider.value / 10;
    };

    /* ================= AUTO THERAPY (UNCHANGED LOGIC) ================= */
    function autoTherapyController(state) {
        if (!state) return;

        const { heartRate, activity } = state;

        if (heartRate >= 70 && heartRate <= 85 && activity <= 5) {
            if (autoMode) stopSound();
            return;
        }

        if (heartRate > 95 && activity > 7)
            return playSound(DEFAULT_SOUNDS.find(s => s.key === "brown"), true);

        if (heartRate > 85)
            return playSound(DEFAULT_SOUNDS.find(s => s.key === "pink"), true);

        if (heartRate > 80)
            return playSound(DEFAULT_SOUNDS.find(s => s.key === "green"), true);

        playSound(DEFAULT_SOUNDS.find(s => s.key === "white"), true);
    }

    /* ================= DASHBOARD SOUND LIST ================= */
    function renderSounds() {
        if (!soundList) return;
        soundList.innerHTML = "";

        const allSounds = [...DEFAULT_SOUNDS, ...getCustomSounds()];

        allSounds.forEach((sound, index) => {
            const row = document.createElement("div");
            row.className = "sound-item";
            row.style.display = "flex";
            row.style.justifyContent = "space-between";

            const title = document.createElement("span");
            title.textContent = sound.title;
            title.onclick = () => playSound(sound, false);
            row.appendChild(title);

            if (!sound.builtIn) {
                const del = document.createElement("button");
                del.textContent = "Delete";
                del.onclick = (e) => {
                    e.stopPropagation();
                    const sounds = getCustomSounds();
                    sounds.splice(index - DEFAULT_SOUNDS.length, 1);
                    saveCustomSounds(sounds);
                    renderSounds();
                    renderCustomizeList();
                };
                row.appendChild(del);
            }

            soundList.appendChild(row);
        });
    }

    /* ================= CUSTOMIZE TAB ================= */
    if (fileInput) {
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file || !file.type.startsWith("audio")) return;

            const url = URL.createObjectURL(file);
            const sounds = getCustomSounds();
            sounds.push({ title: file.name, src: url });
            saveCustomSounds(sounds);

            if (uploadStatus)
                uploadStatus.textContent = "File uploaded successfully ✔";

            fileInput.value = "";
            renderSounds();
            renderCustomizeList();
        };
    }

    function renderCustomizeList() {
        if (!customSoundList) return;
        customSoundList.innerHTML = "";

        getCustomSounds().forEach((sound, index) => {
            const row = document.createElement("div");
            row.className = "custom-sound-row";
            row.style.display = "flex";
            row.style.justifyContent = "space-between";

            const title = document.createElement("span");
            title.textContent = sound.title;

            const del = document.createElement("button");
            del.textContent = "Delete";
            del.onclick = () => {
                const sounds = getCustomSounds();
                sounds.splice(index, 1);
                saveCustomSounds(sounds);
                renderSounds();
                renderCustomizeList();
            };

            row.appendChild(title);
            row.appendChild(del);
            customSoundList.appendChild(row);
        });
    }

    /* ================= TYPE IT OUT ================= */
    function renderThoughtHistory() {
        if (!thoughtHistory) return;

        thoughtHistory.innerHTML = "<h3>Reflections Archive</h3>";

        getThoughts().forEach(entry => {
            const card = document.createElement("div");
            card.className = "echo-card";
            card.innerHTML = `<small>${entry.time}</small><p>${entry.text}</p>`;
            thoughtHistory.appendChild(card);
        });
    }

    document.getElementById("submit-text")?.addEventListener("click", () => {
        const text = thoughtInput.value.trim();
        if (!text) return;

        const thoughts = getThoughts();
        thoughts.unshift({ text, time: new Date().toLocaleString() });
        saveThoughts(thoughts);
        thoughtInput.value = "";
        alert("Thanks for sharing your thoughts. It helps us understand you better.");
        renderThoughtHistory();
    });

    /* ================= AUTH + INIT ================= */
    onAuthStateChanged(auth, (user) => {
        if (!user) return window.location.href = "/login";

        const name = user.email.split("@")[0];
        document.getElementById("user-name").textContent = name;
        document.getElementById("details-name").textContent = name;

        initCharts();
        startDataUpdates(autoTherapyController);
        startMockDataGeneration();

        renderSounds();
        renderCustomizeList();
        renderThoughtHistory();
    });

    /* ================= SIDEBAR ================= */
    document.querySelectorAll(".sidebar li").forEach(tab => {
        tab.onclick = async () => {
            if (tab.id === "tab-logout") {
                await signOut(auth);
                window.location.href = "/login";
                return;
            }

            document.querySelectorAll(".sidebar li").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(tab.id.replace("tab-", "") + "-view")
                ?.classList.add("active");
        };
    });

});
