import React from 'react';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard cards with links to different sections */}
        <Link to="/doctor-dashboard/appointments" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-2">Today's Appointments</h2>
          <p className="text-gray-600">Manage your scheduled appointments</p>
        </Link>
        <Link to="/doctor-dashboard/patients" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-2">Patient Records</h2>
          <p className="text-gray-600">Access patient medical records</p>
        </Link>
        <Link to="/doctor-dashboard/prescriptions" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-2">Prescriptions</h2>
          <p className="text-gray-600">Manage patient prescriptions</p>
        </Link>
        <Link to="/doctor-dashboard/reports" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-2">Medical Reports</h2>
          <p className="text-gray-600">View and create medical reports</p>
        </Link>
        <Link to="/doctor-dashboard/profile" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-2">My Profile</h2>
          <p className="text-gray-600">Manage your personal information</p>
        </Link>
      </div>
    </div>
  );
};

export default DoctorDashboard; 