import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkSessionAsync } from "./auth/state/authSlice";

// Layout components
import Header from "./ui/components/Header";
import Footer from "./ui/components/Footer";

// Page components
import LoginPage from "./auth/ui/LoginPage";
import RegisterPage from "./auth/ui/RegisterPage";
import ForgetPasswordPage from "./auth/ui/ForgetPasswordPage";
import DashboardPage from "./ui/pages/DashboardPage";
import SubjectListPage from "./ui/pages/SubjectListPage";
import TestConfigPage from "./ui/pages/TestConfigPage";
import ActiveExamPage from "./ui/pages/ActiveExamPage";
import TestResultPage from "./ui/pages/TestResultPage";
import PYQBankPage from "./ui/pages/PYQBankPage";
import AITutorPage from "./ui/pages/AITutorPage";
import UserProfilePage from "./ui/pages/UserProfilePage";
import FullMockTestPage from "./ui/pages/FullMockTestPage";

// Route guard component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, sessionChecked } = useSelector((state) => state.auth);
  
  if (!sessionChecked) return null; // Wait until session check is complete
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkSessionAsync());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <p className="text-sm font-bold text-on-surface-variant font-[Poppins]">Securing session...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Header (visible when logged in) */}
        <Header />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgetPasswordPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects"
              element={
                <ProtectedRoute>
                  <SubjectListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/full-mock-test"
              element={
                <ProtectedRoute>
                  <FullMockTestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-config/:subjectId"
              element={
                <ProtectedRoute>
                  <TestConfigPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/active-exam/:testId"
              element={
                <ProtectedRoute>
                  <ActiveExamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-result/:resultId"
              element={
                <ProtectedRoute>
                  <TestResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pyq-bank"
              element={
                <ProtectedRoute>
                  <PYQBankPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-tutor"
              element={
                <ProtectedRoute>
                  <AITutorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer (visible when logged in) */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
