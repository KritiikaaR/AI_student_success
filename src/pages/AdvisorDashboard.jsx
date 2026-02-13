import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, CalendarDays, Download, Funnel, MailOpen, Moon, Search, Sun, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "../context/ThemeContext";
import { getStoredRequests, subscribeToStoredRequests } from "../utils/requestStore";
import "../styles/advisor.css";
import profileImg from "../assets/kriti.jpg.jpeg";

const ADVISOR_METRICS = {
  totalStudents: 24,
  atRisk: 5,
  avgGpa: 3.1,
};

const STUDENTS_PLACEHOLDER = [
  { id: "s1", name: "Abdullah Khan", sub: "CSC101", email: "student1@university.edu", enrollment: "CSC101", risk: "High Risk", riskKey: "high", updated: "Apr 22, 2026" },
  { id: "s2", name: "Andre Wilson", sub: "CSC101", email: "student4@university.edu", enrollment: "CSC101", risk: "High Risk", riskKey: "high", updated: "Apr 22, 2026" },
  {
    id: "s3",
    name: "Carla Ramirez",
    sub: "HIS110",
    email: "student3@university.edu",
    enrollment: "CSC101",
    risk: "Needs Attention",
    riskKey: "attention",
    updated: "Apr 22, 2026",
  },
  { id: "s4", name: "Jenna Lee", sub: "MAT201", email: "student2@university.edu", enrollment: "CSC101", risk: "High Risk", riskKey: "high", updated: "Apr 22, 2026" },
  { id: "s5", name: "Student Name 5", sub: "Biology", email: "student5@university.edu", enrollment: "BIO201", risk: "On Track", riskKey: "track", updated: "Apr 20, 2026" },
  {
    id: "s6",
    name: "Student Name 6",
    sub: "Mathematics",
    email: "student6@university.edu",
    enrollment: "MAT201",
    risk: "Needs Attention",
    riskKey: "attention",
    updated: "Apr 21, 2026",
  },
];

const RISK_OVERVIEW = [
  { key: "high", name: "High Risk", value: 5, color: "#ef4444" },
  { key: "medium", name: "Medium Risk", value: 8, color: "#f59e0b" },
  { key: "low", name: "Low Risk", value: 11, color: "#10b981" },
];

const ADVISING_TREND = [
  { period: "W1", meetings: 10, resolved: 6 },
  { period: "W2", meetings: 12, resolved: 8 },
  { period: "W3", meetings: 9, resolved: 6 },
  { period: "W4", meetings: 14, resolved: 10 },
  { period: "W5", meetings: 15, resolved: 11 },
  { period: "W6", meetings: 13, resolved: 10 },
  { period: "W7", meetings: 16, resolved: 12 },
  { period: "W8", meetings: 17, resolved: 13 },
];

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function AdvisorDashboard() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [photoOpen, setPhotoOpen] = useState(false);
  const [selectedRiskKey, setSelectedRiskKey] = useState("high");
  const [requests, setRequests] = useState(() => getStoredRequests());

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsubscribe = subscribeToStoredRequests((nextRequests) => {
      setRequests(nextRequests);
    });
    return unsubscribe;
  }, []);

  const filteredStudents = useMemo(() => {
    const byFilter = STUDENTS_PLACEHOLDER.filter((student) => {
      if (filter === "all") return true;
      if (filter === "high") return student.riskKey === "high";
      if (filter === "attention") return student.riskKey === "attention";
      return student.riskKey === "track";
    });

    const q = search.trim().toLowerCase();
    if (!q) return byFilter;

    return byFilter.filter((student) => {
      const haystack = `${student.name} ${student.email} ${student.enrollment} ${student.sub}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [filter, search]);

  const pendingAppointments = useMemo(() => requests.filter((item) => item.type === "appointment" && item.status === "pending"), [requests]);

  const metrics = useMemo(
    () => ({
      ...ADVISOR_METRICS,
      appointments: pendingAppointments.length,
    }),
    [pendingAppointments.length]
  );

  const riskTotal = useMemo(() => RISK_OVERVIEW.reduce((sum, item) => sum + item.value, 0), []);
  const riskBreakdown = useMemo(
    () =>
      RISK_OVERVIEW.map((item) => ({
        ...item,
        percent: riskTotal > 0 ? Math.round((item.value / riskTotal) * 100) : 0,
      })),
    [riskTotal]
  );
  const selectedRisk = useMemo(
    () => riskBreakdown.find((item) => item.key === selectedRiskKey) || riskBreakdown[0] || null,
    [riskBreakdown, selectedRiskKey]
  );

  const engagementStats = useMemo(() => {
    const totals = ADVISING_TREND.reduce(
      (acc, item) => {
        acc.meetings += item.meetings;
        acc.resolved += item.resolved;
        return acc;
      },
      { meetings: 0, resolved: 0 }
    );
    const resolutionRate = totals.meetings > 0 ? Math.round((totals.resolved / totals.meetings) * 100) : 0;
    return { ...totals, resolutionRate };
  }, []);

  return (
    <div className={dark ? "advisorPage advisorPage--dark" : "advisorPage"}>
      <header className="advisorHeader">
        <div>
          <h1>
            Welcome back, <span>Dr. Advisor Name</span>
          </h1>
          <p>Advisor Dashboard</p>
        </div>

        <div className="advisorHeaderActions">
          <button type="button" className="advisorAvatarBtn" title="View advisor photo" onClick={() => setPhotoOpen(true)}>
            <img className="advisorAvatar" src={profileImg} alt="Advisor profile" />
          </button>

          <button type="button" className="advisorThemeBtn" aria-label="Toggle theme" title="Toggle theme" onClick={toggleTheme}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <div className="advisorDivider" />

      <section className="advisorMetrics" aria-label="Advisor overview">
        <article className="metricCard">
          <Users size={18} className="metricIcon metricIcon--blue" />
          <div className="metricLabel">Total Students</div>
          <div className="metricValue">{metrics.totalStudents}</div>
        </article>

        <article className="metricCard">
          <AlertTriangle size={18} className="metricIcon metricIcon--red" />
          <div className="metricLabel">At Risk</div>
          <div className="metricValue">{metrics.atRisk}</div>
        </article>

        <article className="metricCard">
          <CalendarDays size={18} className="metricIcon metricIcon--green" />
          <div className="metricLabel">Appointments</div>
          <div className="metricValue">{metrics.appointments}</div>
        </article>

        <article className="metricCard">
          <TrendingUp size={18} className="metricIcon metricIcon--purple" />
          <div className="metricLabel">AVG GPA</div>
          <div className="metricValue">{metrics.avgGpa}</div>
        </article>
      </section>

      <div className="advisorDivider" />

      <section className="advisorPanel">
        <div className="advisorControls">
          <button type="button" className="filterBtn">
            <Funnel size={15} />
            <span>Filters</span>
          </button>

          <select className="filterSelect" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All Students</option>
            <option value="high">High Risk</option>
            <option value="attention">Needs Attention</option>
            <option value="track">On Track</option>
          </select>

          <div className="searchWrap">
            <Search size={15} className="searchIcon" />
            <input
              type="text"
              className="searchInput"
              placeholder="Search students..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <button type="button" className="exportBtn">
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="advisorTableWrap">
          <table className="advisorTable">
            <thead>
              <tr>
                <th>Students at Risk</th>
                <th>Email</th>
                <th>Enrollment</th>
                <th>Risk</th>
                <th>Last Updated</th>
                <th>Main File</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="studentCell">
                      <div className="studentAvatar">{initials(student.name)}</div>
                      <div>
                        <div className="studentName">{student.name}</div>
                        <div className="studentSub">{student.sub}</div>
                      </div>
                    </div>
                  </td>
                  <td className="cellMuted">{student.email}</td>
                  <td>
                    <span className="enrollmentPill">{student.enrollment}</span>
                  </td>
                  <td>
                    <span className={`riskText riskText--${student.riskKey}`}>{student.risk}</span>
                  </td>
                  <td>
                    <div className="updatedCell">
                      <div>{student.updated}</div>
                      <div>{student.updated}</div>
                    </div>
                  </td>
                  <td>
                    <div className="fileBars" aria-hidden="true">
                      <span />
                      <span />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="advisorDivider" />

      <section className="advisorQuickActions" aria-label="Advisor quick actions">
        <button type="button" className="advisorNavCard" onClick={() => navigate("/advisor/messages")}>
          <div className="advisorNavCardIconWrap">
            <MailOpen size={18} />
          </div>
          <div className="advisorNavCardBody">
            <div className="advisorNavCardTitle">Messages</div>
            <div className="advisorNavCardSub">Open inbox, read student messages, and reply from advisor side.</div>
          </div>
          <ArrowRight size={18} className="advisorNavCardArrow" />
        </button>

        <button type="button" className="advisorNavCard" onClick={() => navigate("/advisor/appointments")}>
          <div className="advisorNavCardIconWrap advisorNavCardIconWrap--green">
            <CalendarDays size={18} />
          </div>
          <div className="advisorNavCardBody">
            <div className="advisorNavCardTitle">Appointment Requests</div>
            <div className="advisorNavCardSub">Review requests and confirm or cancel student appointment requests.</div>
          </div>
          <ArrowRight size={18} className="advisorNavCardArrow" />
        </button>
      </section>

      <div className="advisorDivider" />

      <section className="advisorChartsGrid">
        <article className="advisorChartCard">
          <h3>Student Risk Overview</h3>
          <div className="riskChartWrap">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={RISK_OVERVIEW} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={62} outerRadius={84} animationDuration={800}>
                  {RISK_OVERVIEW.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="riskCenterValueWrap">
              <div className="riskCenterValue" style={{ color: selectedRisk?.color || "#0f172a" }}>
                {selectedRisk ? `${selectedRisk.percent}%` : "0%"}
              </div>
              <div className="riskCenterLabel">{selectedRisk ? `${selectedRisk.name} Share` : "Risk Share"}</div>
            </div>

            <div className="riskLegend riskLegend--cards">
              {riskBreakdown.map((entry) => (
                <button
                  key={entry.name}
                  type="button"
                  className={selectedRiskKey === entry.key ? "riskLegendCard riskLegendCard--active" : "riskLegendCard"}
                  onClick={() => setSelectedRiskKey(entry.key)}
                  style={{ "--risk-accent": entry.color }}
                >
                  <div className="riskLegendCardTop">
                    <span className="riskLegendDot" style={{ background: entry.color }} />
                    <span className="riskLegendTitle">{entry.name}</span>
                  </div>
                  <div className="riskLegendCardStats">
                    <span>{entry.value} students</span>
                    <strong>{entry.percent}%</strong>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </article>

        <article className="advisorChartCard">
          <h3>Advising Engagement Trend</h3>
          <div className="trendStats">
            <div className="trendStatBox">
              <div className="trendStatLabel">Total Meetings</div>
              <div className="trendStatValue">{engagementStats.meetings}</div>
            </div>
            <div className="trendStatBox">
              <div className="trendStatLabel">Resolved Cases</div>
              <div className="trendStatValue">{engagementStats.resolved}</div>
            </div>
            <div className="trendStatBox">
              <div className="trendStatLabel">Resolution Rate</div>
              <div className="trendStatValue">{engagementStats.resolutionRate}%</div>
            </div>
          </div>
          <div className="trendChartWrap">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={ADVISING_TREND} margin={{ top: 8, right: 6, left: -14, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4dce8" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area type="monotone" dataKey="meetings" stroke="#2563eb" fill="#2563eb" fillOpacity={0.18} strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2.2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      {photoOpen ? (
        <div className="advisorPhotoOverlay" onMouseDown={() => setPhotoOpen(false)}>
          <div className="advisorPhotoCard" onMouseDown={(event) => event.stopPropagation()}>
            <div className="advisorPhotoHeader">
              <div className="advisorPhotoTitle">Advisor Photo</div>
              <button type="button" className="advisorPhotoClose" aria-label="Close" onClick={() => setPhotoOpen(false)}>
                x
              </button>
            </div>
            <div className="advisorPhotoWrap">
              <img className="advisorPhotoLarge" src={profileImg} alt="Advisor" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
