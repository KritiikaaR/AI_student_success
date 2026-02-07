import "../styles/dashboard.css";

const advisor = {
  name: "Kritika",
  term: "Spring 2026",
  role: "Academic Advisor"
};

const students = [
  { id: "S1023", name: "Yasmeen", risk: "Medium Risk", riskCls: "mediumRisk", score: 35, lastActive: "2 days ago" },
  { id: "S2041", name: "Aarav", risk: "High Risk", riskCls: "highRisk", score: 78, lastActive: "6 days ago" },
  { id: "S3302", name: "Mina", risk: "On Track", riskCls: "lowRisk", score: 12, lastActive: "Today" }
];

const appts = [
  { time: "10:00 AM", student: "Yasmeen", status: "Upcoming" },
  { time: "1:30 PM", student: "Aarav", status: "Upcoming" },
  { time: "4:15 PM", student: "Mina", status: "Completed" }
];


export default function AdvisorDashboard() {
  return (
    <div className="dashboard">
      <div className="topbar">Advisor Portal</div>

      <div className="subHeaderCard advisorHeader">
        <div>
          <div className="subHi">Hi, {advisor.name} 👋</div>
          <div className="subTerm">{advisor.role} • TERM: {advisor.term}</div>
        </div>

        <div>
        <button
          className="btnGhost"
          onClick={() => window.location.href = "/student"}
        >
          Switch to Student
        </button>
      </div>


        <input
          className="searchInput"
          placeholder="Search student (name or ID)…"
        />
      </div>

      <div className="layout">
        {/* LEFT */}
        <div className="stack">
          <div className="card">
            <p className="cardTitle">At-Risk Students</p>

            <div className="list">
              {students.map((s) => (
                <button
                  key={s.id}
                  className="rowBtn"
                  onClick={() => alert(`Open ${s.name}'s profile later`)}
                >
                  <div className="rowLeft">
                    <div className="rowName">{s.name}</div>
                    <div className="rowMeta">{s.id} • Last active: {s.lastActive}</div>
                  </div>

                  <div className="rowRight">
                    <span className={`riskBadge ${s.riskCls}`}>{s.risk}</span>
                    <span className="rowScore">{s.score}</span>
                    <span className="chevBtn">›</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <p className="cardTitle">Today’s Appointments</p>

            <div className="list">
              {appts.map((a, i) => (
                <div className="apptRow" key={i}>
                  <div>
                    <div className="apptTime">{a.time}</div>
                    <div className="apptMeta">{a.student}</div>
                  </div>
                  <span className="apptStatus">{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="stack">
          <div className="card">
            <p className="cardTitle">Selected Student Snapshot</p>

            <div className="snapTop">
              <div className="avatarLg" />
              <div>
                <div className="snapName">Yasmeen</div>
                <div className="snapMeta">Student • Spring 2026</div>
              </div>
              <span className="riskBadge mediumRisk">Medium Risk</span>
            </div>

            <div className="statsRow" style={{ marginTop: 12 }}>
              <div className="statBox">
                <div className="statNum">68%</div>
                <div className="statLabel">Attendance</div>
              </div>
              <div className="statBox">
                <div className="statNum">2</div>
                <div className="statLabel">Missing</div>
              </div>
              <div className="statBox">
                <div className="statNum">78</div>
                <div className="statLabel">Avg Grade</div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <button className="btnPrimary" onClick={() => alert("Route to Student Dashboard later")}>
                Open Student Dashboard
              </button>
            </div>
          </div>

          <div className="card">
            <p className="cardTitle">Quick Actions</p>

            <div className="actionGrid">
              <button className="btnGhost" onClick={() => alert("Message later")}>Send Message</button>
              <button className="btnGhost" onClick={() => alert("Schedule later")}>Schedule Meeting</button>
              <button className="btnGhost" onClick={() => alert("Plan later")}>Create Action Plan</button>
              <button className="btnGhost" onClick={() => alert("Notes later")}>Add Notes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
