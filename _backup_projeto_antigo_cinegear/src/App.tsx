import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/AppLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import ReservationsPage from "./pages/ReservationsPage";
import QuotesPage from "./pages/QuotesPage";
import AgendaPage from "./pages/AgendaPage";
import ClientsPage from "./pages/ClientsPage";
import KitsPage from "./pages/KitsPage";
import ContractsPage from "./pages/ContractsPage";
import FinancialPage from "./pages/FinancialPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/quotes" element={<QuotesPage />} />
                <Route path="/agenda" element={<AgendaPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/kits" element={<KitsPage />} />
                <Route path="/contracts" element={<ContractsPage />} />
                <Route path="/financial" element={<FinancialPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
