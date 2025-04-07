import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, ReactNode } from "react";
import Header from "./components/client/Header";
import Footer from "./components/client/Footer";
import ScrollToTop from "./components/client/ScrollToTop";
import ScrollToTopButton from "./components/client/ScrollToTopButton";
import NotFound from "./components/client/NotFound";
import { authService } from "./services";
import { LoginProvider } from "./contexts/LoginContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/admin/ui/toaster";
import { Toaster as Sonner } from "@/components/admin/ui/sonner";
import { TooltipProvider } from "@/components/admin/ui/tooltip";

// Create a new QueryClient instance for React Query
const queryClient = new QueryClient();

// Lazy load components
const Home = lazy(() => import("./components/client/Home"));
const Doctors = lazy(() => import("./components/client/Doctors"));
const Patients = lazy(() => import("./components/client/Patients"));
const Appointments = lazy(() => import("./components/client/Appointments"));
const Login = lazy(() => import("./components/client/Login"));
const SignUp = lazy(() => import("./components/client/SignUp"));
const AboutUs = lazy(() => import("./pages/client/AboutUs"));
const ContactUs = lazy(() => import("./pages/client/ContactUs"));
const TermsOfService = lazy(() => import("./pages/client/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/client/PrivacyPolicy"));

// Patient Pages
const PatientDashboard = lazy(() => import("./pages/patient/PatientDashboard"));
const PatientProfile = lazy(() => import("./pages/patient/PatientProfile"));
const MedicalReports = lazy(() => import("./pages/patient/MedicalReports"));
const NewAppointment = lazy(() => import("./pages/patient/NewAppointment"));

// Lazy load client pages
const ClientDoctors = lazy(() => import("./pages/client/Doctors"));
const ClientPatients = lazy(() => import("./pages/client/Patients"));
const ClientAppointments = lazy(() => import("./pages/client/Appointments"));

// Protect routes that require authentication
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  console.log("ProtectedRoute", { isAuthenticated, userRole, allowedRoles });

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("Redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user's role is not included, redirect based on their role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log(`Redirecting based on role: ${userRole}`);
    if (userRole === "admin") {
      window.location.href = "/admin-dashboard";
      return null;
    } else if (userRole === "doctor") {
      return <Navigate to="/doctor-dashboard" replace />;
    } else if (userRole === "patient") {
      return <Navigate to="/patient-dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// Dashboard redirect handler
const DashboardRedirect = () => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to appropriate dashboard based on role
  if (userRole === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  } else if (userRole === "doctor") {
    return <Navigate to="/doctor-dashboard" replace />;
  } else if (userRole === "patient") {
    return <Navigate to="/patient-dashboard" replace />;
  } else {
    return <Navigate to="/" replace />;
  }
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

// Main App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <LoginProvider>
            <Toaster />
            <Sonner />
            <Router>
              <ScrollToTop />
              <Header />
              <main className="min-h-screen bg-gray-50">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public Routes - accessible by all without authentication */}
                    <Route path="/" element={<Home />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/appointment" element={<Navigate to="/patient-dashboard" replace state={{ activeTab: "appointments" }} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    
                    {/* Client Page Routes - These map to components in pages/client */}
                    <Route path="/client/doctors" element={<ClientDoctors />} />
                    <Route path="/client/patients" element={<ClientPatients />} />
                    <Route path="/client/appointments" element={<ClientAppointments />} />
                    
                    {/* Dashboard redirect routes */}
                    <Route path="/dashboard" element={<DashboardRedirect />} />
                    <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
                    <Route path="/doctor" element={<Navigate to="/doctor-dashboard" replace />} />
                    
                    {/* New Appointment Route */}
                    <Route path="/appointments/new" element={
                      <ProtectedRoute allowedRoles={['patient']}>
                        <NewAppointment />
                      </ProtectedRoute>
                    } />
                    
                    {/* Patient Dashboard Routes */}
                    <Route path="/patient-dashboard/*" element={
                      <ProtectedRoute allowedRoles={['patient']}>
                        <Routes>
                          <Route path="/" element={<PatientDashboard />} />
                          <Route path="appointments" element={<PatientDashboard />} />
                          <Route path="doctors" element={<PatientDashboard />} />
                          <Route path="reports" element={<MedicalReports />} />
                          <Route path="prescriptions" element={<PatientDashboard />} />
                          <Route path="profile" element={<PatientProfile />} />
                          <Route path="*" element={<Navigate to="/patient-dashboard" replace />} />
                        </Routes>
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Dashboard Routes */}
                    <Route path="/admin-dashboard/*" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Routes>
                          <Route path="/" element={<NotFound />} />
                          <Route path="patients" element={<NotFound />} />
                          <Route path="doctors" element={<NotFound />} />
                          <Route path="appointments" element={<NotFound />} />
                          <Route path="medical-records" element={<NotFound />} />
                          <Route path="prescriptions" element={<NotFound />} />
                          <Route path="pharmacy" element={<NotFound />} />
                          <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
                        </Routes>
                      </ProtectedRoute>
                    } />
                    
                    {/* Doctor Dashboard Routes */}
                    <Route path="/doctor-dashboard/*" element={
                      <ProtectedRoute allowedRoles={['doctor']}>
                        <Routes>
                          <Route path="/" element={<NotFound />} />
                          <Route path="patients" element={<NotFound />} />
                          <Route path="appointments" element={<NotFound />} />
                          <Route path="prescriptions" element={<NotFound />} />
                          <Route path="*" element={<Navigate to="/doctor-dashboard" replace />} />
                        </Routes>
                      </ProtectedRoute>
                    } />
                    
                    {/* Legacy route support for direct access */}
                    <Route path="/patient/profile" element={<Navigate to="/patient-dashboard/profile" replace />} />
                    <Route path="/patient/reports" element={<Navigate to="/patient-dashboard/reports" replace />} />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <ScrollToTopButton />
            </Router>
          </LoginProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
