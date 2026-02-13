import "../styles/personalinfo.css";
import StudentBottomNav from "../components/StudentBottomNav";
import { useNavigate } from "react-router-dom";
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  IdCard,
  BookOpen,
  CalendarDays,
  Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function StudentPersonalInfo() {
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const student = {
    fullName: "Student Name",
    id: "STU123456",
    email: "student.email@university.edu",
    phone: "(555) 123-4567",
    address: "123 Campus Drive, University City, ST 12345",
    major: "Computer Science",
    minor: "Mathematics",
    dob: "01/15/2003",
    enrollmentDate: "09/01/2022",
    expectedGrad: "05/15/2026",
  };

  return (
    <div className={dark ? "piPage piPage--dark" : "piPage"}>
      <header className="piHeader">
        <div>
          <h1>Personal Information</h1>
          <p>View and manage your personal details</p>
        </div>

        <div className="piHeaderActions">
          <button type="button" className="piBackBtn" onClick={() => navigate("/")}>
            Back to Dashboard
          </button>
          <button type="button" className="piThemeBtn" aria-label="Toggle theme" title="Toggle theme" onClick={toggleTheme}>
            <Moon size={18} />
          </button>
        </div>
      </header>

      <div className="piGrid">
        <section className="piCard">
          <div className="piCardTitle">
            <span className="piTitleIcon">
              <User size={16} />
            </span>
            <h2>Contact Information</h2>
          </div>

          <div className="piItem">
            <div className="piLabelRow">
              <User size={16} className="piItemIcon" />
              <span>Full Name</span>
            </div>
            <div className="piValue">{student.fullName}</div>
          </div>

          <div className="piItem">
            <div className="piLabelRow">
              <Mail size={16} className="piItemIcon" />
              <span>Email</span>
            </div>
            <div className="piValue">{student.email}</div>
          </div>

          <div className="piItem">
            <div className="piLabelRow">
              <Phone size={16} className="piItemIcon" />
              <span>Phone</span>
            </div>
            <div className="piValue">{student.phone}</div>
          </div>

          <div className="piItem">
            <div className="piLabelRow">
              <MapPin size={16} className="piItemIcon" />
              <span>Address</span>
            </div>
            <div className="piValue">{student.address}</div>
          </div>
        </section>

        <section className="piCard">
          <div className="piCardTitle">
            <span className="piTitleIcon">
              <GraduationCap size={16} />
            </span>
            <h2>Academic Information</h2>
          </div>

          <div className="piItem">
            <div className="piLabelRow">
              <IdCard size={16} className="piItemIcon" />
              <span>Student ID</span>
            </div>
            <div className="piValue">{student.id}</div>
          </div>

          <div className="piItem">
            <div className="piLabelRow">
              <BookOpen size={16} className="piItemIcon" />
              <span>Major</span>
            </div>
            <div className="piValue">{student.major}</div>
          </div>

          <div className="piItem">
            <div className="piLabelRow">
              <BookOpen size={16} className="piItemIcon" />
              <span>Minor</span>
            </div>
            <div className="piValue">{student.minor}</div>
          </div>

          <div className="piItem">
            <div className="piLabelRow">
              <CalendarDays size={16} className="piItemIcon" />
              <span>Date of Birth</span>
            </div>
            <div className="piValue">{student.dob}</div>
          </div>

          <div className="piItem">
            <div className="piLabelRow">
              <CalendarDays size={16} className="piItemIcon" />
              <span>Enrollment Date</span>
            </div>
            <div className="piValue">{student.enrollmentDate}</div>
          </div>

          <div className="piItem">
            <div className="piLabelRow">
              <CalendarDays size={16} className="piItemIcon" />
              <span>Expected Graduation</span>
            </div>
            <div className="piValue">{student.expectedGrad}</div>
          </div>
        </section>
      </div>

      <StudentBottomNav />
    </div>
  );
}
