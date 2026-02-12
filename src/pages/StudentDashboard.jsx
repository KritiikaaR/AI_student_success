import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  ChevronRight,
  Clock3,
  Check,
  ExternalLink,
  FileText,
  Medal,
  MessageCircle,
  MessageSquare,
  Moon,
  Phone,
  TrendingUp,
  Users,
} from "lucide-react";

import profileImg from "../assets/kriti.jpg.jpeg";
import StudentBottomNav from "../components/StudentBottomNav";
import { useTheme } from "../context/ThemeContext";
import "../styles/dashboard.css";

const QUICK_ACCESS = [
  { label: "Course Materials", icon: BookOpen },
  { label: "Class Schedule", icon: CalendarDays },
  { label: "Assignments", icon: FileText },
  { label: "Grades", icon: Medal },
  { label: "Study Groups", icon: Users },
  { label: "Notifications", icon: Bell },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [photoOpen, setPhotoOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [apptOpen, setApptOpen] = useState(false);
  const [studyGroupsOpen, setStudyGroupsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");

  const student = useMemo(
    () => ({
      name: "Student Name",
      term: "Fall 2024",
      role: "Undergraduate Student",
      gpa: { score: 80, value: "3.2 / 4.0", tone: "good" },
      attendance: { score: 92, value: "92%", tone: "good" },
      eca: { score: 30, value: "3 hours", tone: "bad" },
      successScore: 77,
      riskLabel: "Medium Risk",
    }),
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

  const closeMessageModal = () => {
    setMessageOpen(false);
    setMessageSubject("");
    setMessageBody("");
  };

  const handleSendMessage = () => {
    if (!messageSubject.trim() || !messageBody.trim()) return;
    closeMessageModal();
  };

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
              <MiniGauge label="GPA" value={student.gpa.score} sub={student.gpa.value} tone={student.gpa.tone} />
              <MiniGauge
                label="Attendance"
                value={student.attendance.score}
                sub={student.attendance.value}
                tone={student.attendance.tone}
              />
              <MiniGauge label="Weekly ECA Hours" value={student.eca.score} sub={student.eca.value} tone={student.eca.tone} />
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

      <Modal open={apptOpen} onClose={() => setApptOpen(false)} title="Schedule Appointment">
        <div className="modalText">Scheduler placeholder.</div>
        <div className="modalActions">
          <button type="button" className="btn btn--ghost" onClick={() => setApptOpen(false)}>
            Close
          </button>
          <button type="button" className="btn btn--primary" onClick={() => setApptOpen(false)}>
            Confirm
          </button>
        </div>
      </Modal>

      <QuickLinksModal
        open={studyGroupsOpen}
        onClose={() => setStudyGroupsOpen(false)}
        title="Study Groups"
        icon={<Users size={28} />}
        iconClass="quickModalHeadIcon quickModalHeadIcon--purple"
      >
        <div className="quickModalScroll">
          {studyGroups.map((group) => (
            <article key={group.title} className="studyCard">
              <h3>{group.title}</h3>
              <p className="studyMeta">{group.meta}</p>
              <p className="studyLine">
                <Clock3 size={22} />
                <span>{group.time}</span>
              </p>
              <p className="studyLine">
                <ExternalLink size={22} />
                <span>{group.room}</span>
              </p>
              <button type="button" className="studyChatBtn">
                <MessageCircle size={22} />
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
        icon={<Bell size={28} />}
        iconClass="quickModalHeadIcon quickModalHeadIcon--red"
      >
        <div className="quickModalScroll">
          {notifications.map((note) => (
            <article key={note.title} className="notifyCard">
              <div className="notifyDot" />
              <h3>{note.title}</h3>
              <p>{note.body}</p>
              <div className="notifyTime">{note.time}</div>
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

function MiniGauge({ label, value, sub, tone }) {
  const clamped = Math.max(0, Math.min(100, value));
  const circumference = Math.PI * 58;
  const dashOffset = circumference * (1 - clamped / 100);
  const color = tone === "bad" ? "#ef4444" : "#10b981";

  return (
    <div className="miniGaugeCard">
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




