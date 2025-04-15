import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router,
  Routes, 
  Route, 
  Navigate, 
  Outlet, 
  useLocation,
  useNavigate
} from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/admin/ui/toaster";
import { Toaster as Sonner } from "@/components/admin/ui/sonner";
import { TooltipProvider } from "@/components/admin/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LoginProvider } from "./contexts/LoginContext";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleAuthProvider } from "./contexts/GoogleAuthContext";
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster as ReactHotToastToaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { SpeedInsights } from "@vercel/speed-insights/react";
import store from './store';
import { toast } from 'react-hot-toast';
import ProtectedRoute from "./components/shared/ProtectedRoute";
import DashboardRedirect from './components/DashboardRedirect';
import { useDispatch } from 'react-redux';

// Import basic components
import Header from "./components/client/Header";
import Footer from "./components/client/Footer";
import ScrollToTopButton from "./components/client/ScrollToTopButton";
import NotFound from "./components/client/NotFound";
import GoogleOAuthCallback from "./components/GoogleOAuthCallback";
import ForgotPassword from "./components/client/ForgotPassword";
import ResetPassword from "./components/client/ResetPassword";

// Import dashboard components
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";

// Import doctor components
import DoctorLayout from "./layouts/DoctorLayout";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorPrescriptions from "./pages/doctor/DoctorPrescriptions";
import DoctorReports from "./pages/doctor/DoctorReports";
import DoctorProfile from "./pages/doctor/DoctorProfile";

// Import patient components
import PatientLayout from "./layouts/PatientLayout";
import Appointments from "./pages/patient/Appointments";
import MedicalReports from "./pages/patient/MedicalReports";
import PatientBeds from "./pages/patient/PatientBeds";
import PatientMedications from "./pages/patient/PatientMedications";
import PatientPrescriptions from "./pages/patient/PatientPrescriptions";
import PatientProfile from "./pages/patient/PatientProfile";

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

// Create React Query client
const queryClient = new QueryClient();

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  console.error('ErrorBoundary caught an error:', error);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <pre className="text-sm bg-red-50 p-4 rounded-lg mb-4 max-w-lg overflow-auto">
        {error.message}
      </pre>
      <div className="space-x-4">
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reload page
        </button>
      </div>
    </div>
  );
};

// AuthContent component that needs Router
const AuthContent = () => {
  const dispatch = useDispatch();
  return (
    <AuthProvider>
      <GoogleAuthProvider>
        <LoginProvider>
          <AppContent />
        </LoginProvider>
      </GoogleAuthProvider>
    </AuthProvider>
  );
};

// AppContent component
const AppContent = () => {
  const location = useLocation();
  const isPatientDashboard = location.pathname.startsWith('/patient-dashboard');
  
  // Debug logging for auth status in AppContent
  console.log('AppContent rendering, current location:', location.pathname);
  console.log('AppContent localStorage token exists:', !!localStorage.getItem('token'));
  console.log('AppContent localStorage userData exists:', !!localStorage.getItem('userData'));

  return (
    <>
      <Header />
      <ScrollToTopButton />
      <main className={`min-h-screen ${isPatientDashboard ? 'bg-gray-100' : 'bg-gray-50'}`}>
        <Suspense 
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              <Route path="about-us" element={<AboutUs />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="services" element={<TermsOfService />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="patients" element={<PatientsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              
              {/* Special route for handling Google OAuth callback */}
              <Route path="auth/google/callback" element={<GoogleOAuthCallback />} />
              
              {/* Protected Routes */}
              <Route path="admin-dashboard/*" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="doctor-dashboard/*" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorLayout>
                    <Routes>
                      <Route path="/" element={<DoctorDashboard />} />
                      <Route path="appointments" element={<DoctorAppointments />} />
                      <Route path="patients" element={<DoctorPatients />} />
                      <Route path="prescriptions" element={<DoctorPrescriptions />} />
                      <Route path="reports" element={<DoctorReports />} />
                      <Route path="profile" element={<DoctorProfile />} />
                    </Routes>
                  </DoctorLayout>
                </ProtectedRoute>
              } />
              
              <Route path="patient-dashboard/*" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientLayout>
                    <Routes>
                      <Route path="/" element={<PatientDashboard />} />
                      <Route path="appointments" element={<Appointments />} />
                      <Route path="medical-records" element={<MedicalReports />} />
                      <Route path="beds" element={<PatientBeds />} />
                      <Route path="medications" element={<PatientMedications />} />
                      <Route path="prescriptions" element={<PatientPrescriptions />} />
                      <Route path="profile" element={<PatientProfile />} />
                    </Routes>
                  </PatientLayout>
                </ProtectedRoute>
              } />
              
              <Route path="dashboard" element={<DashboardRedirect />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      {!isPatientDashboard && <Footer />}
      <ReactHotToastToaster position="top-right" />
      <Toaster />
      <Sonner />
    </>
  );
};

// Main App component
const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <TooltipProvider>
              <Router>
                <Suspense fallback={<LoadingFallback />}>
                  <AuthContent />
                </Suspense>
              </Router>
              <SpeedInsights />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
