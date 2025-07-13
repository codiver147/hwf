import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import AddClient from "./pages/AddClient";
import EditClient from "./pages/EditClient";
import ViewClient from "./pages/ViewClient";
import Volunteers from "./pages/Volunteers";
import AddVolunteer from "./pages/AddVolunteer";
import EditVolunteer from "./pages/EditVolunteer";
import ViewVolunteer from "./pages/ViewVolunteer";
import Inventory from "./pages/Inventory";
import AddInventoryItem from "./pages/AddInventoryItem";
import EditInventoryItem from "./pages/EditInventoryItem";
import ViewInventoryItem from "./pages/ViewInventoryItem";
import Requests from "./pages/Requests";
import AddRequest from "./pages/AddRequest";
import EditRequest from "./pages/EditRequest";
import ViewRequest from "./pages/ViewRequest";
import Teams from "./pages/Teams";
import AddTeam from "./pages/AddTeam";
import EditTeam from "./pages/EditTeam";
import ViewTeam from "./pages/ViewTeam";
import Categories from "./pages/Categories";
import AddCategory from "./pages/AddCategory";
import EditCategory from "./pages/EditCategory";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/layout/Layout";
import Skills from "./pages/Skills";
import AddSkill from "./pages/AddSkill";

const queryClient = new QueryClient();

const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};

const getUserRole = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.role;
  } catch (e) {
    return null;
  }
};

const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    const userRole = getUserRole();
    
    const hasPermission = 
      allowedRoles.length === 0 || 
      (userRole && (allowedRoles.includes(userRole) || userRole === 'superadmin'));
    
    setAllowed(authenticated && hasPermission);
    setLoading(false);
  }, [allowedRoles]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return allowed ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/clients" element={
                <ProtectedRoute>
                  <Layout><Clients /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/clients/add" element={
                <ProtectedRoute>
                  <Layout><AddClient /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/clients/edit/:id" element={
                <ProtectedRoute>
                  <Layout><EditClient /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/clients/view/:id" element={
                <ProtectedRoute>
                  <Layout><ViewClient /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/volunteers" element={
                <ProtectedRoute>
                  <Layout><Volunteers /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/volunteers/add" element={
                <ProtectedRoute>
                  <Layout><AddVolunteer /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/volunteers/edit/:id" element={
                <ProtectedRoute>
                  <Layout><EditVolunteer /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/volunteers/view/:id" element={
                <ProtectedRoute>
                  <Layout><ViewVolunteer /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/inventory" element={
                <ProtectedRoute>
                  <Layout><Inventory /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/inventory/add" element={
                <ProtectedRoute>
                  <Layout><AddInventoryItem /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/inventory/edit/:id" element={
                <ProtectedRoute>
                  <Layout><EditInventoryItem /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/inventory/view/:id" element={
                <ProtectedRoute>
                  <Layout><ViewInventoryItem /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/requests" element={
                <ProtectedRoute>
                  <Layout><Requests /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/requests/add" element={
                <ProtectedRoute>
                  <Layout><AddRequest /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/requests/:id/edit" element={
                <ProtectedRoute>
                  <Layout><EditRequest /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/requests/:id" element={
                <ProtectedRoute>
                  <Layout><ViewRequest /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/teams" element={
                <ProtectedRoute>
                  <Layout><Teams /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/teams/add" element={
                <ProtectedRoute>
                  <Layout><AddTeam /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/teams/edit/:id" element={
                <ProtectedRoute>
                  <Layout><EditTeam /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/teams/view/:id" element={
                <ProtectedRoute>
                  <Layout><ViewTeam /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/categories" element={
                <ProtectedRoute>
                  <Layout><Categories /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/categories/add" element={
                <ProtectedRoute allowedRoles={["superadmin", "manager"]}>
                  <Layout><AddCategory /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/categories/edit/:id" element={
                <ProtectedRoute allowedRoles={["superadmin", "manager"]}>
                  <Layout><EditCategory /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/skills" element={
                <ProtectedRoute>
                  <Layout><Skills /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/skills/add" element={
                <ProtectedRoute allowedRoles={["superadmin", "manager"]}>
                  <Layout><AddSkill /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
