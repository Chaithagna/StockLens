import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Layouts
import { DashboardLayout } from './layouts/DashboardLayout.jsx';
import { AuthLayout } from './layouts/AuthLayout.jsx';

// Pages
import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { CompanySearchPage } from './pages/CompanySearchPage.jsx';
import { ResearchDetailsPage } from './pages/ResearchDetailsPage.jsx';
import { LegitimacyVerificationPage } from './pages/LegitimacyVerificationPage.jsx';
import { FinancialAnalysisPage } from './pages/FinancialAnalysisPage.jsx';
import { RiskAssessmentPage } from './pages/RiskAssessmentPage.jsx';
import { ResearchHistoryPage } from './pages/ResearchHistoryPage.jsx';
import { CompanyComparisonPage } from './pages/CompanyComparisonPage.jsx';
import { AIAssistantPage } from './pages/AIAssistantPage.jsx';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-xs">
        Authenticating terminal session...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* Public Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/search" element={<CompanySearchPage />} />
        <Route path="/research/:id" element={<ResearchDetailsPage />} />
        <Route path="/verification" element={<LegitimacyVerificationPage />} />
        <Route path="/financials" element={<FinancialAnalysisPage />} />
        <Route path="/risks" element={<RiskAssessmentPage />} />
        <Route path="/history" element={<ResearchHistoryPage />} />
        <Route path="/compare" element={<CompanyComparisonPage />} />
        <Route path="/assistant" element={<AIAssistantPage />} />
        <Route path="/settings" element={<ProfileSettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

