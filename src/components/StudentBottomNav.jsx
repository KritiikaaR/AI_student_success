import { NavLink } from "react-router-dom";
import { UserRound, FileText, LifeBuoy, ClipboardList } from "lucide-react";
import "../styles/studentBottomNav.css";

const items = [
  { to: "/student/personal", label: "Personal Info", Icon: UserRound },
  { to: "/student/action-plan", label: "Personalized Action Plan", Icon: ClipboardList },
  { to: "/student/requests", label: "My Requests", Icon: FileText },
  { to: "/student/help", label: "Help/Support", Icon: LifeBuoy },
];

export default function StudentBottomNav() {
  return (
    <nav className="studentBottomNav">
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `studentNavItem ${isActive ? "active" : ""}`
          }
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
