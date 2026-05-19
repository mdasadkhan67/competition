import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import AdminLayout from "./components/AdminLayout";
import JudgeLayout from "./components/JudgeLayout";

// Shared Pages
import Home from "./pages/Home";
import CheckStatus from "./pages/CheckStatus";
import CheckRound2 from "./pages/CheckRound2";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminRoundOne from "./pages/admin/RoundOne";
import AdminJudges from "./pages/admin/Judges";
import AdminConfig from "./pages/admin/Config";
import AdminExport from "./pages/admin/Export";
import AdminJudgingView from "./pages/admin/AdminJudgingView";
import AdminLyrics from "./pages/admin/AdminLyrics";

// Judge Pages
import JudgeLogin from "./pages/judge/Login";
import JudgeDashboard from "./pages/judge/Dashboard";
import JudgeJudging from "./pages/judge/Judging";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/check-status" element={<CheckStatus />} />
        <Route path="/check-round2" element={<CheckRound2 />} />

        {/* Admin Portal */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="round-one" element={<AdminRoundOne />} />
          <Route path="judges" element={<AdminJudges />} />
          <Route path="results/:group" element={<AdminJudgingView />} />
          <Route path="export" element={<AdminExport />} />
          <Route path="config" element={<AdminConfig />} />
          <Route path="lyrics" element={<AdminLyrics />} />
        </Route>

        {/* Judge Portal */}
        <Route path="/judge/login" element={<JudgeLogin />} />
        <Route path="/judge" element={<JudgeLayout />}>
          <Route path="dashboard" element={<JudgeDashboard />} />
          <Route path="judging/:group" element={<JudgeJudging />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}