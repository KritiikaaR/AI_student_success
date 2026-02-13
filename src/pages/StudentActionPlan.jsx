import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CalendarDays, Check, CheckCircle2, Circle, Moon } from "lucide-react";
import StudentBottomNav from "../components/StudentBottomNav";
import { useTheme } from "../context/ThemeContext";
import "../styles/actionplan.css";

const initialTasks = [
  {
    id: 1,
    baseStatus: "alert",
    completed: false,
    title: "Complete PHYS151 Lab Report",
    description: "Submit the lab report for Experiment 3 on Newton's Laws",
    dueDate: "Due: Feb 15, 2026",
    tag: "Academic",
    priority: "high",
    priorityLabel: "High Priority",
  },
  {
    id: 2,
    baseStatus: "pending",
    completed: false,
    title: "Attend Office Hours - MATH201",
    description: "Meet with Prof. Williams to discuss Calculus integration techniques",
    dueDate: "Due: Feb 12, 2026",
    tag: "Support",
    priority: "medium",
    priorityLabel: "Medium Priority",
  },
  {
    id: 3,
    baseStatus: "pending",
    completed: false,
    title: "Schedule Advisor Meeting",
    description: "Discuss course selection for Fall 2026 semester",
    dueDate: "Due: Feb 20, 2026",
    tag: "Planning",
    priority: "medium",
    priorityLabel: "Medium Priority",
  },
  {
    id: 4,
    baseStatus: "done",
    completed: true,
    title: "Join Computer Science Study Group",
    description: "Participate in weekly CS250 study sessions",
    dueDate: "Due: Feb 14, 2026",
    tag: "Social",
    priority: "low",
    priorityLabel: "Low Priority",
  },
  {
    id: 5,
    baseStatus: "alert",
    completed: false,
    title: "Review PHYS151 Chapters 4-6",
    description: "Prepare for upcoming midterm exam",
    dueDate: "Due: Feb 18, 2026",
    tag: "Academic",
    priority: "high",
    priorityLabel: "High Priority",
  },
];

function StatusIcon({ status }) {
  if (status === "alert") return <AlertCircle size={16} className="taskStatusIcon taskStatusIcon--alert" />;
  if (status === "done") return <CheckCircle2 size={16} className="taskStatusIcon taskStatusIcon--done" />;
  return <Circle size={16} className="taskStatusIcon taskStatusIcon--pending" />;
}

export default function StudentActionPlan() {
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(initialTasks);

  const handleToggleTask = (taskId) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  return (
    <div className={dark ? "apPage apPage--dark" : "apPage"}>
      <header className="apHeader">
        <div>
          <h1>Personalized Action Plan</h1>
          <p>Your customized roadmap to academic success</p>
        </div>

        <div className="apHeaderActions">
          <button type="button" className="apBackBtn" onClick={() => navigate("/")}>
            Back to Dashboard
          </button>
          <button type="button" className="apThemeBtn" aria-label="Toggle theme" title="Toggle theme" onClick={toggleTheme}>
            <Moon size={18} />
          </button>
        </div>
      </header>

      <section className="apList">
        {tasks.map((task) => {
          const visualStatus = task.completed ? "done" : task.baseStatus;

          return (
            <article key={task.id} className="apTask">
              <div className="taskMain">
                <label className="taskCheckWrap">
                  <input
                    type="checkbox"
                    className="taskCheck"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    aria-label={`Mark ${task.title} completed`}
                  />
                  <span className="taskCheckUi">
                    {task.completed ? <Check size={12} /> : <StatusIcon status={visualStatus} />}
                  </span>
                </label>

                <div className="taskBody">
                  <h3 className={task.completed ? "taskTitle taskTitle--done" : "taskTitle"}>{task.title}</h3>
                  <p className="taskDescription">{task.description}</p>

                  <div className="taskMeta">
                    <span className="taskDue">
                      <CalendarDays size={12} />
                      {task.dueDate}
                    </span>
                    <span className="taskTag">{task.tag}</span>
                  </div>
                </div>
              </div>

              <span className={`priorityPill priorityPill--${task.priority}`}>{task.priorityLabel}</span>
            </article>
          );
        })}
      </section>

      <StudentBottomNav />
    </div>
  );
}
