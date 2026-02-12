import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";

import StudentDashboard from "./pages/StudentDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";

import StudentPersonalInfo from "./pages/StudentPersonalInfo";
import StudentActionPlan from "./pages/StudentActionPlan";
import StudentHelpSupport from "./pages/StudentHelpSupport";
import StudentRequests from "./pages/StudentRequests";
import StudentCourseDetails from "./pages/StudentCourseDetails";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/advisor" element={<AdvisorDashboard />} />
          <Route path="/student/personal" element={<StudentPersonalInfo />} />
          <Route path="/student/requests" element={<StudentRequests />} />
          <Route path="/student/help" element={<StudentHelpSupport />} />
          <Route path="/student/action-plan" element={<StudentActionPlan />} />
          <Route path="/student/course/:code" element={<StudentCourseDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
