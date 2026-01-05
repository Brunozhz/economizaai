import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useSalesNotificationListener } from "@/hooks/useSalesNotificationListener";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";

import Index from "./pages/Index";
import Install from "./pages/Install";
import Auth from "./pages/Auth";
import Purchases from "./pages/Purchases";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Roulette from "./pages/Roulette";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Notifications from "./pages/admin/Notifications";
import AdminUsers from "./pages/admin/AdminUsers";
import Orders from "./pages/admin/Orders";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import Promotions from "./pages/admin/Promotions";
import AdminSupport from "./pages/admin/AdminSupport";
import TestPayments from "./pages/admin/TestPayments";

const queryClient = new QueryClient();

const PageTracker = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  useSalesNotificationListener();
  useAutoRefresh();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageTracker>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/install" element={<Install />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/purchases" element={<Purchases />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/roulette" element={<Roulette />} />
              <Route path="/messages" element={<Messages />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="promotions" element={<Promotions />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="orders" element={<Orders />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="support" element={<AdminSupport />} />
                <Route path="test-payments" element={<TestPayments />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTracker>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
