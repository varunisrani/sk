import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MembersListPage from "./pages/MembersListPage";
import CreateMemberPage from "./pages/CreateMemberPage";
import MemberProfilePage from "./pages/MemberProfilePage";
import EditMemberPage from "./pages/EditMemberPage";
import BulkImportPage from "./pages/BulkImportPage";
import AlertDetailPage from "./pages/AlertDetailPage";
import CommunicationsPage from "./pages/CommunicationsPage";
import RoleGuard from "./components/auth/RoleGuard";
import AlertsPage from "./pages/AlertsPage";

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
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardPage />} />
              
              {/* Member Management Routes */}
              <Route path="members" element={<MembersListPage />} />
              <Route path="members/create" element={<RoleGuard requireStaff><CreateMemberPage /></RoleGuard>} />
              <Route path="members/import" element={<RoleGuard requireStaff><BulkImportPage /></RoleGuard>} />
              <Route path="members/:id" element={<MemberProfilePage />} />
              <Route path="members/:id/edit" element={<RoleGuard requireStaff><EditMemberPage /></RoleGuard>} />
              
              {/* Pastoral Alerts */}
              <Route path="alerts" element={<RoleGuard requireStaff><AlertsPage /></RoleGuard>} />
              <Route path="alerts/:id" element={<RoleGuard requireStaff><AlertDetailPage /></RoleGuard>} />
              
              {/* Placeholder routes for future features */}
              <Route path="analytics" element={<RoleGuard requireStaff><div className="p-6 text-center text-muted-foreground">Analytics page coming soon...</div></RoleGuard>} />
              <Route path="communications" element={<CommunicationsPage />} />
              <Route path="ministry" element={<RoleGuard requireStaff><div className="p-6 text-center text-muted-foreground">Ministry Support page coming soon...</div></RoleGuard>} />
              <Route path="settings" element={<RoleGuard requireStaff><div className="p-6 text-center text-muted-foreground">Settings page coming soon...</div></RoleGuard>} />
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
