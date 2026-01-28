import { loginUser } from "./auth.js";

// Attach AFTER module loads
function handleLoginInternal() {
    console.log("Login button clicked");

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }

    loginUser(email, password);
}

// 🔑 expose globally for inline HTML onclick
window.handleLogin = handleLoginInternal;
