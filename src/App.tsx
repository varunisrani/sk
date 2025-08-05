import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              {/* Placeholder routes for future features */}
              <Route path="members" element={<div className="p-6 text-center text-muted-foreground">Members page coming soon...</div>} />
              <Route path="alerts" element={<div className="p-6 text-center text-muted-foreground">Pastoral Alerts page coming soon...</div>} />
              <Route path="analytics" element={<div className="p-6 text-center text-muted-foreground">Analytics page coming soon...</div>} />
              <Route path="communications" element={<div className="p-6 text-center text-muted-foreground">Communications page coming soon...</div>} />
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
