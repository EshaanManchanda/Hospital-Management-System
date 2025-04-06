
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, BedIcon, CalendarDays, IndianRupee, Activity } from "lucide-react";
import StatCard from "@/components/admin/dashboard/StatCard";
import AppointmentList from "@/components/admin/dashboard/AppointmentList";
import PatientVisitsChart from "@/components/admin/dashboard/PatientVisitsChart";
import DoctorSchedule from "@/components/admin/dashboard/DoctorSchedule";
import { Button } from "@/components/admin/ui/button";

const patientVisitsData = [
  { name: "Jan", visits: 65 },
  { name: "Feb", visits: 59 },
  { name: "Mar", visits: 80 },
  { name: "Apr", visits: 81 },
  { name: "May", visits: 56 },
  { name: "Jun", visits: 55 },
  { name: "Jul", visits: 40 },
  { name: "Aug", visits: 70 },
  { name: "Sep", visits: 90 },
  { name: "Oct", visits: 110 },
  { name: "Nov", visits: 100 },
  { name: "Dec", visits: 85 },
];

const todayAppointments = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    time: "09:00 AM",
    status: "completed" as const,
    type: "Check-up"
  },
  {
    id: "2",
    patientName: "Mike Peterson",
    time: "10:30 AM",
    status: "completed" as const,
    type: "Follow-up"
  },
  {
    id: "3",
    patientName: "Emily Williams",
    time: "11:45 AM",
    status: "in-progress" as const,
    type: "Consultation"
  },
  {
    id: "4",
    patientName: "Robert Thompson",
    time: "02:15 PM",
    status: "scheduled" as const,
    type: "Check-up"
  },
  {
    id: "5",
    patientName: "Linda Garcia",
    time: "04:00 PM",
    status: "scheduled" as const,
    type: "X-Ray"
  }
];

const doctorSchedule = [
  {
    id: "1",
    time: "11:45 AM - 12:15 PM",
    patientName: "Emily Williams",
    type: "Consultation",
    isNext: true
  },
  {
    id: "2",
    time: "02:15 PM - 02:45 PM",
    patientName: "Robert Thompson",
    type: "Check-up"
  },
  {
    id: "3",
    time: "04:00 PM - 04:30 PM",
    patientName: "Linda Garcia",
    type: "X-Ray"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome back, Dr. John Doe</h1>
        <p className="text-gray-600">Here's what's happening at MediCore today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div onClick={() => navigate('/admin/patients')} className="cursor-pointer">
          <StatCard
            title="Total Patients"
            value="3,721"
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        <div className="cursor-pointer group">
          <StatCard
            title="Available Beds"
            value="48/60"
            icon={<BedIcon className="h-6 w-6" />}
            trend={{ value: 8, isPositive: false }}
          />
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              className="w-full bg-hospital-primary hover:bg-hospital-accent text-sm"
              onClick={() => navigate('/admin/book-bed')}
            >
              Book a Bed
            </Button>
          </div>
        </div>

        <div onClick={() => navigate('/admin/appointments')} className="cursor-pointer">
          <StatCard
            title="Appointments"
            value="24"
            icon={<CalendarDays className="h-6 w-6" />}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        <div className="cursor-pointer group">
          <StatCard
            title="Revenue"
            value="₹23,485"
            icon={<IndianRupee className="h-6 w-6" />}
            trend={{ value: 14, isPositive: true }}
          />
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              className="w-full bg-hospital-primary hover:bg-hospital-accent text-sm"
              onClick={() => navigate('/admin/revenue')}
            >
              Revenue Details
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PatientVisitsChart data={patientVisitsData} />
        </div>
        <div>
          <DoctorSchedule schedule={doctorSchedule} />
        </div>
      </div>
      
      <div className="mt-6">
        <AppointmentList appointments={todayAppointments} />
      </div>
    </div>
  );
};

export default Dashboard;
