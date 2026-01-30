from flask import Flask, render_template

app = Flask(__name__)

# ---------------- HOME / LANDING PAGE ----------------
@app.route("/")
def home():
    return render_template("index.html")


# ---------------- LOGIN ----------------
@app.route("/login")
def login():
    return render_template("login.html")


# ---------------- SIGNUP ----------------
@app.route("/signup/user")
def signup_user():
    return render_template("signup_user.html")

@app.route("/signup/doctor")
def signup_doctor():
    return render_template("signup_doctor.html")


# ---------------- FORGOT PASSWORD ----------------
@app.route("/forgot")
def forgot():
    return render_template("forgot.html")


# ---------------- DASHBOARD ----------------
@app.route("/dashboard")
def dashboard():
    return render_template("user_dashboard.html")


if __name__ == "__main__":
    app.run(debug=True)
