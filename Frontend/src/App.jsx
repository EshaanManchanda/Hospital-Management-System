import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/admin/ui/toaster";
import { Toaster as Sonner } from "@/components/admin/ui/sonner";
import { TooltipProvider } from "@/components/admin/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LoginProvider } from "./contexts/LoginContext";
import { useLocation } from "react-router-dom";

// Import basic components
import Header from "./components/client/Header";
import Footer from "./components/client/Footer";
import ScrollToTop from "./components/client/ScrollToTop";
import ScrollToTopButton from "./components/client/ScrollToTopButton";
import NotFound from "./components/client/NotFound";
import { authService } from "./services";

// Import admin components
import AdminLayout from "./components/admin/layout/Layout";
import Dashboard from "./pages/admin/Dashboard";
import Patients from "./pages/admin/Patients";
import AdminDoctors from "./pages/admin/Doctors";
import Appointments from "./pages/admin/Appointments";
import Records from "./pages/admin/Records";
import Pharmacy from "./pages/admin/Pharmacy";
import Revenue from "./pages/admin/Revenue";
import BookBed from "./pages/admin/BookBed";
import Messages from "./pages/admin/Messages";
import Schedule from "./pages/admin/Schedule";
import Notifications from "./pages/admin/Notifications";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Create a new QueryClient instance for React Query
const queryClient = new QueryClient();

// Lazy load components
const Home = lazy(() => import("./components/client/Home"));
const Doctors = lazy(() => import("./pages/client/Doctors"));
const PatientsPage = lazy(() => import("./components/client/Patients"));
const AppointmentsPage = lazy(() => import("./components/client/Appointments"));
const Login = lazy(() => import("./components/client/Login"));
const SignUp = lazy(() => import("./pages/shared/SignUp"));
const AboutUs = lazy(() => import("./pages/client/AboutUs"));
const ContactUs = lazy(() => import("./pages/client/ContactUs"));
const TermsOfService = lazy(() => import("./pages/client/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/client/PrivacyPolicy"));

// Patient Pages
const PatientDashboardLegacy = lazy(() => import("./pages/patient/PatientDashboard"));
const PatientProfile = lazy(() => import("./pages/patient/PatientProfile"));
const MedicalReports = lazy(() => import("./pages/patient/MedicalReports"));
const NewAppointment = lazy(() => import("./pages/patient/NewAppointment"));
const PatientMedications = lazy(() => import("./pages/patient/PatientMedications"));
const PatientPrescriptions = lazy(() => import("./pages/patient/PatientPrescriptions"));
const PatientBeds = lazy(() => import("./pages/patient/PatientBeds"));

// Import patient dashboard components
import PatientLayout from "./layouts/PatientLayout";
import PatientDashboard from "./pages/patient/Dashboard";
import PatientAppointments from "./pages/patient/Appointments";

// Lazy load client pages
const ClientDoctors = lazy(() => import("./pages/client/Doctors"));
const ClientPatients = lazy(() => import("./pages/client/Patients"));
const ClientAppointments = lazy(() => import("./pages/client/Appointments"));

// Protect routes that require authentication
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();
  
  console.log("ProtectedRoute - Auth check:", { 
    isAuthenticated, 
    userRole, 
    allowedRoles,
    currentPath: window.location.pathname 
  });

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified and user's role is not included, redirect based on their role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log(`ProtectedRoute - Role ${userRole} not allowed. Allowed roles:`, allowedRoles);
    
    // Redirect to appropriate dashboard based on their role
    if (userRole === 'admin') {
      console.log("ProtectedRoute - Admin role detected, redirecting to admin dashboard");
      // Use direct browser navigation for admin to ensure complete page reload
      window.location.href = '/admin-dashboard';
      return null;
    } else if (userRole === 'doctor') {
      console.log("ProtectedRoute - Doctor role detected, redirecting to doctor dashboard");
      return <Navigate to="/doctor-dashboard" replace />;
    } else if (userRole === 'patient') {
      console.log("ProtectedRoute - Patient role detected, redirecting to patient dashboard");
      return <Navigate to="/patient-dashboard" replace />;
    }
    
    console.log("ProtectedRoute - Unknown role, redirecting to home");
    return <Navigate to="/" replace />;
  }
  
  console.log("ProtectedRoute - Access granted");
  return children;
};

// Dashboard redirect handler
const DashboardRedirect = () => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();
  
  console.log("DashboardRedirect - Auth check:", { isAuthenticated, userRole });
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to appropriate dashboard based on role
  if (userRole === "admin") {
    // For admin users, use direct navigation to ensure proper loading
    console.log("DashboardRedirect - Redirecting admin to admin dashboard");
    window.location.href = '/admin-dashboard';
    return null;
  } else if (userRole === "doctor") {
    console.log("DashboardRedirect - Redirecting doctor to doctor dashboard");
    return <Navigate to="/doctor-dashboard" replace />;
  } else if (userRole === "patient") {
    console.log("DashboardRedirect - Redirecting patient to patient dashboard");
    return <Navigate to="/patient-dashboard" replace />;
  } else {
    console.log("DashboardRedirect - Unknown role, redirecting to home");
    return <Navigate to="/" replace />;
  }
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

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
              <AppContent />
            </Router>
          </LoginProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// AppContent component with access to router hooks
const AppContent = () => {
  const location = useLocation();
  const isPatientDashboard = location.pathname.startsWith('/patient-dashboard');

  return (
    <>
      <Header />
      <ScrollToTopButton />
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes - accessible by all without authentication */}
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
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
            
            {/* Patient Dashboard Routes - Uses the PatientLayout */}
            <Route path="/patient-dashboard/*" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientLayout />
              </ProtectedRoute>
            }>
              <Route index element={<PatientDashboard />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="reports" element={<MedicalReports />} />
              <Route path="prescriptions" element={<PatientPrescriptions />} />
              <Route path="medications" element={<PatientMedications />} />
              <Route path="beds" element={<PatientBeds />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="*" element={<Navigate to="/patient-dashboard" replace />} />
            </Route>
            
            {/* Legacy routes support */}
            <Route path="/patient-dashboard" element={<Navigate to="/patient-dashboard" replace />} />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin-dashboard/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="patients" element={<Patients />} />
                    <Route path="doctors" element={<AdminDoctors />} />
                    <Route path="appointments" element={<Appointments />} />
                    <Route path="medical-records" element={<Records />} />
                    <Route path="pharmacy" element={<Pharmacy />} />
                    <Route path="revenue" element={<Revenue />} />
                    <Route path="book-bed" element={<BookBed />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
                  </Routes>
                </AdminLayout>
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
      {!isPatientDashboard && <Footer />}
    </>
  );
};

export default App; 