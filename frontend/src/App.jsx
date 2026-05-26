import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";
import JudgeLayout from "./components/JudgeLayout";

// Shared Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Rules from "./pages/Rules";
import Results from "./pages/Results";
import Leaderboard from "./pages/Leaderboard";
import Contact from "./pages/Contact";
import CheckStatus from "./pages/CheckStatus";
import CheckRound2 from "./pages/CheckRound2";

// Participant Portal Pages
import ParticipantDashboard from "./pages/ParticipantDashboard";
import UploadSubmission from "./pages/UploadSubmission";
import ProfileSettings from "./pages/ProfileSettings";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminRoundOne from "./pages/admin/RoundOne";
import AdminJudges from "./pages/admin/Judges";
import AdminExport from "./pages/admin/Export";
import AdminConfig from "./pages/admin/Config";
import AdminJudgingView from "./pages/admin/AdminJudgingView";
import AdminLyrics from "./pages/admin/AdminLyrics";

// Judge Pages
import JudgeDashboard from "./pages/judge/Dashboard";
import JudgeJudging from "./pages/judge/Judging";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Shared Header & Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/results" element={<Results />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/check-status" element={<CheckStatus />} />
          <Route path="/check-round2" element={<CheckRound2 />} />
        </Route>

        {/* Participant Portal (Client Session Authenticated) */}
        <Route path="/participant">
          <Route path="dashboard" element={<ParticipantDashboard />} />
          <Route path="upload" element={<UploadSubmission />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Admin Portal (Token Authenticated) */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="round-one" element={<AdminRoundOne />} />
          <Route path="judges" element={<AdminJudges />} />
          <Route path="results/:group" element={<AdminJudgingView />} />
          <Route path="export" element={<AdminExport />} />
          <Route path="config" element={<AdminConfig />} />
          <Route path="lyrics" element={<AdminLyrics />} />
        </Route>

        {/* Judge Portal (Token Authenticated) */}
        <Route path="/judge/login" element={<Login />} />
        <Route path="/judge" element={<JudgeLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<JudgeDashboard />} />
          <Route path="judging/:group" element={<JudgeJudging />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}