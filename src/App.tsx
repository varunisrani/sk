import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
// import ProtectedRoute from "./components/auth/ProtectedRoute";
import MembersListPage from "./pages/MembersListPage";
import CreateMemberPage from "./pages/CreateMemberPage";
import MemberProfilePage from "./pages/MemberProfilePage";
import EditMemberPage from "./pages/EditMemberPage";
import BulkImportPage from "./pages/BulkImportPage";
import AlertsPage from "./pages/AlertsPage";
import AlertDetailPage from "./pages/AlertDetailPage";
import CommunicationsPage from "./pages/CommunicationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              
              {/* Member Management Routes */}
              <Route path="members" element={<MembersListPage />} />
              <Route path="members/create" element={<CreateMemberPage />} />
              <Route path="members/import" element={<BulkImportPage />} />
              <Route path="members/:id" element={<MemberProfilePage />} />
              <Route path="members/:id/edit" element={<EditMemberPage />} />
              
              {/* Pastoral Alerts */}
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="alerts/:id" element={<AlertDetailPage />} />
              
              {/* Placeholder routes for future features */}
              <Route path="analytics" element={<div className="p-6 text-center text-muted-foreground">Analytics page coming soon...</div>} />
              <Route path="communications" element={<CommunicationsPage />} />
              <Route path="ministry" element={<div className="p-6 text-center text-muted-foreground">Ministry Support page coming soon...</div>} />
              <Route path="settings" element={<div className="p-6 text-center text-muted-foreground">Settings page coming soon...</div>} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
