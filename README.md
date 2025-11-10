# NeuroTune — IoT-Based Mental Wellness Wearable  

### Overview  
NeuroTune is a wearable system designed to support mental wellness by helping people manage anxiety, stress, and panic attacks. It uses **IoT technology** and **smart sensors** to track real-time body signals like heart rate, stress level, and motion.  
When it detects signs of distress, NeuroTune automatically plays calming sounds through a connected mobile app to help the user relax.  

This project aims to create a **non-invasive**, **affordable**, and **easy-to-use** solution that combines technology and emotional well-being in a single wearable device.  

---

### How It Works  
The device is powered by an **ESP32 microcontroller**, which acts as the main processor. It gathers live data from multiple sensors, analyzes it, and identifies stress patterns.  

**Sensors used:**  
- **MAX30102 / MAX30105** → Measures heart rate and oxygen levels  
- **GSR Sensor** → Monitors skin conductance to estimate stress  
- **MPU6050** → Tracks body movement and posture changes  

When the system detects abnormal readings, it sends signals to a **mobile app** via **Bluetooth**, which instantly triggers calming audio or alerts. Data can also be uploaded to the **cloud** for long-term analysis and insights.  

---

### System Architecture  
1. **Sensors Layer:** Collects heart rate, motion, and stress data  
2. **Processing Layer (ESP32):** Filters and analyzes signals in real time  
3. **Communication Layer:** Uses Bluetooth for app connection and Wi-Fi for cloud sync  
4. **Application Layer:** Displays readings, triggers responses, and stores data  

---

### Key Features  
-  **Real-Time Monitoring:** Tracks stress, heart rate, and movement  
-  **Automatic Calming Response:** Plays relaxing sounds when distress is detected  
-  **Mobile App Integration:** Displays live data and history  
-  **Cloud Connectivity:** Stores data for long-term tracking  
-  **Low Power Design:** Built for efficiency and daily use  
-  **Scalable System:** Future-ready for AI-based emotional prediction  

---

### Current Stage  
NeuroTune is currently in the **prototype stage**. The basic system is functional, and ongoing work focuses on:  
- Improving sensor accuracy and filtering noise  
- Enhancing comfort and device wearability  
- Strengthening Bluetooth stability and cloud integration  
- Reducing latency in distress detection and response  

---

### Applications  
- Stress and anxiety management  
- Panic attack assistance  
- Emotional pattern tracking  
- Research on physiological responses  

---

### Future Enhancements  
- Integration of **machine learning** for smarter emotional prediction  
- Personalized sound therapy through app preferences  
- Mobile dashboard with detailed emotional insights  
- Improved power management and hardware miniaturization  

---

### Tech Stack  
- **Microcontroller:** ESP32  
- **Sensors:** MAX30102 / MAX30105, GSR Sensor, MPU6050  
- **Communication:** Bluetooth, Wi-Fi  
- **Software Tools:** Arduino IDE / PlatformIO  
- **Cloud Platform:** ThingSpeak / Blynk  
- **App Layer:** Custom Android app for data visualization and control  

---

### Project Goal  
The goal of NeuroTune is to combine **embedded systems**, **IoT**, and **real-time emotional analysis** into one wearable solution that helps people stay aware of their mental health. It promotes a calm, connected, and mindful lifestyle — powered by smart technology.  

---


