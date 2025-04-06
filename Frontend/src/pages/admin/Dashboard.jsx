import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, BedIcon, CalendarDays, IndianRupee, Activity, Loader2 } from "lucide-react";
import StatCard from "@/components/admin/dashboard/StatCard";
import AppointmentList from "@/components/admin/dashboard/AppointmentList";
import PatientVisitsChart from "@/components/admin/dashboard/PatientVisitsChart";
import DoctorSchedule from "@/components/admin/dashboard/DoctorSchedule";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { adminService } from "@/services";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [patientVisitsData, setPatientVisitsData] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Use Promise.all to fetch all data in parallel
        const [stats, visits, appointments, schedule, profile] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getPatientVisitsData(),
          adminService.getTodayAppointments(),
          adminService.getDoctorSchedule(),
          adminService.getAdminProfile()
        ]);
        
        setDashboardStats(stats);
        setPatientVisitsData(visits);
        setTodayAppointments(appointments);
        setDoctorSchedule(schedule);
        setAdminProfile(profile);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-hospital-primary mb-4" />
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="text-red-500 mb-4 text-center">
          <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold">{error}</p>
        </div>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-hospital-primary hover:bg-hospital-accent"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, {adminProfile?.name || "Admin"}
        </h1>
        <p className="text-gray-600">Here's what's happening at MediCore today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div onClick={() => navigate('/admin-dashboard/patients')} className="cursor-pointer">
          <StatCard
            title="Total Patients"
            value={dashboardStats?.patients.total.toLocaleString() || "0"}
            icon={<Users className="h-6 w-6" />}
            trend={dashboardStats?.patients.trend || { value: 0, isPositive: true }}
          />
        </div>

        <div className="cursor-pointer group">
          <StatCard
            title="Available Beds"
            value={`${dashboardStats?.beds.available || 0}/${dashboardStats?.beds.total || 0}`}
            icon={<BedIcon className="h-6 w-6" />}
            trend={dashboardStats?.beds.trend || { value: 0, isPositive: true }}
          />
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              className="w-full bg-hospital-primary hover:bg-hospital-accent text-sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/admin-dashboard/book-bed');
              }}
            >
              Book a Bed
            </Button>
          </div>
        </div>

        <div onClick={() => navigate('/admin-dashboard/appointments')} className="cursor-pointer">
          <StatCard
            title="Appointments Today"
            value={dashboardStats?.appointments.today.toString() || "0"}
            icon={<CalendarDays className="h-6 w-6" />}
            trend={dashboardStats?.appointments.trend || { value: 0, isPositive: true }}
          />
        </div>

        <div className="cursor-pointer group">
          <StatCard
            title="Revenue"
            value={`₹${dashboardStats?.revenue.total.toLocaleString() || "0"}`}
            icon={<IndianRupee className="h-6 w-6" />}
            trend={dashboardStats?.revenue.trend || { value: 0, isPositive: true }}
          />
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              className="w-full bg-hospital-primary hover:bg-hospital-accent text-sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/admin-dashboard/revenue');
              }}
            >
              Revenue Details
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {patientVisitsData.length > 0 ? (
            <PatientVisitsChart data={patientVisitsData} />
          ) : (
            <Card className="h-full flex items-center justify-center p-6">
              <p className="text-gray-500">No patient visits data available</p>
            </Card>
          )}
        </div>
        <div>
          {doctorSchedule.length > 0 ? (
            <DoctorSchedule schedule={doctorSchedule} />
          ) : (
            <Card className="h-full flex items-center justify-center p-6">
              <p className="text-gray-500">No doctor schedule available</p>
            </Card>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        {todayAppointments.length > 0 ? (
          <AppointmentList appointments={todayAppointments} />
        ) : (
          <Card className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-gray-500 mb-4">No appointments scheduled for today</p>
              <Button 
                onClick={() => navigate('/admin-dashboard/appointments')}
                className="bg-hospital-primary hover:bg-hospital-accent"
              >
                View All Appointments
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
