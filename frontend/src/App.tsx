
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import {ErrorBoundary} from 'react-error-boundary';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Recipe from "./pages/Recipe";
import Recipes from "./pages/Recipes";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Test from "./pages/Test";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const ErrorFallBack = ({ error }: { error: Error }) => {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded-md text-center h-screen">
      <h1 className="font-bold text-3xl">Oops!</h1>
      <h2 className="font-bold">Something went wrong</h2>
      <pre style={{ whiteSpace: "normal" }}>{error.message}</pre>
    </div>
  );
}

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallBack}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={
                <PublicRoute>
                  <Index />
                </PublicRoute>} />
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
                } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>} />
              <Route element={<ProtectedRoute />}>
              {/* <Route path="/test" element={<Test/>} /> */}
              <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipe/:id" element={<Recipe />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
