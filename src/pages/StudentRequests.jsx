import { Moon } from "lucide-react";
import StudentBottomNav from "../components/StudentBottomNav";
import { useTheme } from "../context/ThemeContext";
import "../styles/requests.css";

export default function StudentRequests() {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className={dark ? "requestsPage requestsPage--dark" : "requestsPage"}>
      <header className="requestsHeader">
        <div>
          <h1>My Requests</h1>
          <p>Track your submitted requests and current status</p>
        </div>

        <button type="button" className="requestsThemeBtn" aria-label="Toggle theme" title="Toggle theme" onClick={toggleTheme}>
          <Moon size={18} />
        </button>
      </header>

      <section className="requestsCard">
        <h2>Request History</h2>
        <p>Coming next - we will show request history and status updates here.</p>
      </section>

      <StudentBottomNav />
    </div>
  );
}
