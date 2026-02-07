import "../styles/dashboard.css";

const metrics = {
  avgGrade: 78,           // average course grade (0–100)
  attendance: 68,         // attendance percentage (0–100)
  missingAssignments: 2   // number of missing assignments
};

function calcRiskScore({ avgGrade, attendance, missingAssignments }) {
  let score = 0;

  // Grades: below 85 increases risk
  score += Math.max(0, 85 - avgGrade) * 0.7;

  // Attendance: below 80 increases risk
  score += Math.max(0, 80 - attendance) * 0.8;

  // Missing assignments: each one adds risk
  score += missingAssignments * 10;

  // Clamp score between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
}


function riskFromScore(score) {
  if (score >= 70) {
    return { label: "High Risk", cls: "highRisk", angle: 0 };
  }
  if (score >= 35) {
    return { label: "Medium Risk", cls: "mediumRisk", angle: -90 };
  }
  return { label: "On Track", cls: "lowRisk", angle: -180 };
}

const score = calcRiskScore(metrics);
const risk = riskFromScore(score);

const student = {
  name: "Yasmeen",
  term: "Spring 2026"
};




function StudentDashboard() {
  return (
    <div className="dashboard">
      {/* Top Header */}
      {/* Title Banner */}
      <div className="topbar">
        AI for Student Success
      </div>

      <div className="subHeaderCard">
          <div className="subHi">Hi, {student.name} </div>
          <div className="subTerm">TERM: {student.term}</div>
      </div>

      <div>
      <button
        className="btnGhost"
        onClick={() => window.location.href = "/advisor"}
      >
        Switch to Advisor
      </button>
      </div>


      {/* Main layout */}
<div className="layout">
  {/* LEFT (main) */}
  <div className="stack">
    {/* Current Success Indicator */}
    <div className="card">
        <p className="cardTitle">Current Success Indicator</p>

        <div className="gaugeWrap">
          {/* Left side: text + progress */}
          <div>
            <span className={`riskBadge ${risk.cls}`}>{risk.label}</span>

            <div className="progressWrap">
              <div className="progressLabel">
                <span>Progress</span>
                <span>{100-score}%</span>
              </div>
              <div className="progressBar">
                <div className="progressFill" style={{width: `${100-score}%`}}></div>
              </div>
            </div>
          </div>

          {/* Right side: Gauge */}
          {/* Right side: placeholder (we'll add gauge later) */}
            <div className="riskBox">
              <div className="riskBoxLabel">Risk score</div>
              <div className="riskBoxValue">{score}/100</div>
              <div className="riskBoxHint">Gauge coming next</div>
            </div>

        </div>

    </div>

    {/* Academic Performance (LEFT) */}
    <div className="card">
      <p className="cardTitle">Academic Performance</p>

        <button
        className="courseBtn"
        onClick={() => alert("Open CS250 details page later")}
      >
        <div className="courseLeft">
          <div className="courseCode">CS250</div>
          <div className="courseName">Introduction to Programming</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="pill pillMed">Medium</span>
          <span className="chevBtn">›</span>
        </div>
      </button>

      <button
        className="courseBtn"
        onClick={() => alert("Open MATH201 details page later")}
      >
        <div className="courseLeft">
          <div className="courseCode">MATH201</div>
          <div className="courseName">Calculus I</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="pill pillLow">On Track</span>
          <span className="chevBtn">›</span>
        </div>
      </button>


      <button
        className="courseBtn"
        onClick={() => alert("Open HIS110 details page later")}
      >
        <div className="courseLeft">
          <div className="courseCode">HIS110</div>
          <div className="courseName">History Of Civilization</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="pill pillLow">On Track</span>
          <span className="chevBtn">›</span>
        </div>
      </button>
    </div>



    {/* Engagement & ECA (LEFT) */}
    <div className="card">
      <p className="cardTitle">Engagement & ECA</p>

      <div className="progressWrap">
        <div className="progressLabel">
          <span>GPA trend</span>
          <span>84%</span>
        </div>
        <div className="progressBar">
          <div className="progressFill" style={{ width: "84%" }}></div>
        </div>
      </div>

      <div className="progressWrap">
        <div className="progressLabel">
          <span>Attendance</span>
          <span>68%</span>
        </div>
        <div className="progressBar">
          <div className="progressFill" style={{ width: "68%" }}></div>
        </div>
      </div>

      <div className="progressWrap">
        <div className="progressLabel">
          <span>Weekly ECA hours</span>
          <span>7%</span>
        </div>
        <div className="progressBar">
          <div className="progressFill" style={{ width: "7%" }}></div>
        </div>
      </div>
    </div>


  </div>

  {/* RIGHT (side) */}
  <div className="stack">

      {/* Student Profile Card */}
      <div className="card profileCard">
        <img
          className="profileImg"
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=60"
          alt="Student"
        />
        <div className="profilePad">
          <div className="profileName">Yasmeen</div>
          <div className="profileMeta">Spring 2026 • Student</div>
        </div>
      </div>


    {/* Engagement & ECA (RIGHT- charts&bars) */}
    <div className="card">
      <p className="cardTitle">Engagement & ECA</p>

      <div className="statsRow">
        <div className="statBox">
          <div className="statTop">
            <div className="statNum">80%</div>
          </div>
          <div className="statLabel">Club events (participation)</div>
        </div>

        <div className="statBox">
          <div className="statTop">
            <div className="statNum">4</div>
          </div>
          <div className="statLabel">Club events (past/attended)</div>
        </div>

        <div className="statBox">
          <div className="statTop">
            <div className="statNum">3</div>
          </div>
          <div className="statLabel">Weekly ECA hours</div>
        </div>
      </div>
    </div>

    {/* Why Am I at Risk (RIGHT) */}
    <div className="card">
      <p className="cardTitle">Why Am I at Risk?</p>
      <ul style={{ margin: 0, paddingLeft: 18, color: "#6b7280" }}>
        <li>2 missing assignments</li>
        <li>Low LMS activity in past 2 weeks</li>
        <li>High extracurricular load</li>
      </ul>
    </div>

    {/* Personalized Action Plan (RIGHT) */}
    <div className="card">
      <p className="cardTitle">Personalized Action Plan</p>

      <div className="checkItem">
        <input type="checkbox" />
        <div className="checkText">
          <div className="checkTitle">Complete missing assignments</div>
          <div className="checkSub">Finish the 2 overdue tasks this week</div>
        </div>
      </div>

      <div className="checkItem">
        <input type="checkbox" />
        <div className="checkText">
          <div className="checkTitle">Study 3+ hours</div>
          <div className="checkSub">Schedule two study sessions</div>
        </div>
      </div>

      <div className="checkItem">
        <input type="checkbox" />
        <div className="checkText">
          <div className="checkTitle">Reduce ECA load</div>
          <div className="checkSub">Cut 1–2 hours of activities</div>
        </div>
      </div>
    </div>

    {/* Advisor & Support (RIGHT) */}
    <div className="card">
      <p className="cardTitle">Advisor & Support</p>

      <div className="advisorRow">
        <div className="avatar"></div>
        <div className="advisorInfo">
          <div className="advisorName">Kritika Regmi</div>
          <div className="advisorContact">Academic Advisor</div>
          <div className="advisorContact">(310)910-6026</div>
        </div>
      </div>

      <div className="actionButtons">
        <button className="btnPrimary">Schedule Appointment</button>
      </div>
    </div>


  </div>
</div>


  </div>
  );
}

export default StudentDashboard;
