import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Check, Moon, Sun, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getStoredRequests, subscribeToStoredRequests, updateStoredRequestStatus } from "../utils/requestStore";
import "../styles/appointments.css";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function AdvisorAppointments() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState(() => getStoredRequests());

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsubscribe = subscribeToStoredRequests((nextRequests) => {
      setRequests(nextRequests);
    });
    return unsubscribe;
  }, []);

  const appointmentRequests = useMemo(
    () =>
      requests
        .filter((item) => item.type === "appointment")
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
    [requests]
  );

  const counts = useMemo(
    () => ({
      all: appointmentRequests.length,
      pending: appointmentRequests.filter((item) => item.status === "pending").length,
      approved: appointmentRequests.filter((item) => item.status === "approved").length,
      rejected: appointmentRequests.filter((item) => item.status === "rejected").length,
    }),
    [appointmentRequests]
  );

  const visibleRequests = useMemo(() => {
    if (activeTab === "all") return appointmentRequests;
    return appointmentRequests.filter((item) => item.status === activeTab);
  }, [activeTab, appointmentRequests]);

  const applyDecision = (requestId, status) => {
    updateStoredRequestStatus(requestId, status);
    setRequests(getStoredRequests());
  };

  return (
    <div className={dark ? "advisorAppointmentsPage advisorAppointmentsPage--dark" : "advisorAppointmentsPage"}>
      <header className="advisorAppointmentsHeader">
        <div>
          <h1>Appointment Requests</h1>
          <p>Confirm or reject student appointment requests</p>
        </div>
        <div className="advisorAppointmentsHeaderActions">
          <button type="button" className="appointmentsBackBtn" onClick={() => navigate("/advisor/dashboard")}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          <button type="button" className="appointmentsThemeBtn" aria-label="Toggle theme" title="Toggle theme" onClick={toggleTheme}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <section className="appointmentsStats">
        <article className="appointmentsStatCard">
          <div className="appointmentsStatLabel">All Requests</div>
          <div className="appointmentsStatValue">{counts.all}</div>
        </article>
        <article className="appointmentsStatCard">
          <div className="appointmentsStatLabel">Pending</div>
          <div className="appointmentsStatValue">{counts.pending}</div>
        </article>
        <article className="appointmentsStatCard">
          <div className="appointmentsStatLabel">Approved</div>
          <div className="appointmentsStatValue">{counts.approved}</div>
        </article>
        <article className="appointmentsStatCard">
          <div className="appointmentsStatLabel">Rejected</div>
          <div className="appointmentsStatValue">{counts.rejected}</div>
        </article>
      </section>

      <section className="appointmentsMainCard">
        <div className="appointmentsTabs" role="tablist" aria-label="Appointment request filters">
          <button type="button" className={activeTab === "all" ? "appointmentsTab appointmentsTab--active" : "appointmentsTab"} onClick={() => setActiveTab("all")}>
            All ({counts.all})
          </button>
          <button
            type="button"
            className={activeTab === "pending" ? "appointmentsTab appointmentsTab--active" : "appointmentsTab"}
            onClick={() => setActiveTab("pending")}
          >
            Pending ({counts.pending})
          </button>
          <button
            type="button"
            className={activeTab === "approved" ? "appointmentsTab appointmentsTab--active" : "appointmentsTab"}
            onClick={() => setActiveTab("approved")}
          >
            Approved ({counts.approved})
          </button>
          <button
            type="button"
            className={activeTab === "rejected" ? "appointmentsTab appointmentsTab--active" : "appointmentsTab"}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected ({counts.rejected})
          </button>
        </div>

        <div className="appointmentsDivider" />

        {visibleRequests.length === 0 ? (
          <div className="appointmentsEmpty">
            <CalendarDays size={34} />
            <span>No appointment requests in this category.</span>
          </div>
        ) : (
          <div className="appointmentsList">
            {visibleRequests.map((request) => (
              <article key={request.id} className="appointmentCard">
                <div className="appointmentCardHead">
                  <h2>{request.title || "Appointment Request"}</h2>
                  <span className={`appointmentStatus appointmentStatus--${request.status}`}>{request.status}</span>
                </div>

                <div className="appointmentCardMeta">
                  <span>Student: {request.appointment?.studentName || "Student"}</span>
                  <span>Date: {formatDate(request.appointment?.date)}</span>
                  <span>Time: {request.appointment?.time || "Time pending"}</span>
                  <span>Submitted: {formatDate(request.submittedAt)}</span>
                </div>

                <p className="appointmentCardReason">{request.appointment?.reason || "No reason provided."}</p>

                {request.status === "pending" ? (
                  <div className="appointmentCardActions">
                    <button type="button" className="appointmentActionBtn appointmentActionBtn--approve" onClick={() => applyDecision(request.id, "approved")}>
                      <Check size={14} />
                      <span>Confirm</span>
                    </button>
                    <button type="button" className="appointmentActionBtn appointmentActionBtn--reject" onClick={() => applyDecision(request.id, "rejected")}>
                      <X size={14} />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
