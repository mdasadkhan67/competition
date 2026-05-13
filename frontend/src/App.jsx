import AdminLayout from "./components/AdminLayout";
import Login from "./pages/admin/Login";
import Users from "./pages/admin/Users";
import Dashboard from "./pages/admin/Dashboard";
import Config from "./pages/admin/Config";
import Export from "./pages/admin/Export";
import CheckStatus from "./pages/CheckStatus";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/check-status" element={<CheckStatus />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="export" element={<Export />} />
          <Route path="config" element={<Config />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
} 