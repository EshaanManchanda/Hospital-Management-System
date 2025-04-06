import { Toaster } from "@/components/admin/ui/toaster";
import { Toaster as Sonner } from "@/components/admin/ui/sonner";
import { TooltipProvider } from "@/components/admin/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useState } from "react";
import LoginContext from "./contexts/LoginContext";

// Admin imports
import AdminLayout from "./components/admin/layout/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AdminPatients from "./pages/admin/Patients";
import AdminDoctors from "./pages/admin/Doctors";
import AdminAppointments from "./pages/admin/Appointments";
import Records from "./pages/admin/Records";
import Pharmacy from "./pages/admin/Pharmacy";
import Reports from "./pages/admin/Reports";
import Schedule from "./pages/admin/Schedule";
import Messages from "./pages/admin/Messages";
import Notifications from "./pages/admin/Notifications";
import Settings from "./pages/admin/Settings";
import Profile from "./pages/admin/Profile";
import AdminLogin from "./pages/admin/Login";
import AdminSignUp from "./pages/admin/SignUp";
import NotFound from "./pages/admin/NotFound";
import BookBed from "./pages/admin/BookBed";
import Revenue from "./pages/admin/Revenue";

// Client imports
import Header from "./components/client/Header";
import Footer from "./components/client/Footer";
import Home from "./components/client/Home";
import Appointments from "./components/client/Appointments";
import Patients from "./components/client/Patients";
import Doctors from "./components/client/Doctors";
import DoctorProfile from "./components/client/DoctorProfile";
import Admin from "./components/client/Admin";
import ScrollToTopButton from "./components/client/ScrollToTopButton";
import ScrollToTop from "./components/client/ScrollToTop";
import AboutUs from "./pages/client/AboutUs";
import Services from "./pages/client/Services";
import PrivacyPolicy from "./pages/client/PrivacyPolicy";
import TermsOfService from "./pages/client/TermsOfService";
import ContactUs from "./pages/client/ContactUs";
import SignUp from "./components/client/SignUp";
import Login from "./components/client/Login";

// Create a new QueryClient instance for React Query
const queryClient = new QueryClient();

// For demo purposes, let's simulate an authentication state
const isAdminAuthenticated = true;

// Protected route wrapper component with Outlet for nested routes
const AdminProtectedLayout = () => {
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <ThemeProvider>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </ThemeProvider>
  );
};

// Client layout component with Outlet for nested routes
const ClientLayout = () => {
  return (
    <div className="bg-light min-h-screen font-sans text-primary">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

const App = () => {
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Smith",
      specialty: "Cardiology",
      patients: 120,
      appointments: 450,
      experience: 15,
      qualifications: "MD, FACC",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      bio: "Dr. Smith is a renowned cardiologist with over 15 years of experience in treating complex heart conditions.",
    },
    {
      id: 2,
      name: "Dr. Johnson",
      specialty: "Pediatrics",
      patients: 200,
      appointments: 600,
      experience: 10,
      qualifications: "MD, FAAP",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      bio: "Dr. Johnson is a compassionate pediatrician dedicated to providing comprehensive care for children of all ages.",
    },
    {
      id: 3,
      name: "Dr. Williams",
      specialty: "Orthopedics",
      patients: 150,
      appointments: 500,
      experience: 12,
      qualifications: "MD, FAAOS",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      bio: "Dr. Williams specializes in sports medicine and joint replacement surgeries, helping patients regain mobility and improve their quality of life.",
    },
    {
      id: 4,
      name: "Dr. Brown",
      specialty: "Neurology",
      patients: 100,
      appointments: 350,
      experience: 18,
      qualifications: "MD, PhD",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      bio: "Dr. Brown is a leading neurologist with expertise in treating a wide range of neurological disorders and conducting groundbreaking research.",
    },
    {
      id: 5,
      name: "Dr. Taylor",
      specialty: "Dermatology",
      patients: 180,
      appointments: 550,
      experience: 8,
      qualifications: "MD, FAAD",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      bio: "Dr. Taylor is a skilled dermatologist specializing in both medical and cosmetic dermatology, helping patients achieve healthy and beautiful skin.",
    },
    {
      id: 6,
      name: "Dr. Alex",
      specialty: "Gynecologist",
      patients: 350,
      appointments: 650,
      experience: 10,
      qualifications: "MD, PhD",
      image: "https://randomuser.me/api/portraits/men/94.jpg",
      bio: "Dr. Alex is an experienced gynecologist providing comprehensive women's health care, specializing in reproductive health, pregnancy care, and preventive medicine for women of all ages.",
    },
    {
      id: 7,
      name: "Dr. Wilson",
      specialty: "General practitioner",
      patients: 250,
      appointments: 620,
      experience: 12,
      qualifications: "MD, PHD",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      bio: "Dr. Wilson is an experienced general practitioner providing comprehensive primary care and preventive medicine for patients of all ages.",
    },
    {
      id: 8,
      name: "Dennis Schmidt",
      specialty: "Anesthesiologist",
      patients: 350,
      appointments: 750,
      experience: 17,
      qualifications: "MD, PHD",
      image: "https://randomuser.me/api/portraits/men/26.jpg",
      bio: "Dr. Dennis Schmidt is an experienced general practitioner providing comprehensive primary care and preventive medicine for patients of all ages.",
    },
    {
      id: 9,
      name: "Reginald Bennett",
      specialty: "Ophthalmologist",
      patients: 150,
      appointments: 450,
      experience: 15,
      qualifications: "MD, PHD",
      image: "https://randomuser.me/api/portraits/men/18.jpg",
      bio: "Dr. Reginald Bennett is an experienced general practitioner providing comprehensive primary care and preventive medicine for patients of all ages.",
    },
  ]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Client routes */}
              <Route path="/" element={<ClientLayout />}>
                <Route index element={<Home />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="patients" element={<Patients />} />
                <Route path="doctors" element={<Doctors doctors={doctors} />} />
                <Route path="doctor/:id" element={<DoctorProfile doctors={doctors} />} />
                <Route path="home" element={<Home />} />
                <Route path="about-us" element={<AboutUs />} />
                <Route path="services" element={<Services />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms-of-service" element={<TermsOfService />} />
                <Route path="contact-us" element={<ContactUs />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="login" element={<Login />} />
              </Route>
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignUp />} />
              
              {/* Protected admin routes with layout */}
              <Route path="/admin" element={<AdminProtectedLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="patients" element={<AdminPatients />} />
                <Route path="doctors" element={<AdminDoctors />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="records" element={<Records />} />
                <Route path="pharmacy" element={<Pharmacy />} />
                <Route path="reports" element={<Reports />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="messages" element={<Messages />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="book-bed" element={<BookBed />} />
                <Route path="revenue" element={<Revenue />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </LoginContext.Provider>
  );
};

export default App;
