import { ChevronLeft, Moon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import StudentBottomNav from "../components/StudentBottomNav";
import { useTheme } from "../context/ThemeContext";
import "../styles/courseDetails.css";

const courseMap = {
  CS250: {
    code: "CS250",
    name: "Data Structures & Algorithms",
    instructor: "Prof. Maya Chen",
    status: "On Track",
    summary: "Focus this week: graph traversals, shortest path algorithms, and practice sets.",
  },
  MATH201: {
    code: "MATH201",
    name: "Calculus II",
    instructor: "Prof. Daniel Williams",
    status: "Medium",
    summary: "Focus this week: integration techniques and weekly problem set revisions.",
  },
  ENG105: {
    code: "ENG105",
    name: "Academic Writing",
    instructor: "Prof. Sarah Brooks",
    status: "On Track",
    summary: "Focus this week: thesis revision and annotated bibliography feedback.",
  },
  PHYS151: {
    code: "PHYS151",
    name: "Physics I",
    instructor: "Prof. Arjun Singh",
    status: "High Risk",
    summary: "Focus this week: chapters 4-6 review and lab report completion.",
  },
  HIST220: {
    code: "HIST220",
    name: "Modern World History",
    instructor: "Prof. Emily Wright",
    status: "On Track",
    summary: "Focus this week: comparative essay outline and timeline activity.",
  },
};

export default function StudentCourseDetails() {
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { code } = useParams();

  const course = courseMap[code] ?? {
    code: code ?? "COURSE",
    name: "Course Overview",
    instructor: "Instructor TBA",
    status: "In Review",
    summary: "Detailed course information will be available soon.",
  };

  return (
    <div className={dark ? "coursePage coursePage--dark" : "coursePage"}>
      <header className="courseHeader">
        <button type="button" className="courseBackBtn" onClick={() => navigate(-1)}>
          <ChevronLeft size={18} />
          <span>Back</span>
        </button>

        <button type="button" className="courseThemeBtn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
          <Moon size={18} />
        </button>
      </header>

      <section className="courseCard">
        <p className="courseCode">{course.code}</p>
        <h1>{course.name}</h1>
        <p className="courseMeta">Instructor: {course.instructor}</p>
        <p className="courseMeta">Current Status: {course.status}</p>
        <p className="courseSummary">{course.summary}</p>
      </section>

      <StudentBottomNav />
    </div>
  );
}
