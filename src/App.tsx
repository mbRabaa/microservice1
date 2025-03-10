
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import RoutesPage from "./frontend/pages/Routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouterRoutes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/routes" element={<RoutesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
