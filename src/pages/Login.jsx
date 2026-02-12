import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Moon, Sun, Users } from "lucide-react";
import "../styles/login.css";

const THEME_KEY = "gradglow_theme";

export default function Login() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [role, setRole] = useState("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") setDark(true);
  }, []);

  const handleThemeToggle = () => {
    setDark((current) => {
      const next = !current;
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (role === "advisor") navigate("/advisor");
    else navigate("/");
  };

  return (
    <div className={dark ? "loginPage dark" : "loginPage"}>
      <button
        type="button"
        className="loginThemeBtn"
        aria-label="Toggle theme"
        title="Toggle theme"
        onClick={handleThemeToggle}
      >
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="loginAmbient loginAmbient--left" aria-hidden="true" />
      <div className="loginAmbient loginAmbient--right" aria-hidden="true" />

      <main className="loginCard">
        <header className="loginHeader">
          <h1>Sign In</h1>
          <p>Welcome back! Please enter your details</p>
        </header>

        <div className={role === "advisor" ? "roleSwitch roleSwitch--advisor" : "roleSwitch"}>
          <button
            type="button"
            className={role === "student" ? "roleBtn roleBtn--active" : "roleBtn"}
            onClick={() => setRole("student")}
          >
            <GraduationCap size={20} />
            <span>Student</span>
          </button>

          <button
            type="button"
            className={role === "advisor" ? "roleBtn roleBtn--active" : "roleBtn"}
            onClick={() => setRole("advisor")}
          >
            <Users size={20} />
            <span>Advisor</span>
          </button>
        </div>

        <form className="loginForm" onSubmit={handleSubmit}>
          <label htmlFor="user-id">{role === "advisor" ? "Advisor ID" : "Student ID"}</label>
          <input
            id="user-id"
            type="text"
            className="loginInput"
            placeholder={role === "advisor" ? "Enter your advisor ID" : "Enter your student ID"}
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            required
          />

          <label htmlFor="user-password">Password</label>
          <input
            id="user-password"
            type="password"
            className="loginInput"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <a href="#" className="forgotLink">
            Forgot Password?
          </a>

          <button type="submit" className="loginSubmitBtn">
            <GraduationCap size={20} />
            <span>{role === "advisor" ? "Sign In as Advisor" : "Sign In as Student"}</span>
          </button>
        </form>

        <p className="loginFooterText">
          Don't have an account? <a href="#">Contact Administrator</a>
        </p>
      </main>
    </div>
  );
}
