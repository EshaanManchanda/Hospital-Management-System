import api from '../utils/api';

/**
 * Service for admin dashboard related API calls
 */
const adminService = {
  /**
   * Get summary statistics for the admin dashboard
   * @returns {Promise<Object>} Dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/dashboard/admin/stats');
      
      // Transform the API response to match the expected format
      return {
        patients: {
          total: response.data.patients.total,
          trend: { 
            value: response.data.patients.growth,
            isPositive: response.data.patients.growth >= 0
          }
        },
        beds: {
          available: response.data.beds.available,
          total: response.data.beds.total,
          trend: { 
            value: Math.abs(response.data.beds.occupancyRate),
            isPositive: response.data.beds.available > 0
          }
        },
        appointments: {
          today: response.data.appointments.today,
          trend: { 
            value: response.data.appointments.completionRate,
            isPositive: response.data.appointments.completionRate >= 0
          }
        },
        revenue: {
          total: response.data.revenue.currentMonth,
          trend: { 
            value: response.data.revenue.growth,
            isPositive: response.data.revenue.growth >= 0
          }
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // For development/demo purposes, return mock data if API fails
      return {
        patients: {
          total: 3721,
          trend: { value: 12, isPositive: true }
        },
        beds: {
          available: 48,
          total: 60,
          trend: { value: 8, isPositive: false }
        },
        appointments: {
          today: 24,
          trend: { value: 5, isPositive: true }
        },
        revenue: {
          total: 23485,
          trend: { value: 14, isPositive: true }
        }
      };
    }
  },

  /**
   * Get patient visits data for charts
   * @returns {Promise<Array>} Patient visits data by month
   */
  getPatientVisitsData: async () => {
    try {
      const response = await api.get('/api/dashboard/admin/patient-visits');
      
      // Transform data to match chart component expectations if needed
      return response.data.map(item => ({
        name: item.month,
        visits: item.visits
      }));
    } catch (error) {
      console.error('Error fetching patient visits data:', error);
      
      // For development/demo purposes, return mock data if API fails
      return [
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
    }
  },

  /**
   * Get today's appointments for the dashboard
   * @returns {Promise<Array>} Today's appointments
   */
  getTodayAppointments: async () => {
    try {
      const response = await api.get('/api/dashboard/admin/appointments/today');
      
      // Use the data directly as it should already be in the right format
      return response.data.map(appointment => ({
        id: appointment.id,
        patientName: appointment.patientName,
        patientAge: appointment.patientAge,
        patientGender: appointment.patientGender,
        contactNumber: appointment.contactNumber,
        doctorName: appointment.doctorName,
        specialty: appointment.specialty,
        time: appointment.time,
        status: appointment.status,
        type: appointment.type || 'Check-up'
      }));
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
      
      // For development/demo purposes, return mock data if API fails
      return [
        {
          id: "1",
          patientName: "Sarah Johnson",
          time: "09:00 AM",
          status: "completed",
          type: "Check-up"
        },
        {
          id: "2",
          patientName: "Mike Peterson",
          time: "10:30 AM",
          status: "completed",
          type: "Follow-up"
        },
        {
          id: "3",
          patientName: "Emily Williams",
          time: "11:45 AM",
          status: "in-progress",
          type: "Consultation"
        },
        {
          id: "4",
          patientName: "Robert Thompson",
          time: "02:15 PM",
          status: "scheduled",
          type: "Check-up"
        },
        {
          id: "5",
          patientName: "Linda Garcia",
          time: "04:00 PM",
          status: "scheduled",
          type: "X-Ray"
        }
      ];
    }
  },

  /**
   * Get doctor schedule for the dashboard
   * @returns {Promise<Array>} Doctor schedule
   */
  getDoctorSchedule: async () => {
    try {
      const response = await api.get('/api/dashboard/admin/doctor-schedule');
      
      // Transform the API response to match the expected format in the frontend
      // We need to flatten the structure a bit
      const flattenedSchedule = [];
      
      response.data.forEach(doctor => {
        if (doctor.upcomingAppointments && doctor.upcomingAppointments.length > 0) {
          doctor.upcomingAppointments.forEach(appt => {
            flattenedSchedule.push({
              id: appt.id,
              doctorName: doctor.name,
              doctorSpecialty: doctor.specialty,
              patientName: appt.patientName,
              time: appt.formattedTime,
              type: appt.type || 'Consultation',
              date: appt.formattedDate,
              isNext: appt.isNext || false
            });
          });
        }
      });
      
      // Sort by time and limit to first 5
      return flattenedSchedule
        .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
        .slice(0, 5);
    } catch (error) {
      console.error('Error fetching doctor schedule:', error);
      
      // For development/demo purposes, return mock data if API fails
      return [
        {
          id: "1",
          time: "11:45 AM - 12:15 PM",
          patientName: "Emily Williams",
          doctorName: "Dr. Michael Brown",
          doctorSpecialty: "Cardiology",
          type: "Consultation",
          isNext: true
        },
        {
          id: "2",
          time: "02:15 PM - 02:45 PM",
          patientName: "Robert Thompson",
          doctorName: "Dr. Sarah Miller",
          doctorSpecialty: "Neurology",
          type: "Check-up"
        },
        {
          id: "3",
          time: "04:00 PM - 04:30 PM",
          patientName: "Linda Garcia",
          doctorName: "Dr. David Wilson",
          doctorSpecialty: "Radiology",
          type: "X-Ray"
        }
      ];
    }
  },
  
  /**
   * Get admin profile data
   * @returns {Promise<Object>} Admin profile data
   */
  getAdminProfile: async () => {
    try {
      const response = await api.get('/api/dashboard/admin/profile');
      
      return {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        department: "Administration",
        lastLogin: response.data.lastLogin,
        profileImage: response.data.profileImage,
        notifications: response.data.notifications || [],
        recentActivities: response.data.recentActivities || []
      };
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      
      // For development/demo purposes, return mock data if API fails
      return {
        name: "Dr. John Doe",
        role: "Admin",
        email: "john.doe@hospital.com",
        department: "Administration"
      };
    }
  },

  /**
   * Get revenue data for the admin revenue dashboard
   * @returns {Promise<Object>} Revenue data
   */
  getRevenueSummary: async () => {
    try {
      const response = await api.get('/api/revenue/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue summary:', error);
      
      // For development/demo purposes, return mock data if API fails
      return {
        currentMonth: {
          total: 23485,
          count: 145,
          month: "August"
        },
        previousMonth: {
          total: 20500,
          count: 132,
          month: "July"
        },
        growth: 14.56,
        bySource: [
          { _id: "Appointment", totalAmount: 8350, count: 85 },
          { _id: "Medicine", totalAmount: 6275, count: 32 },
          { _id: "Lab", totalAmount: 4200, count: 18 },
          { _id: "Bed", totalAmount: 3750, count: 8 },
          { _id: "Surgery", totalAmount: 910, count: 2 }
        ]
      };
    }
  },

  /**
   * Get monthly revenue data for a specific year
   * @param {number} year - The year to get data for
   * @returns {Promise<Array>} Monthly revenue data
   */
  getMonthlyRevenue: async (year = new Date().getFullYear()) => {
    try {
      const response = await api.get(`/api/revenue/monthly?year=${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      
      // For development/demo purposes, return mock data if API fails
      return [
        { month: "01", totalAmount: 10000, count: 95 },
        { month: "02", totalAmount: 11200, count: 105 },
        { month: "03", totalAmount: 10800, count: 98 },
        { month: "04", totalAmount: 11500, count: 110 },
        { month: "05", totalAmount: 12300, count: 118 },
        { month: "06", totalAmount: 12100, count: 115 },
        { month: "07", totalAmount: 20500, count: 132 },
        { month: "08", totalAmount: 23485, count: 145 }
      ];
    }
  },

  /**
   * Get revenue data broken down by source
   * @param {Date} startDate - Start date for the range
   * @param {Date} endDate - End date for the range
   * @returns {Promise<Array>} Revenue data by source
   */
  getRevenueBySource: async (startDate, endDate) => {
    try {
      const response = await api.get(`/api/revenue/by-source?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue by source:', error);
      
      // For development/demo purposes, return mock data if API fails
      return [
        { _id: "Appointment", totalAmount: 8350, count: 85 },
        { _id: "Medicine", totalAmount: 6275, count: 32 },
        { _id: "Lab", totalAmount: 4200, count: 18 },
        { _id: "Bed", totalAmount: 3750, count: 8 },
        { _id: "Surgery", totalAmount: 910, count: 2 }
      ];
    }
  }
};

export default adminService; 