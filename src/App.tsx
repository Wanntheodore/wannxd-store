import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider, useStore } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import Checkout from "@/pages/Checkout";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProfit from "@/pages/admin/AdminProfit";
import AdminTransactions from "@/pages/admin/AdminTransactions";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminCustomPrices from "@/pages/admin/AdminCustomPrices";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useStore();
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/checkout/:productId" element={<Checkout />} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/profit" element={
          <ProtectedRoute>
            <AdminProfit />
          </ProtectedRoute>
        } />
        <Route path="/admin/transactions" element={
          <ProtectedRoute>
            <AdminTransactions />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        } />
        <Route path="/admin/custom-prices" element={
          <ProtectedRoute>
            <AdminCustomPrices />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WhatsAppButton />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
