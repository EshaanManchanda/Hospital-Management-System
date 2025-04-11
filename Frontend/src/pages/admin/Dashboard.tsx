import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, BedIcon, CalendarDays, IndianRupee, Loader, RefreshCw, Database, RotateCcw } from "lucide-react";
import StatCard from "@/components/admin/dashboard/StatCard";
import AppointmentList from "@/components/admin/dashboard/AppointmentList";
import PatientVisitsChart from "@/components/admin/dashboard/PatientVisitsChart";
import DoctorSchedule from "@/components/admin/dashboard/DoctorSchedule";
import { Button } from "@/components/admin/ui/button";
import { dashboardService } from "@/services";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/admin/ui/card";

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

// Add a function to clear all caches from dashboard data
const clearDashboardCache = () => {
  // This is a hack to access the cacheStore in dashboardService
  // In a real app, we would expose this method properly
  if (dashboardService.clearCaches) {
    dashboardService.clearCaches();
  } else {
    // Fallback if method doesn't exist
    console.warn('Cache clear function not available');
    localStorage.removeItem('dashboard_stats_admin');
    localStorage.removeItem('patient_visits_admin_monthly');
    localStorage.removeItem('appointments_admin_today');
    localStorage.removeItem('schedule_admin');
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fullRefresh, setFullRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [useMockData, setUseMockData] = useState(false);
  const [stats, setStats] = useState({
    patients: { total: 0, newToday: 0, trend: { value: 0, isPositive: true } },
    beds: { available: 0, total: 0, trend: { value: 0, isPositive: true } },
    appointments: { today: 0, trend: { value: 0, isPositive: true } },
    revenue: { total: 0, trend: { value: 0, isPositive: true } }
  });
  const [visits, setVisits] = useState(patientVisitsData);
  const [appointments, setAppointments] = useState(todayAppointments);
  const [schedule, setSchedule] = useState(doctorSchedule);

  // Get user data from localStorage for personalized greeting
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const adminName = userData.name || 'Admin';

  // Fetch dashboard data
  const fetchDashboardData = async (forceMock = false) => {
    setRefreshing(true);
    try {
      // Force environment mock data setting if requested
      const useLocalMock = forceMock || useMockData;
      
      // Store original env value
      const originalEnvValue = import.meta.env.VITE_USE_MOCK_DATA;
      
      // Temporarily override env value if needed
      if (useLocalMock) {
        // @ts-ignore - Ignoring type check as we're intentionally modifying env
        import.meta.env.VITE_USE_MOCK_DATA = 'true';
      }
      
      // Show what data source we're using
      console.log(`Using ${useLocalMock ? 'mock' : 'real'} data for dashboard`);
      
      // Fetch all dashboard data in parallel
      const [dashboardStats, visitsData, todayAppts, doctorSched] = await Promise.all([
        dashboardService.getDashboardStats('admin', false), // Don't use cache
        dashboardService.getPatientVisitsData('admin', 'monthly', false),
        dashboardService.getAppointments('admin', 'today', false),
        dashboardService.getSchedule('admin', undefined, false)
      ]);
      
      // Restore original env value
      if (useLocalMock) {
        // @ts-ignore - Ignoring type check as we're intentionally modifying env
        import.meta.env.VITE_USE_MOCK_DATA = originalEnvValue;
      }

      // Update state with fetched data
      setStats({
        patients: {
          total: dashboardStats.patients?.total || 0,
          newToday: dashboardStats.patients?.newToday || 0,
          trend: dashboardStats.patients?.trend || { value: 0, isPositive: true }
        },
        beds: {
          available: dashboardStats.beds?.available || 0,
          total: dashboardStats.beds?.total || 0,
          trend: dashboardStats.beds?.trend || { value: 0, isPositive: true }
        },
        appointments: {
          today: dashboardStats.appointments?.today || 0,
          trend: dashboardStats.appointments?.trend || { value: 0, isPositive: true }
        },
        revenue: {
          total: dashboardStats.revenue?.total || 0,
          trend: dashboardStats.revenue?.trend || { value: 0, isPositive: true }
        }
      });
      
      setVisits(visitsData);
      setAppointments(todayAppts);
      setSchedule(doctorSched);
      setLastUpdated(new Date());
      
      // Show toast message for user feedback
      if (useLocalMock) {
        toast.success("Dashboard updated with sample data");
      } else {
        toast.success("Dashboard updated with latest data from server");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Could not load dashboard data. Using default values.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(useMockData);
  }, [useMockData]);

  // Format revenue with currency symbol
  const formatRevenue = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format relative time for last updated timestamp
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Toggle data source between mock and real
  const toggleDataSource = () => {
    setUseMockData(!useMockData);
  };

  // Force a complete refresh from server
  const handleFullRefresh = async () => {
    setFullRefresh(true);
    
    // Clear all caches first
    clearDashboardCache();
    
    try {
      // Force API environment setting
      // @ts-ignore - Ignoring type check as we're intentionally modifying env
      const originalEnvValue = import.meta.env.VITE_USE_MOCK_DATA;
      // @ts-ignore
      import.meta.env.VITE_USE_MOCK_DATA = 'false';
      
      // Notify user
      toast.loading('Syncing with server...');
      
      // Run the fetch with cache disabled
      await fetchDashboardData(false);
      
      // Restore original env value
      // @ts-ignore
      import.meta.env.VITE_USE_MOCK_DATA = originalEnvValue;
      
      // Success message
      toast.dismiss();
      toast.success('Dashboard fully refreshed with latest data');
    } catch (error) {
      console.error('Full refresh failed:', error);
      toast.error('Could not refresh data from server');
    } finally {
      setFullRefresh(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-hospital-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Welcome back, {adminName}</h1>
          <p className="text-gray-600">Here's what's happening at MediCore today.</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex gap-2">
            <Button 
              onClick={() => fetchDashboardData(useMockData)} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={refreshing || fullRefresh}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            
            <Button
              onClick={toggleDataSource}
              variant={useMockData ? "default" : "outline"}
              className="flex items-center gap-2"
              title={useMockData ? "Using sample data" : "Using real data"}
              disabled={fullRefresh}
            >
              <Database className="h-4 w-4" />
              {useMockData ? 'Sample Data' : 'Real Data'}
            </Button>
            
            <Button
              onClick={handleFullRefresh}
              variant="outline"
              className="flex items-center gap-2 border-amber-500 text-amber-500 hover:bg-amber-50"
              disabled={fullRefresh}
              title="Force full refresh from server"
            >
              <RotateCcw className={`h-4 w-4 ${fullRefresh ? 'animate-spin' : ''}`} />
              {fullRefresh ? 'Syncing...' : 'Force Sync'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {formatRelativeTime(lastUpdated)}
            {useMockData && <span className="ml-1 text-amber-500 font-medium">(Using sample data)</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div onClick={() => navigate('/admin/patients')} className="cursor-pointer">
          <StatCard
            title="Total Patients"
            value={stats.patients.total.toLocaleString()}
            icon={<Users className="h-6 w-6" />}
            trend={{ value: stats.patients.trend.value, isPositive: stats.patients.trend.isPositive }}
          />
        </div>

        <div className="cursor-pointer group">
          <StatCard
            title="Available Beds"
            value={`${stats.beds.available}/${stats.beds.total}`}
            icon={<BedIcon className="h-6 w-6" />}
            trend={{ value: stats.beds.trend.value, isPositive: stats.beds.trend.isPositive }}
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
            value={stats.appointments.today.toString()}
            icon={<CalendarDays className="h-6 w-6" />}
            trend={{ value: stats.appointments.trend.value, isPositive: stats.appointments.trend.isPositive }}
          />
        </div>

        <div className="cursor-pointer group">
          <StatCard
            title="Revenue"
            value={formatRevenue(stats.revenue.total)}
            icon={<IndianRupee className="h-6 w-6" />}
            trend={{ value: stats.revenue.trend.value, isPositive: stats.revenue.trend.isPositive }}
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
          <PatientVisitsChart data={visits} />
        </div>
        <div>
          {isLoading ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <Loader className="h-8 w-8 animate-spin text-hospital-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Loading schedule...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="relative group">
              <DoctorSchedule schedule={schedule} />
              <div className="absolute top-0 right-0 mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  onClick={async () => {
                    setRefreshing(true);
                    try {
                      const doctorSched = await dashboardService.getSchedule('admin', undefined, false);
                      setSchedule(doctorSched);
                      setLastUpdated(new Date());
                      toast.success("Schedule updated");
                    } catch (error) {
                      console.error("Error refreshing schedule:", error);
                      toast.error("Could not refresh schedule");
                    } finally {
                      setRefreshing(false);
                    }
                  }}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  disabled={refreshing}
                  title="Refresh schedule"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Notifications and Quick Tasks Section */}
      <div className="mt-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white p-5 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Recent Notifications</h2>
                <Button variant="ghost" size="sm" className="text-hospital-primary">
                  Mark all as read
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border-l-4 border-hospital-primary rounded-r-md">
                  <div className="flex justify-between">
                    <span className="font-medium">System Update</span>
                    <span className="text-xs text-gray-500">Just now</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    New features have been added to the patient management system.
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-md">
                  <div className="flex justify-between">
                    <span className="font-medium">Medicine Stock Alert</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    5 medications are running low on stock. Please check inventory.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r-md">
                  <div className="flex justify-between">
                    <span className="font-medium">Staff Schedule Updated</span>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Monthly staff rotation schedule has been updated.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/admin/notifications" className="text-sm text-hospital-primary hover:text-hospital-accent">
                  View all notifications
                </Link>
              </div>
            </div>
          </div>
          
          {/* Quick Tasks Panel */}
          <div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Quick Tasks</h2>
              
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start text-left bg-hospital-primary hover:bg-hospital-accent"
                  onClick={() => navigate('/admin/appointments/create')}
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Schedule New Appointment
                </Button>
                
                <Button 
                  className="w-full justify-start text-left bg-hospital-primary hover:bg-hospital-accent"
                  onClick={() => navigate('/admin/patients/add')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Register New Patient
                </Button>
                
                <Button 
                  className="w-full justify-start text-left bg-hospital-primary hover:bg-hospital-accent"
                  onClick={() => navigate('/admin/inventory')}
                >
                  <BedIcon className="h-4 w-4 mr-2" />
                  Check Inventory
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <AppointmentList appointments={appointments} />
      </div>
    </div>
  );
};

export default Dashboard;
