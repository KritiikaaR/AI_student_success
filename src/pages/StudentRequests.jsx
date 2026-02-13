import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileText, GraduationCap, Mail, Moon, PauseCircle, Plus, ShieldAlert, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudentBottomNav from "../components/StudentBottomNav";
import { useTheme } from "../context/ThemeContext";
import { createStoredRequest, getStoredRequests, subscribeToStoredRequests } from "../utils/requestStore";
import "../styles/requests.css";

const REQUEST_TYPE_OPTIONS = [
  { key: "transcript", title: "Official Transcript", description: "Request an official academic transcript", icon: FileText },
  { key: "enrollment", title: "Enrollment Verification", description: "Request proof of enrollment letter", icon: CheckCircle2 },
  { key: "course_override", title: "Course Override", description: "Request permission to enroll in a restricted course", icon: GraduationCap },
  { key: "grade_appeal", title: "Grade Appeal", description: "Appeal a course grade decision", icon: ShieldAlert },
  { key: "academic_leave", title: "Academic Leave", description: "Request leave of absence from studies", icon: PauseCircle },
  { key: "recommendation", title: "Letter of Recommendation", description: "Request a letter of recommendation", icon: Mail },
];

function normalizeStatus(value) {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "approved" || normalized === "rejected" || normalized === "pending") return normalized;
  return "pending";
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function StudentRequests() {
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [requests, setRequests] = useState(() => getStoredRequests());

  useEffect(() => {
    let isActive = true;

    const loadRequests = async () => {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const stored = getStoredRequests();

      // Placeholder store for now. Once backend is connected, request history
      // should come from the API and replace this local data flow.
      if (!apiBaseUrl) {
        if (isActive) setRequests(stored);
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/student/requests`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch requests");

        const payload = await response.json();
        const records = Array.isArray(payload?.requests) ? payload.requests : [];
        if (!isActive) return;

        const normalizedApiRecords = records.map((item, index) => ({
            id: item.id ?? `request-${index}`,
            title: item.title ?? item.typeLabel ?? "Request",
            type: item.type ?? "general",
            status: normalizeStatus(item.status),
            submittedAt: item.submittedAt ?? new Date().toISOString(),
          }));

        setRequests(normalizedApiRecords.length ? normalizedApiRecords : stored);
      } catch {
        if (isActive) setRequests(stored);
      }
    };

    loadRequests();
    const unsubscribe = subscribeToStoredRequests((nextRequests) => {
      setRequests(nextRequests);
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!createOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [createOpen]);

  const counts = useMemo(
    () => ({
      all: requests.length,
      pending: requests.filter((item) => item.status === "pending").length,
      approved: requests.filter((item) => item.status === "approved").length,
      rejected: requests.filter((item) => item.status === "rejected").length,
    }),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    if (activeFilter === "all") return requests;
    return requests.filter((item) => item.status === activeFilter);
  }, [activeFilter, requests]);

  const closeCreateModal = () => {
    setCreateOpen(false);
    setSelectedType("");
  };

  const handleSubmitRequest = async () => {
    if (!selectedType) return;
    const selectedOption = REQUEST_TYPE_OPTIONS.find((item) => item.key === selectedType);
    if (!selectedOption) return;

    const optimisticEntry = createStoredRequest({
      type: selectedType,
      title: selectedOption.title,
      status: "pending",
      submittedAt: new Date().toISOString(),
    });

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    if (apiBaseUrl) {
      try {
        await fetch(`${apiBaseUrl}/student/requests`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: selectedType }),
        });
      } catch {
        // Keep local optimistic entry when API is unavailable.
      }
    }

    setRequests((prev) => [optimisticEntry, ...prev.filter((item) => item.id !== optimisticEntry.id)]);
    setActiveFilter("all");
    closeCreateModal();
  };

  const filterTabs = [
    { key: "all", label: `All Requests (${counts.all})` },
    { key: "pending", label: `Pending (${counts.pending})` },
    { key: "approved", label: `Approved (${counts.approved})` },
    { key: "rejected", label: `Rejected (${counts.rejected})` },
  ];

  return (
    <div className={dark ? "requestsPage requestsPage--dark" : "requestsPage"}>
      <header className="requestsHeader">
        <div className="requestsHeadText">
          <h1>My Requests</h1>
          <p>Track and manage your academic requests</p>
        </div>

        <div className="requestsHeadActions">
          <button type="button" className="requestsBackBtn" onClick={() => navigate("/")}>
            Back to Dashboard
          </button>
          <button type="button" className="newRequestBtn" onClick={() => setCreateOpen(true)}>
            <Plus size={18} />
            <span>New Request</span>
          </button>
          <button type="button" className="requestsThemeBtn" aria-label="Toggle theme" title="Toggle theme" onClick={toggleTheme}>
            <Moon size={18} />
          </button>
        </div>
      </header>

      <main className="requestsMain">
        <section className="requestsCard">
          <div className="requestsTabs" role="tablist" aria-label="Request filters">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={activeFilter === tab.key ? "requestsTab requestsTab--active" : "requestsTab"}
                onClick={() => setActiveFilter(tab.key)}
                role="tab"
                aria-selected={activeFilter === tab.key}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="requestsDivider" />

          {filteredRequests.length === 0 ? (
            <div className="requestsEmpty">
              <FileText size={54} className="requestsEmptyIcon" />
              <h2>No requests found</h2>
              <button type="button" className="submitFirstBtn" onClick={() => setCreateOpen(true)}>
                <Plus size={18} />
                <span>Submit Your First Request</span>
              </button>
            </div>
          ) : (
            <div className="requestsList">
              {filteredRequests.map((item) => (
                <article key={item.id} className="requestItem">
                  <div className="requestItemTitle">{item.title}</div>
                  <div className="requestItemMeta">Submitted on {formatDate(item.submittedAt)}</div>
                  <span className={`requestPill requestPill--${item.status}`}>{item.status}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <StudentBottomNav />

      {createOpen ? (
        <div className="requestModalOverlay" onMouseDown={closeCreateModal}>
          <div className="requestModalCard" onMouseDown={(event) => event.stopPropagation()}>
            <div className="requestModalHeader">
              <div>
                <h3>Submit New Request</h3>
                <p>Choose a request type and provide details</p>
              </div>
              <button type="button" className="requestModalClose" aria-label="Close" onClick={closeCreateModal}>
                <X size={22} />
              </button>
            </div>

            <div className="requestTypeTitle">Request Type</div>

            <div className="requestTypeGrid">
              {REQUEST_TYPE_OPTIONS.map((option) => {
                const OptionIcon = option.icon;
                const isActive = selectedType === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    className={isActive ? "requestTypeCard requestTypeCard--active" : "requestTypeCard"}
                    onClick={() => setSelectedType(option.key)}
                  >
                    <span className="requestTypeIconWrap">
                      <OptionIcon size={22} />
                    </span>
                    <span className="requestTypeText">
                      <span className="requestTypeName">{option.title}</span>
                      <span className="requestTypeDesc">{option.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="requestModalActions">
              <button type="button" className="requestBtn requestBtn--cancel" onClick={closeCreateModal}>
                Cancel
              </button>
              <button type="button" className="requestBtn requestBtn--submit" onClick={handleSubmitRequest} disabled={!selectedType}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
