import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Facilities from "./pages/Facilities";
import Assets from "./pages/Assets";
import MOCRequests from "./pages/MOCRequests";
import MOCDetail from "./pages/MOCDetail";
import RiskAnalysis from "./pages/RiskAnalysis";
import WorkOrders from "./pages/WorkOrders";
import Standards from "./pages/Standards";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/facilities"
            element={
              <AppLayout>
                <Facilities />
              </AppLayout>
            }
          />
          <Route
            path="/assets"
            element={
              <AppLayout>
                <Assets />
              </AppLayout>
            }
          />
          <Route
            path="/moc-requests"
            element={
              <AppLayout>
                <MOCRequests />
              </AppLayout>
            }
          />
          <Route
            path="/moc-requests/:id"
            element={
              <AppLayout>
                <MOCDetail />
              </AppLayout>
            }
          />
          <Route
            path="/risk-analysis"
            element={
              <AppLayout>
                <RiskAnalysis />
              </AppLayout>
            }
          />
          <Route
            path="/work-orders"
            element={
              <AppLayout>
                <WorkOrders />
              </AppLayout>
            }
          />
          <Route
            path="/standards"
            element={
              <AppLayout>
                <Standards />
              </AppLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AppLayout>
                <UserManagement />
              </AppLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
