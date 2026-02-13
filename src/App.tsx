import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { useRemoveBranding } from "@/hooks/useRemoveBranding";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Facilities from "./pages/Facilities";
import Assets from "./pages/Assets";
import MOCRequests from "./pages/MOCRequests";
import MOCDetail from "./pages/MOCDetail";
import RiskAnalysis from "./pages/RiskAnalysis";
import WorkOrders from "./pages/WorkOrders";
import Standards from "./pages/Standards";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import HelpCenter from "./pages/HelpCenter";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  // Remove third-party branding
  useRemoveBranding();

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/facilities"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Facilities />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Assets />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/moc-requests"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MOCRequests />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/moc-requests/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MOCDetail />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/risk-analysis"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RiskAnalysis />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/work-orders"
        element={
          <ProtectedRoute>
            <AppLayout>
              <WorkOrders />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/standards"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Standards />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AppLayout>
              <UserManagement />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/help-center"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HelpCenter />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Reports />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile-settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfileSettings />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
