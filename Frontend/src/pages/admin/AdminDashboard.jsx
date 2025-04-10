import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../components/admin/layout/AdminLayout";

// Import admin page components
import Dashboard from "./Dashboard";
import Patients from "./Patients";
import Doctors from "./Doctors";
import Appointments from "./Appointments";
import Messages from "./Messages";
import Notifications from "./Notifications";
import Pharmacy from "./Pharmacy";
import Records from "./Records";
import MedicalRecords from "./MedicalRecords";
import Reports from "./Reports";
import Revenue from "./Revenue";
import Settings from "./Settings";
import Schedule from "./Schedule";
import BookBed from "./BookBed";
import Profile from "./Profile";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/book-bed" element={<BookBed />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Legacy route support */}
        <Route path="/records" element={<Records />} />
        <Route path="/bookbed" element={<BookBed />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard; 