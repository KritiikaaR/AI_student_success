import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/student" replace />} />

        {/* Student Dashboard */}
        <Route path="/student" element={<StudentDashboard />} />

        {/* Advisor Dashboard */}
        <Route path="/advisor" element={<AdvisorDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<div>NO MATCH</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
