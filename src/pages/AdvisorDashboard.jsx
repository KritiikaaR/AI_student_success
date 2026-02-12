import "../styles/dashboard.css";
import { useState } from "react";


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
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="dashboard">
      <div className="topbar">Advisor Portal</div>

      <div className="subHeaderCard advisorHeader">
        <div>
          <div className="subHi">Hi, {advisor.name} 👋</div>
          <div className="subTerm">{advisor.role} • TERM: {advisor.term}</div>
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
                    className={`rowBtn ${selectedStudent?.id === s.id ? "rowSelected" : ""}`}
                    onClick={() => setSelectedStudent(s)}
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
              {!selectedStudent ? (
            <div className="emptyState">
              <div className="emptyTitle">No student selected</div>
              <div className="emptySub">Click a student from the At-Risk list to view details.</div>
            </div>
          ) : (
            <>
              <div className="snapTop">
                <div className="avatarLg" />
                <div>
                  <div className="snapName">{selectedStudent.name}</div>
                  <div className="snapMeta">
                    {selectedStudent.id} • Last active: {selectedStudent.lastActive}
                  </div>
                </div>
                <span className={`riskBadge ${selectedStudent.riskCls}`}>
                  {selectedStudent.risk}
                </span>
              </div>

              <div className="statsRow" style={{ marginTop: 12 }}>
                <div className="statBox">
                  <div className="statNum">{selectedStudent.score}</div>
                  <div className="statLabel">Risk Score</div>
                </div>
                <div className="statBox">
                  <div className="statNum">68%</div>
                  <div className="statLabel">Attendance</div>
                </div>
                <div className="statBox">
                  <div className="statNum">2</div>
                  <div className="statLabel">Missing</div>
                </div>
              </div>

              <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                <button className="btnPrimary" onClick={() => alert("Route to Student Dashboard later")}>
                  Open Student Dashboard
                </button>

                <button className="btnGhost" onClick={() => setSelectedStudent(null)}>
                  Clear
                </button>
              </div>
            </>
          )}


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
