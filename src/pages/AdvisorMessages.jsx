import { useMemo, useState } from "react";
import { ArrowLeft, MailPlus, Moon, Send, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../styles/messages.css";

const STARTER_THREADS = [
  {
    id: "thread-1",
    studentName: "Abdullah Khan",
    studentEmail: "student1@university.edu",
    subject: "Question about Course Registration",
    updatedAt: "2 hours ago",
    unread: true,
    messages: [
      { id: "m1", sender: "student", text: "Hi, I'm having trouble registering for next semester classes.", time: "09:15 AM" },
      { id: "m2", sender: "advisor", text: "Thanks for reaching out. Share your selected courses and I can review.", time: "09:42 AM" },
    ],
  },
  {
    id: "thread-2",
    studentName: "Jenna Lee",
    studentEmail: "student2@university.edu",
    subject: "Need Support in MAT201",
    updatedAt: "5 hours ago",
    unread: false,
    messages: [{ id: "m3", sender: "student", text: "Can we discuss support options for MAT201 this week?", time: "08:10 AM" }],
  },
];

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function AdvisorMessages() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [threads, setThreads] = useState(STARTER_THREADS);
  const [activeThreadId, setActiveThreadId] = useState(STARTER_THREADS[0]?.id || "");
  const [replyText, setReplyText] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeStudent, setComposeStudent] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeMessage, setComposeMessage] = useState("");

  const activeThread = useMemo(() => threads.find((thread) => thread.id === activeThreadId) || null, [threads, activeThreadId]);
  const unreadCount = useMemo(() => threads.filter((thread) => thread.unread).length, [threads]);

  const submitReply = () => {
    if (!activeThread || !replyText.trim()) return;
    const newEntry = {
      id: `reply-${Date.now()}`,
      sender: "advisor",
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              unread: false,
              updatedAt: "Just now",
              messages: [...thread.messages, newEntry],
            }
          : thread
      )
    );
    setReplyText("");
  };

  const submitNewMessage = () => {
    if (!composeStudent.trim() || !composeSubject.trim() || !composeMessage.trim()) return;

    const newThread = {
      id: `thread-${Date.now()}`,
      studentName: composeStudent.trim(),
      studentEmail: `${composeStudent.trim().toLowerCase().replace(/\s+/g, ".")}@university.edu`,
      subject: composeSubject.trim(),
      updatedAt: "Just now",
      unread: false,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "advisor",
          text: composeMessage.trim(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setComposeOpen(false);
    setComposeStudent("");
    setComposeSubject("");
    setComposeMessage("");
  };

  return (
    <div className={dark ? "advisorMessagesPage advisorMessagesPage--dark" : "advisorMessagesPage"}>
      <header className="advisorMessagesHeader">
        <div>
          <h1>Messages</h1>
          <p>Read and reply to student conversations</p>
        </div>
        <div className="advisorMessagesHeaderActions">
          <button type="button" className="messagesBackBtn" onClick={() => navigate("/advisor/dashboard")}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          <button type="button" className="messagesComposeBtn" onClick={() => setComposeOpen((prev) => !prev)}>
            <MailPlus size={16} />
            <span>New Message</span>
          </button>
          <button type="button" className="messagesThemeBtn" aria-label="Toggle theme" title="Toggle theme" onClick={toggleTheme}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {composeOpen ? (
        <section className="composePanel">
          <div className="composeGrid">
            <input
              type="text"
              placeholder="Student name"
              value={composeStudent}
              onChange={(event) => setComposeStudent(event.target.value)}
              className="composeInput"
            />
            <input
              type="text"
              placeholder="Subject"
              value={composeSubject}
              onChange={(event) => setComposeSubject(event.target.value)}
              className="composeInput"
            />
          </div>
          <textarea
            placeholder="Write your message..."
            value={composeMessage}
            onChange={(event) => setComposeMessage(event.target.value)}
            className="composeTextarea"
          />
          <div className="composeActions">
            <button type="button" className="messagesSecondaryBtn" onClick={() => setComposeOpen(false)}>
              Cancel
            </button>
            <button type="button" className="messagesPrimaryBtn" onClick={submitNewMessage}>
              Send Message
            </button>
          </div>
        </section>
      ) : null}

      <main className="messagesLayout">
        <aside className="threadSidebar">
          <div className="threadSidebarHead">
            <span>Inbox</span>
            <span className="unreadPill">{unreadCount} unread</span>
          </div>

          <div className="threadList">
            {threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                className={thread.id === activeThreadId ? "threadItem threadItem--active" : "threadItem"}
                onClick={() => setActiveThreadId(thread.id)}
              >
                <div className="threadTop">
                  <div className="threadAvatar">{initials(thread.studentName)}</div>
                  <div className="threadHeadText">
                    <div className="threadName">{thread.studentName}</div>
                    <div className="threadSubject">{thread.subject}</div>
                  </div>
                </div>
                <div className="threadMeta">
                  <span>{thread.updatedAt}</span>
                  {thread.unread ? <span className="threadUnreadDot" /> : null}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="messageView">
          {activeThread ? (
            <>
              <div className="messageViewHead">
                <h2>{activeThread.subject}</h2>
                <p>
                  {activeThread.studentName} - {activeThread.studentEmail}
                </p>
              </div>

              <div className="messageBodyList">
                {activeThread.messages.map((item) => (
                  <article key={item.id} className={item.sender === "advisor" ? "messageBubble messageBubble--advisor" : "messageBubble"}>
                    <div className="messageBubbleSender">{item.sender === "advisor" ? "You" : activeThread.studentName}</div>
                    <div className="messageBubbleText">{item.text}</div>
                    <div className="messageBubbleTime">{item.time}</div>
                  </article>
                ))}
              </div>

              <div className="replyBar">
                <textarea
                  className="replyInput"
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                />
                <button type="button" className="messagesPrimaryBtn" onClick={submitReply} disabled={!replyText.trim()}>
                  <Send size={14} />
                  <span>Reply</span>
                </button>
              </div>
            </>
          ) : (
            <div className="messageEmpty">Select a conversation to start replying.</div>
          )}
        </section>
      </main>
    </div>
  );
}
