import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  ChevronRight,
  Clock3,
  Check,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  LineChart,
  MessageCircle,
  MessageSquare,
  Moon,
  Phone,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import profileImg from "../assets/kriti.jpg.jpeg";
import StudentBottomNav from "../components/StudentBottomNav";
import { useTheme } from "../context/ThemeContext";
import { createStoredRequest } from "../utils/requestStore";
import "../styles/dashboard.css";
import "react-datepicker/dist/react-datepicker.css";

const QUICK_ACCESS = [
  { label: "Course Materials", icon: BookOpen },
  { label: "Credits", icon: GraduationCap },
  { label: "Course Performance", icon: LineChart },
  { label: "Study Groups", icon: Users },
  { label: "Notifications", icon: Bell },
];

const COURSE_MATERIALS_PLACEHOLDER = [
  { id: "m1", title: "Introduction to Programming - Lecture Slides Week 8", meta: "CS101", fileType: "PDF", size: "2.4 MB", fileUrl: "#" },
  { id: "m2", title: "Calculus II - Problem Set 5", meta: "MATH201", fileType: "PDF", size: "1.1 MB", fileUrl: "#" },
  { id: "m3", title: "Physics Lab Manual - Chapter 4", meta: "PHYS151", fileType: "PDF", size: "3.2 MB", fileUrl: "#" },
  { id: "m4", title: "Data Structures - Code Examples", meta: "CS250", fileType: "ZIP", size: "5.7 MB", fileUrl: "#" },
];

function normalizeGpa(gpa, max) {
  return Math.round((gpa / max) * 100);
}

function ecaBalanceScore(hoursPerWeek) {
  const hours = Math.max(0, hoursPerWeek);
  const idealMin = 4;
  const idealMax = 8;

  if (hours === 0) return 0;
  if (hours < idealMin) return Math.round((hours / idealMin) * 85);
  if (hours <= idealMax) return 100;
  if (hours <= 12) return Math.round(100 - ((hours - idealMax) / (12 - idealMax)) * 45);
  if (hours <= 16) return Math.round(55 - ((hours - 12) / 4) * 35);
  return 15;
}

function scoreTone(score) {
  if (score >= 80) return "good";
  if (score >= 60) return "warn";
  return "bad";
}

function getLocalMinDate() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [photoOpen, setPhotoOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [apptOpen, setApptOpen] = useState(false);
  const [courseMaterialsOpen, setCourseMaterialsOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [coursePerformanceOpen, setCoursePerformanceOpen] = useState(false);
  const [studyGroupsOpen, setStudyGroupsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [courseMaterials, setCourseMaterials] = useState(COURSE_MATERIALS_PLACEHOLDER);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [apptDate, setApptDate] = useState(null);
  const [apptTime, setApptTime] = useState("");
  const [apptReason, setApptReason] = useState("");

  const student = useMemo(
    () => {
      const gpaRaw = 3.2;
      const gpaMax = 4.0;
      const attendanceRaw = 92;
      const ecaHours = 3;

      const gpaScore = normalizeGpa(gpaRaw, gpaMax);
      const attendanceScore = attendanceRaw;
      const ecaScore = ecaBalanceScore(ecaHours);

      return {
        name: "Student Name",
        term: "Fall 2024",
        role: "Undergraduate Student",
        gpa: {
          score: gpaScore,
          value: `${gpaRaw.toFixed(1)} / ${gpaMax.toFixed(1)}`,
          tone: scoreTone(gpaScore),
          detail: {
            title: "GPA Conversion",
            summary: `${gpaScore}/100`,
            formula: `(${gpaRaw.toFixed(1)} / ${gpaMax.toFixed(1)}) × 100 = ${gpaScore}`,
            breakdown: `Raw GPA: ${gpaRaw.toFixed(1)} out of ${gpaMax.toFixed(1)}`,
            scale: "Scale: GPA uses 0-4.0, dashboard compares everything on a 0-100 scale.",
            note: "This score does not change your transcript GPA. It is only a normalized dashboard view.",
          },
        },
        attendance: {
          score: attendanceScore,
          value: `${attendanceRaw}%`,
          tone: scoreTone(attendanceScore),
          detail: {
            title: "Attendance Scale",
            summary: `${attendanceScore}/100`,
            formula: `${attendanceRaw}% attendance = ${attendanceScore}/100`,
            breakdown: `Raw attendance: ${attendanceRaw}%`,
            scale: "Scale: Already percentage-based, so no extra conversion is needed.",
            note: "Consistent attendance usually supports assignment completion and exam readiness.",
          },
        },
        eca: {
          score: ecaScore,
          value: `${ecaHours} hours`,
          tone: scoreTone(ecaScore),
          detail: {
            title: "ECA Balance Score",
            summary: `${ecaScore}/100`,
            formula: `${ecaHours} hrs/week -> ${ecaScore}/100`,
            breakdown: `Raw ECA time: ${ecaHours} hours/week`,
            scale: "Scale: 4-8 hrs/week is ideal (100). Too little or too much reduces score.",
            note: "100 hours/week is not considered good. Overload lowers this balance metric.",
          },
        },
        successScore: 77,
        riskLabel: "Medium Risk",
      };
    },
    []
  );

  const courses = useMemo(
    () => [
      { code: "CS250", name: "Data Structures & Algorithms", status: "On Track", tone: "good" },
      { code: "MATH201", name: "Calculus II", status: "Medium", tone: "warn" },
      { code: "ENG105", name: "Academic Writing", status: "On Track", tone: "good" },
      { code: "PHYS151", name: "Physics I", status: "High Risk", tone: "bad" },
      { code: "HIST220", name: "Modern World History", status: "On Track", tone: "good" },
    ],
    []
  );

  const assignments = useMemo(
    () => ({ completed: 79.3, inProgress: 13.8, overdue: 6.9 }),
    []
  );

  const advisor = useMemo(
    () => ({ name: "Swekchha Hamal", phone: "(555) 987-6543" }),
    []
  );

  const riskTips = useMemo(
    () => [
      "1 missing assignment in MATH201",
      "PHYS151 requires additional attention",
      "Consider attending office hours for challenging subjects",
      "Maintain current attendance levels",
    ],
    []
  );

  const notifications = useMemo(
    () => [
      {
        title: "New Assignment Posted",
        body: "CS101: Programming Assignment 4 is now available",
        time: "5 minutes ago",
      },
      {
        title: "Grade Posted",
        body: "Your grade for MATH201 Problem Set 5 is now available",
        time: "2 hours ago",
      },
      {
        title: "Upcoming Deadline",
        body: "PHYS151 Lab Report due tomorrow at 11:59 PM",
        time: "3 hours ago",
      },
      {
        title: "Reminder",
        body: "Office hours with Prof. Williams starts in 1 hour",
        time: "5 hours ago",
      },
    ],
    []
  );

  const studyGroups = useMemo(
    () => [
      { title: "Programming Study Group", meta: "CS101 • 8 members", time: "Today, 6:00 PM", room: "Library Room 3A" },
      { title: "Calculus Help Session", meta: "MATH201 • 12 members", time: "Tomorrow, 3:00 PM", room: "Math Building 202" },
      { title: "Physics Lab Partners", meta: "PHYS151 • 6 members", time: "Wednesday, 4:00 PM", room: "Science Hall Lab 2" },
      { title: "Data Structures Workshop", meta: "CS250 • 10 members", time: "Friday, 2:00 PM", room: "Computer Lab 1" },
    ],
    []
  );

  const creditsSummary = useMemo(() => {
    const completed = 78;
    const total = 120;
    return {
      completed,
      total,
      remaining: Math.max(0, total - completed),
      progress: Math.round((completed / total) * 100),
    };
  }, []);

  const performanceTrend = useMemo(
    () => [
      { period: "W1", MATH201: 74, PHYS151: 71, CS250: 79, ENGL101: 85 },
      { period: "W2", MATH201: 76, PHYS151: 73, CS250: 81, ENGL101: 86 },
      { period: "W3", MATH201: 75, PHYS151: 72, CS250: 83, ENGL101: 84 },
      { period: "W4", MATH201: 78, PHYS151: 74, CS250: 84, ENGL101: 87 },
      { period: "W5", MATH201: 80, PHYS151: 76, CS250: 86, ENGL101: 88 },
      { period: "W6", MATH201: 79, PHYS151: 77, CS250: 85, ENGL101: 89 },
      { period: "W7", MATH201: 82, PHYS151: 79, CS250: 88, ENGL101: 90 },
      { period: "W8", MATH201: 84, PHYS151: 80, CS250: 90, ENGL101: 91 },
    ],
    []
  );

  useEffect(() => {
    let isActive = true;

    const loadCourseMaterials = async () => {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

      // Placeholder fallback for now. Once backend is connected, uploaded files
      // from the API should replace these and render directly for students.
      if (!apiBaseUrl) {
        setCourseMaterials(COURSE_MATERIALS_PLACEHOLDER);
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/student/course-materials`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch course materials.");

        const payload = await response.json();
        const materialsFromApi = Array.isArray(payload?.materials) ? payload.materials : [];

        if (!isActive) return;

        if (materialsFromApi.length > 0) {
          setCourseMaterials(
            materialsFromApi.map((item, index) => ({
              id: item.id ?? `material-${index}`,
              title: item.title ?? "Untitled Material",
              meta: item.courseCode ?? "COURSE",
              fileType: item.fileType ?? "FILE",
              size: item.sizeLabel ?? "N/A",
              fileUrl: item.fileUrl ?? "#",
            }))
          );
          return;
        }

        setCourseMaterials(COURSE_MATERIALS_PLACEHOLDER);
      } catch {
        if (isActive) setCourseMaterials(COURSE_MATERIALS_PLACEHOLDER);
      }
    };

    loadCourseMaterials();
    return () => {
      isActive = false;
    };
  }, []);

  const closeMessageModal = () => {
    setMessageOpen(false);
    setMessageSubject("");
    setMessageBody("");
  };

  const handleSendMessage = () => {
    if (!messageSubject.trim() || !messageBody.trim()) return;
    closeMessageModal();
  };

  const closeApptModal = () => {
    setApptOpen(false);
    setApptDate(null);
    setApptTime("");
    setApptReason("");
  };

  const handleSendAppointment = () => {
    if (!apptDate || !apptTime || !apptReason.trim()) return;

    createStoredRequest({
      type: "appointment",
      title: `Appointment Request with ${advisor.name}`,
      status: "pending",
      appointment: {
        advisorName: advisor.name,
        studentName: student.name,
        date: apptDate.toISOString(),
        time: apptTime,
        reason: apptReason.trim(),
      },
    });

    closeApptModal();
  };

  const minAppointmentDate = useMemo(() => getLocalMinDate(), []);

  useEffect(() => {
    const lockScroll = studyGroupsOpen || notificationsOpen || courseMaterialsOpen || creditsOpen || coursePerformanceOpen;
    if (!lockScroll) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [studyGroupsOpen, notificationsOpen, courseMaterialsOpen, creditsOpen, coursePerformanceOpen]);

  return (
    <div className={dark ? "dash dash--dark" : "dash"}>
      <header className="dashTop">
        <div className="welcome">
          <h1 className="welcomeTitle">
            Welcome back, <span className="welcomeName">{student.name}</span>
          </h1>
          <p className="welcomeSub">Here's your academic overview for {student.term}</p>
        </div>

        <div className="termBox">
          <div className="termLabel">CURRENT TERM</div>
          <div className="termValue">{student.term}</div>
        </div>

        <button
          type="button"
          className="iconBtn"
          aria-label="Toggle theme"
          title="Toggle theme"
          onClick={toggleTheme}
        >
          <Moon size={18} />
        </button>
      </header>

      <div className="dashDivider" />

      <div className="grid">
        <div className="colLeft">
          <Section title="Success Indicator">
            <div className="successRow">
              <div className="scoreBlock">
                <div className="scoreNum">{student.successScore}</div>
                <div className="scoreSub">OUT OF 100</div>
              </div>

              <Gauge value={student.successScore} />

              <div className="riskPill">{student.riskLabel}</div>
            </div>

            <div className="successBar">
              <div className="successBarFill" style={{ width: `${student.successScore}%` }} />
            </div>
            <div className="successBarLabels">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </Section>

          <Section title="Academic Performance">
            <div className="courseList">
              {courses.map((course) => (
                <button key={course.code} type="button" className="courseCard" onClick={() => navigate(`/student/course/${course.code}`)}>
                  <div>
                    <div className="courseCode">{course.code}</div>
                    <div className="courseName">{course.name}</div>
                  </div>

                  <div className="courseRight">
                    <span className={`pill pill--${course.tone}`}>{course.status}</span>
                    <ChevronRight className="chev" />
                  </div>
                </button>
              ))}
            </div>
          </Section>
        </div>

        <div className="colRight">
          <div className="profileCard">
            <button type="button" className="avatarBtn" title="View photo" onClick={() => setPhotoOpen(true)}>
              <img className="avatar" src={profileImg} alt="Student profile" />
            </button>
            <div className="profileName">{student.name}</div>
            <div className="profileTerm">{student.term}</div>
            <div className="profileRole">{student.role}</div>
          </div>

          <Section title="Assignments" compact>
            <ProgressRow label="Completed" value={assignments.completed} tone="good" />
            <ProgressRow label="In Progress" value={assignments.inProgress} tone="warn" />
            <ProgressRow label="Overdue" value={assignments.overdue} tone="bad" />
          </Section>

          <Section compact>
            <div className="tipCard">
              <div className="tipTitle">
                <TrendingUp size={22} />
                <span>Can I be At Risk?</span>
              </div>

              <ul className="tipList">
                {riskTips.map((tip) => (
                  <li key={tip} className="tipItem">
                    <span className="tipBullet">
                      <Check size={16} />
                    </span>
                    <span className="tipText">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        </div>
      </div>

      <div className="dashDivider" />

      <div className="rowAO">
        <div className="rowAO__left">
          <Section title="Academic Overview">
            <div className="overviewGauges">
              <MiniGauge
                label="GPA"
                value={student.gpa.score}
                sub={student.gpa.value}
                tone={student.gpa.tone}
                detail={student.gpa.detail}
              />
              <MiniGauge
                label="Attendance"
                value={student.attendance.score}
                sub={student.attendance.value}
                tone={student.attendance.tone}
                detail={student.attendance.detail}
              />
              <MiniGauge
                label="Weekly ECA Hours"
                value={student.eca.score}
                sub={student.eca.value}
                tone={student.eca.tone}
                detail={student.eca.detail}
              />
            </div>
          </Section>
        </div>

        <div className="rowAO__right">
          <Section title="Advisor & Support" compact>
            <div className="advisorBox">
              <div className="advisorName">{advisor.name}</div>
              <div className="advisorPhone">
                <Phone size={18} className="advisorPhoneIcon" />
                <span>{advisor.phone}</span>
              </div>
            </div>

            <button type="button" className="advisorBtn advisorBtn--ghost" onClick={() => setMessageOpen(true)}>
              <MessageSquare size={18} />
              <span>Send Message</span>
            </button>

            <button type="button" className="advisorBtn advisorBtn--primary" onClick={() => setApptOpen(true)}>
              <Calendar size={18} />
              <span>Schedule Appointment</span>
            </button>
          </Section>
        </div>
      </div>

      <div className="dashDivider" />

      <section className="fullRow section">
        <div className="sectionTitle">Quick Access</div>
        <div className="quickGrid">
          {QUICK_ACCESS.map((item) => {
            const ItemIcon = item.icon;
            const handleQuickClick = () => {
              if (item.label === "Course Materials") setCourseMaterialsOpen(true);
              if (item.label === "Credits") setCreditsOpen(true);
              if (item.label === "Course Performance") setCoursePerformanceOpen(true);
              if (item.label === "Study Groups") setStudyGroupsOpen(true);
              if (item.label === "Notifications") setNotificationsOpen(true);
            };
            return (
              <button key={item.label} type="button" className="quickCard" onClick={handleQuickClick}>
                <ItemIcon className="i" />
                <div className="quickLabel">{item.label}</div>
              </button>
            );
          })}
        </div>
      </section>

      <StudentBottomNav />

      <Modal open={photoOpen} onClose={() => setPhotoOpen(false)} title="Student Photo">
        <div className="modalPhotoWrap">
          <img className="modalPhoto" src={profileImg} alt="Student" />
          <div className="modalPhotoName">{student.name}</div>
        </div>
      </Modal>

      <Modal open={messageOpen} onClose={closeMessageModal} title={`Send Message to ${advisor.name}`}>
        <p className="composeSubtext">Compose and send a message to your academic advisor</p>

        <div className="composeForm">
          <label htmlFor="message-subject" className="composeLabel">
            Subject
          </label>
          <input
            id="message-subject"
            type="text"
            className="composeInput"
            placeholder="Enter message subject..."
            value={messageSubject}
            onChange={(event) => setMessageSubject(event.target.value)}
          />

          <label htmlFor="message-body" className="composeLabel">
            Message
          </label>
          <textarea
            id="message-body"
            className="composeTextarea"
            placeholder="Type your message here..."
            value={messageBody}
            onChange={(event) => setMessageBody(event.target.value)}
          />
        </div>

        <div className="composeActions">
          <button type="button" className="composeBtn composeBtn--cancel" onClick={closeMessageModal}>
            Cancel
          </button>
          <button
            type="button"
            className="composeBtn composeBtn--send"
            onClick={handleSendMessage}
            disabled={!messageSubject.trim() || !messageBody.trim()}
          >
            Send Message
          </button>
        </div>
      </Modal>

      <Modal open={apptOpen} onClose={closeApptModal} title={`Schedule Appointment with ${advisor.name}`}>
        <p className="apptSubtext">Select a date and time for your advisor meeting</p>

        <div className="apptForm">
          <label htmlFor="appt-date" className="apptLabel">
            Select Date
          </label>
          <div className="apptFieldShell">
            <CalendarDays size={20} className="apptFieldIcon" />
            <DatePicker
              id="appt-date"
              selected={apptDate}
              onChange={(date) => setApptDate(date)}
              minDate={minAppointmentDate}
              placeholderText="MM/DD/YYYY"
              dateFormat="MM/dd/yyyy"
              className="apptInput apptInput--date"
              calendarClassName="apptDatePicker"
              popperClassName="apptDatePickerPopper"
              showPopperArrow={false}
            />
          </div>

          <label htmlFor="appt-time" className="apptLabel">
            Select Time
          </label>
          <div className="apptFieldShell">
            <Clock3 size={20} className="apptFieldIcon" />
            <select
              id="appt-time"
              className="apptInput apptSelect"
              value={apptTime}
              onChange={(event) => setApptTime(event.target.value)}
            >
              <option value="">Select a time slot</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>

          <label htmlFor="appt-reason" className="apptLabel">
            Reason for Appointment
          </label>
          <textarea
            id="appt-reason"
            className="apptTextarea"
            placeholder="e.g., Discuss course selection for next semester, review academic progress..."
            value={apptReason}
            onChange={(event) => setApptReason(event.target.value)}
          />
        </div>

        <div className="apptActions">
          <button type="button" className="apptBtn apptBtn--cancel" onClick={closeApptModal}>
            Cancel
          </button>
          <button
            type="button"
            className="apptBtn apptBtn--send"
            onClick={handleSendAppointment}
            disabled={!apptDate || !apptTime || !apptReason.trim()}
          >
            Send Request
          </button>
        </div>
      </Modal>

      <QuickLinksModal
        open={courseMaterialsOpen}
        onClose={() => setCourseMaterialsOpen(false)}
        title="Course Materials"
        icon={<BookOpen size={22} />}
        iconClass="quickModalHeadIcon quickModalHeadIcon--blue"
      >
        <div className="quickModalScroll">
          {courseMaterials.length > 0 ? (
            courseMaterials.map((item) => (
              <article key={item.id} className="materialsCard">
                <div className="materialsMain">
                  <h3 className="quickModalItemTitle">{item.title}</h3>
                  <p className="quickModalItemMeta">
                    {item.meta} • {item.fileType} • {item.size}
                  </p>
                </div>
                <a
                  href={item.fileUrl}
                  className="materialDownloadBtn"
                  download
                  onClick={(event) => {
                    if (item.fileUrl === "#") event.preventDefault();
                  }}
                >
                  <Download size={16} />
                  <span>Download</span>
                </a>
              </article>
            ))
          ) : (
            <div className="materialEmpty">No course materials available.</div>
          )}
        </div>
      </QuickLinksModal>

      <QuickLinksModal
        open={creditsOpen}
        onClose={() => setCreditsOpen(false)}
        title="Credits"
        icon={<Award size={22} />}
        iconClass="quickModalHeadIcon quickModalHeadIcon--green"
      >
        <div className="quickModalScroll">
          <article className="creditsCard">
            <div className="creditsStats">
              <div className="creditsStatBox">
                <div className="creditsStatLabel">Credits Completed</div>
                <div className="creditsStatValue">{creditsSummary.completed}</div>
              </div>
              <div className="creditsStatBox">
                <div className="creditsStatLabel">Credits Remaining</div>
                <div className="creditsStatValue">{creditsSummary.remaining}</div>
              </div>
              <div className="creditsStatBox">
                <div className="creditsStatLabel">Total Credits Required</div>
                <div className="creditsStatValue">{creditsSummary.total}</div>
              </div>
            </div>
            <div className="creditsProgressWrap">
              <div className="creditsProgressTop">
                <span>Progress</span>
                <span>{creditsSummary.progress}%</span>
              </div>
              <div className="creditsProgressTrack">
                <div className="creditsProgressFill" style={{ width: `${creditsSummary.progress}%` }} />
              </div>
            </div>
          </article>
        </div>
      </QuickLinksModal>

      <QuickLinksModal
        open={coursePerformanceOpen}
        onClose={() => setCoursePerformanceOpen(false)}
        title="Course Performance"
        icon={<LineChart size={22} />}
        iconClass="quickModalHeadIcon quickModalHeadIcon--teal"
      >
        <div className="quickModalScroll">
          <article className="performanceCard">
            <div className="performanceChartWrap">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={performanceTrend} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line type="monotone" dataKey="MATH201" stroke="#2563eb" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="PHYS151" stroke="#9333ea" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="CS250" stroke="#0d9488" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ENGL101" stroke="#f97316" strokeWidth={2} dot={false} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </article>
        </div>
      </QuickLinksModal>

      <QuickLinksModal
        open={studyGroupsOpen}
        onClose={() => setStudyGroupsOpen(false)}
        title="Study Groups"
        icon={<Users size={22} />}
        iconClass="quickModalHeadIcon quickModalHeadIcon--purple"
      >
        <div className="quickModalScroll">
          {studyGroups.map((group) => (
            <article key={group.title} className="studyCard">
              <h3 className="quickModalItemTitle">{group.title}</h3>
              <p className="quickModalItemMeta studyMeta">{group.meta}</p>
              <p className="studyLine">
                <Clock3 size={18} />
                <span>{group.time}</span>
              </p>
              <p className="studyLine">
                <ExternalLink size={18} />
                <span>{group.room}</span>
              </p>
              <button type="button" className="studyChatBtn">
                <MessageCircle size={18} />
                <span>Join Chat</span>
              </button>
            </article>
          ))}
        </div>
      </QuickLinksModal>

      <QuickLinksModal
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Notifications"
        icon={<Bell size={22} />}
        iconClass="quickModalHeadIcon quickModalHeadIcon--red"
      >
        <div className="quickModalScroll">
          {notifications.map((note) => (
            <article key={note.title} className="notifyCard">
              <div className="notifyDot" />
              <h3 className="quickModalItemTitle">{note.title}</h3>
              <p className="quickModalItemMeta">{note.body}</p>
              <div className="notifyTime quickModalItemTime">{note.time}</div>
            </article>
          ))}
        </div>
      </QuickLinksModal>
    </div>
  );
}

function Section({ title, children, compact }) {
  return (
    <section className={compact ? "section section--compact" : "section"}>
      {title ? <div className="sectionTitle">{title}</div> : null}
      {children}
    </section>
  );
}

function Gauge({ value }) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = 58;
  const total = Math.PI * radius;
  const segRed = total * 0.4;
  const segOrange = total * 0.4;
  const segGreen = total * 0.2;
  const theta = Math.PI * (1 - clamped / 100);
  const cx = 66;
  const cy = 66;
  const needleLength = 42;
  const x2 = cx + needleLength * Math.cos(theta);
  const y2 = cy - needleLength * Math.sin(theta);
  const zoneColor = clamped < 40 ? "#ef4444" : clamped < 80 ? "#f59e0b" : "#10b981";

  return (
    <div className="gauge" aria-label={`Success score ${clamped}`}>
      <svg className="gaugeSvg" viewBox="0 0 132 74" role="img" aria-hidden="true">
        <path d="M 8 66 A 58 58 0 0 1 124 66" className="gaugeTrack" />
        <path d="M 8 66 A 58 58 0 0 1 124 66" className="gaugeSeg gaugeSeg--red" style={{ strokeDasharray: `${segRed} ${total}` }} />
        <path
          d="M 8 66 A 58 58 0 0 1 124 66"
          className="gaugeSeg gaugeSeg--orange"
          style={{ strokeDasharray: `${segOrange} ${total}`, strokeDashoffset: -segRed }}
        />
        <path
          d="M 8 66 A 58 58 0 0 1 124 66"
          className="gaugeSeg gaugeSeg--green"
          style={{ strokeDasharray: `${segGreen} ${total}`, strokeDashoffset: -(segRed + segOrange) }}
        />
        <line x1={cx} y1={cy} x2={x2} y2={y2} className="gaugeNeedleLine" style={{ stroke: zoneColor }} />
        <circle cx={cx} cy={cy} r="4.5" className="gaugeNeedleDot" style={{ fill: zoneColor }} />
      </svg>
    </div>
  );
}

function MiniGauge({ label, value, sub, tone, detail }) {
  const clamped = Math.max(0, Math.min(100, value));
  const circumference = Math.PI * 58;
  const dashOffset = circumference * (1 - clamped / 100);
  const color = tone === "bad" ? "#ef4444" : "#10b981";

  return (
    <div className="miniGaugeCard" tabIndex={0}>
      <svg className="miniGaugeSvg" viewBox="0 0 140 86" role="img" aria-label={`${label}: ${clamped}`}>
        <path d="M 14 70 A 56 56 0 0 1 126 70" className="miniTrack" />
        <path
          d="M 14 70 A 56 56 0 0 1 126 70"
          className="miniProgress"
          stroke={color}
          style={{ strokeDasharray: circumference, strokeDashoffset: dashOffset }}
        />
      </svg>
      <div className="miniValue">{clamped}</div>
      <div className="miniLabel">{label}</div>
      <div className="miniSub">{sub}</div>
      <div className="miniTooltip">
        <div className="miniTooltipHeader">
          <div className="miniTooltipTitle">{detail?.title || `${label} Details`}</div>
          <div className={`miniTooltipTone miniTooltipTone--${tone || "good"}`}>
            {tone === "good" ? "Good" : tone === "warn" ? "Moderate" : "Needs Attention"}
          </div>
        </div>
        <div className="miniTooltipScore">{detail?.summary || `${clamped}/100`}</div>
        <p className="miniTooltipLine miniTooltipLine--strong">{detail?.formula || `Converted to ${clamped}/100`}</p>
        <p className="miniTooltipLine">{detail?.breakdown || "Raw value converted for consistent comparison."}</p>
        <p className="miniTooltipLine">{detail?.scale || "All indicators are shown on a 100-point dashboard scale."}</p>
        <p className="miniTooltipNote">{detail?.note || "Score shown in a 100-point format."}</p>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, tone }) {
  return (
    <div className="progRow">
      <div className="progTop">
        <div className="progLabel">{label}</div>
        <div className="progValue">{value.toFixed(1)}%</div>
      </div>
      <div className="progTrack">
        <div className={`progFill progFill--${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="modalCard" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modalHeader">
          <div className="modalTitle">{title}</div>
          <button type="button" className="iconBtn" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}

function QuickLinksModal({ open, onClose, title, icon, iconClass, children }) {
  if (!open) return null;

  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="quickModalCard" onMouseDown={(event) => event.stopPropagation()}>
        <div className="quickModalHeader">
          <div className={iconClass}>{icon}</div>
          <div className="quickModalTitle">{title}</div>
          <button type="button" className="quickModalClose" aria-label="Close" onClick={onClose}>
            x
          </button>
        </div>
        <div className="quickModalDivider" />
        {children}
        <div className="quickModalFooter">
          <button type="button" className="quickModalFooterBtn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}










