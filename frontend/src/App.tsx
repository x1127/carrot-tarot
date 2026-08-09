import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Deck from "@/pages/Deck";
import Divine from "@/pages/Divine";
import History from "@/pages/History";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import ThemeSettings from "@/pages/admin/ThemeSettings";
import ContentSettings from "@/pages/admin/ContentSettings";
import CardImageSettings from "@/pages/admin/CardImageSettings";
import ApiSettings from "@/pages/admin/ApiSettings";
import PasswordSettings from "@/pages/admin/PasswordSettings";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deck" element={<Deck />} />
        <Route path="/divine" element={<Divine />} />
        <Route path="/history" element={<History />} />
        
        {/* 管理员登录（无需认证） */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* 管理员后台（需要认证） */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ThemeSettings />} />
          <Route path="content" element={<ContentSettings />} />
          <Route path="cards" element={<CardImageSettings />} />
          <Route path="api" element={<ApiSettings />} />
          <Route path="password" element={<PasswordSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}
