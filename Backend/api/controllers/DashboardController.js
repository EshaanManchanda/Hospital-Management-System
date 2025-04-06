import { User } from "../models/User.js";
import { Patient } from "../models/Patient.js";
import { Doctor } from "../models/Doctor.js";
import { Appointment } from "../models/Appointment.js";
import { Medicine } from "../models/Medicine.js";
import { MedicalRecord } from "../models/MedicalRecord.js";
import { Prescription } from "../models/Prescription.js";
import { Bed } from "../models/Bed.js";
import { Revenue } from "../models/Revenue.js";

// Get admin dashboard statistics
export const getAdminDashboardStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    // Get current date
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Import models
    const User = (await import('../models/User.js')).User;
    const Patient = (await import('../models/Patient.js')).Patient;
    const Doctor = (await import('../models/Doctor.js')).Doctor;
    const Appointment = (await import('../models/Appointment.js')).Appointment;
    const Medicine = (await import('../models/Medicine.js')).Medicine;
    const MedicalRecord = (await import('../models/MedicalRecord.js')).MedicalRecord;
    const Prescription = (await import('../models/Prescription.js')).Prescription;
    const Bed = (await import('../models/Bed.js')).Bed;
    const Revenue = (await import('../models/Revenue.js')).Revenue;

    // Get statistics in parallel
    const [
      totalUsers,
      newPatientsToday,
      totalPatients,
      totalDoctors,
      doctorsOnDuty,
      appointmentsToday,
      totalAppointments,
      pendingAppointments,
      medicinesCount,
      lowStockMedicines,
      medicalRecordsCount,
      recentAppointments,
      bedStats,
      patientsByGender,
      revenueData
    ] = await Promise.all([
      User.countDocuments(),
      Patient.countDocuments({ createdAt: { $gte: startOfToday, $lte: endOfToday } }),
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Doctor.countDocuments({ isAvailable: true }),
      Appointment.countDocuments({ date: { $gte: startOfToday, $lte: endOfToday } }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Medicine.countDocuments(),
      Medicine.countDocuments({ stock: { $lt: 10 } }),
      MedicalRecord.countDocuments(),
      Appointment.find({ date: { $gte: startOfToday, $lte: endOfToday } })
        .sort({ date: 1 })
        .limit(5)
        .populate('patient', 'name contactNumber')
        .populate('doctor', 'name specialty'),
      Bed.getBedStats(),
      Patient.aggregate([
        {
          $group: {
            _id: '$gender',
            count: { $sum: 1 }
          }
        }
      ]),
      // Calculate revenue for the current month (mock data for now)
      {
        monthly: 12500,
        yearly: 156000,
        growth: 12.5,
        chartData: [
          { month: 'Jan', revenue: 10000 },
          { month: 'Feb', revenue: 11200 },
          { month: 'Mar', revenue: 10800 },
          { month: 'Apr', revenue: 11500 },
          { month: 'May', revenue: 12300 },
          { month: 'Jun', revenue: 12100 },
          { month: 'Jul', revenue: 11800 },
          { month: 'Aug', revenue: 12500 }
        ]
      }
    ]);

    // Format the gender data
    const formattedGenderData = {};
    patientsByGender.forEach(item => {
      formattedGenderData[item._id] = item.count;
    });

    // Calculate appointment statistics
    const appointmentCompletionRate = totalAppointments > 0 
      ? Math.round((totalAppointments - pendingAppointments) / totalAppointments * 100) 
      : 0;

    // Prepare response
    const dashboardStats = {
      users: {
        total: totalUsers,
        newToday: newPatientsToday
      },
      patients: {
        total: totalPatients,
        newToday: newPatientsToday,
        genderDistribution: formattedGenderData
      },
      doctors: {
        total: totalDoctors,
        onDuty: doctorsOnDuty,
        occupancyRate: totalDoctors > 0 ? Math.round((doctorsOnDuty / totalDoctors) * 100) : 0
      },
      appointments: {
        today: appointmentsToday,
        total: totalAppointments,
        pending: pendingAppointments,
        completionRate: appointmentCompletionRate
      },
      medicines: {
        total: medicinesCount,
        lowStock: lowStockMedicines
      },
      beds: bedStats,
      medicalRecords: {
        total: medicalRecordsCount
      },
      revenue: revenueData,
      recentAppointments
    };

    res.status(200).json(dashboardStats);
  } catch (error) {
    console.error('Error in getAdminDashboardStats:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get doctor dashboard statistics
export const getDoctorDashboardStats = async (req, res) => {
  try {
    // Only doctor can access this endpoint
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to access doctor dashboard" 
      });
    }

    // Find doctor profile
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor profile not found" 
      });
    }

    // Get doctor's appointments
    const totalAppointments = await Appointment.countDocuments({ doctor: doctor._id });
    
    // Get appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      {
        $match: { doctor: doctor._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Convert to object format
    const appointmentsCount = {};
    appointmentsByStatus.forEach(status => {
      appointmentsCount[status._id] = status.count;
    });
    
    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = await Appointment.find({
      doctor: doctor._id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('patient');
    
    // Get appointments for the next 7 days
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      date: {
        $gte: today,
        $lt: nextWeek
      }
    });

    // Get patient count
    const patientIds = await Appointment.distinct('patient', { doctor: doctor._id });
    const patientCount = patientIds.length;

    // Get prescriptions count
    const prescriptionsCount = await Prescription.countDocuments({ doctor: doctor._id });

    // Get medical records count
    const medicalRecordsCount = await MedicalRecord.countDocuments({ doctor: doctor._id });

    // Return all statistics
    res.status(200).json({
      success: true,
      data: {
        doctor: {
          name: req.user.name,
          specialization: doctor.specialization,
          experience: doctor.experience,
          averageRating: doctor.averageRating || 0
        },
        appointments: {
          total: totalAppointments,
          byStatus: appointmentsCount,
          today: todayAppointments,
          upcoming: upcomingAppointments
        },
        patients: patientCount,
        prescriptions: prescriptionsCount,
        medicalRecords: medicalRecordsCount
      }
    });
  } catch (error) {
    console.error("Error fetching doctor dashboard stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get patient dashboard statistics
export const getPatientDashboardStats = async (req, res) => {
  try {
    // Only patient can access this endpoint
    if (req.user.role !== 'patient') {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to access patient dashboard" 
      });
    }

    // Find patient profile
    const patient = await Patient.findOne({ user: req.user._id });
    
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: "Patient profile not found" 
      });
    }

    // Get patient's appointments
    const totalAppointments = await Appointment.countDocuments({ patient: patient._id });
    
    // Get appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      {
        $match: { patient: patient._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Convert to object format
    const appointmentsCount = {};
    appointmentsByStatus.forEach(status => {
      appointmentsCount[status._id] = status.count;
    });
    
    // Get upcoming appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingAppointments = await Appointment.find({
      patient: patient._id,
      date: { $gte: today },
      status: { $nin: ['completed', 'cancelled'] }
    }).populate('doctor').sort({ date: 1 }).limit(5);

    // Get prescriptions count
    const prescriptionsCount = await Prescription.countDocuments({ patient: patient._id });
    
    // Get active prescriptions
    const activePrescriptions = await Prescription.find({
      patient: patient._id,
      status: 'active'
    }).populate('doctor medications.medicine').limit(5);

    // Get medical records count
    const medicalRecordsCount = await MedicalRecord.countDocuments({ patient: patient._id });
    
    // Get recent medical records
    const recentMedicalRecords = await MedicalRecord.find({
      patient: patient._id
    }).sort({ date: -1 }).limit(5);

    // Return statistics
    res.status(200).json({
      success: true,
      data: {
        appointments: {
          total: totalAppointments,
          byStatus: appointmentsCount,
          upcoming: upcomingAppointments
        },
        prescriptions: {
          total: prescriptionsCount,
          active: activePrescriptions
        },
        medicalRecords: {
          total: medicalRecordsCount,
          recent: recentMedicalRecords
        }
      }
    });
  } catch (error) {
    console.error("Error fetching patient dashboard stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// New controller methods for admin dashboard

// Get summary statistics for admin dashboard
export const getAdminDashboardStatsSummary = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    // Get current date
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    
    // Import models
    const User = (await import('../models/User.js')).User;
    const Patient = (await import('../models/Patient.js')).Patient;
    const Doctor = (await import('../models/Doctor.js')).Doctor;
    const Appointment = (await import('../models/Appointment.js')).Appointment;
    const Bed = (await import('../models/Bed.js')).Bed;
    const Revenue = (await import('../models/Revenue.js')).Revenue;

    // Get statistics in parallel
    const [
      totalPatients,
      newPatientsToday,
      totalDoctors,
      doctorsOnDuty,
      appointmentsToday,
      totalAppointments,
      pendingAppointments,
      bedStats,
      revenueSummary
    ] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({ createdAt: { $gte: startOfToday, $lte: endOfToday } }),
      Doctor.countDocuments(),
      Doctor.countDocuments({ isAvailable: true }),
      Appointment.countDocuments({ date: { $gte: startOfToday, $lte: endOfToday } }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Bed.getBedStats(),
      Revenue.getCurrentMonthSummary(),
    ]);

    // Prepare response with summary data
    const dashboardSummary = {
      patients: {
        total: totalPatients,
        newToday: newPatientsToday,
        growth: totalPatients > 0 ? Math.round((newPatientsToday / totalPatients) * 100) : 0
      },
      doctors: {
        total: totalDoctors,
        onDuty: doctorsOnDuty,
        occupancyRate: totalDoctors > 0 ? Math.round((doctorsOnDuty / totalDoctors) * 100) : 0
      },
      appointments: {
        today: appointmentsToday,
        total: totalAppointments,
        pending: pendingAppointments,
        completionRate: totalAppointments > 0 ? Math.round(((totalAppointments - pendingAppointments) / totalAppointments) * 100) : 0
      },
      beds: {
        total: bedStats.total,
        available: bedStats.available,
        occupied: bedStats.occupied,
        occupancyRate: bedStats.occupancyRate
      },
      revenue: {
        currentMonth: revenueSummary.currentMonth.total,
        previousMonth: revenueSummary.previousMonth.total,
        growth: revenueSummary.growth
      }
    };

    res.status(200).json(dashboardSummary);
  } catch (error) {
    console.error('Error in getAdminDashboardStatsSummary:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get patient visits data for charts
export const getPatientVisitsData = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    // Import models
    const Appointment = (await import('../models/Appointment.js')).Appointment;

    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Get monthly patient visits for current year
    const startDate = new Date(currentYear, 0, 1); // January 1st
    const endDate = new Date(currentYear, 11, 31); // December 31st
    
    const monthlyVisits = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: { $in: ['completed', 'confirmed'] }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Format data for chart
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const chartData = months.map((month, index) => {
      const monthData = monthlyVisits.find(item => item._id === index + 1);
      return {
        month,
        visits: monthData ? monthData.count : 0
      };
    });

    res.status(200).json(chartData);
  } catch (error) {
    console.error('Error in getPatientVisitsData:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get today's appointments for admin dashboard
export const getTodayAppointments = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    // Import models
    const Appointment = (await import('../models/Appointment.js')).Appointment;

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    // Get today's appointments
    const appointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate('patient', 'name gender age contactNumber')
    .populate('doctor', 'name specialty')
    .sort({ date: 1 });
    
    // Format appointments for UI
    const formattedAppointments = appointments.map(appt => ({
      id: appt._id,
      patientName: appt.patient.name,
      patientAge: appt.patient.age,
      patientGender: appt.patient.gender,
      contactNumber: appt.patient.contactNumber,
      doctorName: appt.doctor.name,
      specialty: appt.doctor.specialty,
      time: new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: appt.status
    }));

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Error in getTodayAppointments:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get doctor schedule for admin dashboard
export const getDoctorSchedule = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    // Import models
    const Doctor = (await import('../models/Doctor.js')).Doctor;
    const Appointment = (await import('../models/Appointment.js')).Appointment;

    // Get current date
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    
    // Get all doctors
    const doctors = await Doctor.find({}, 'name specialty workingHours');
    
    // Get upcoming appointments for each doctor
    const doctorSchedules = await Promise.all(
      doctors.map(async (doctor) => {
        const appointments = await Appointment.find({
          doctor: doctor._id,
          date: { $gte: startOfDay, $lte: endOfWeek },
          status: { $in: ['pending', 'confirmed'] }
        })
        .populate('patient', 'name')
        .sort({ date: 1 })
        .limit(3);
        
        return {
          id: doctor._id,
          name: doctor.name,
          specialty: doctor.specialty,
          workingHours: doctor.workingHours,
          upcomingAppointments: appointments.map(appt => ({
            id: appt._id,
            patientName: appt.patient.name,
            date: appt.date,
            formattedDate: new Date(appt.date).toLocaleDateString(),
            formattedTime: new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: appt.status
          }))
        };
      })
    );

    res.status(200).json(doctorSchedules);
  } catch (error) {
    console.error('Error in getDoctorSchedule:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get admin profile data
export const getAdminProfile = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    // Get user information
    const admin = req.user;
    
    // Return admin profile with additional information
    res.status(200).json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin || new Date(),
      profileImage: admin.profileImage || null,
      notifications: [
        {
          id: 1,
          message: '5 new patient registrations today',
          timestamp: new Date(),
          read: false,
          type: 'info'
        },
        {
          id: 2,
          message: 'Monthly report is ready for review',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          read: false,
          type: 'important'
        },
        {
          id: 3,
          message: 'System maintenance scheduled for next Sunday',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          read: true,
          type: 'warning'
        }
      ],
      recentActivities: [
        {
          id: 1,
          action: 'Updated hospital policy',
          timestamp: new Date(Date.now() - 7200000) // 2 hours ago
        },
        {
          id: 2,
          action: 'Added new doctor',
          timestamp: new Date(Date.now() - 172800000) // 2 days ago
        },
        {
          id: 3,
          action: 'Approved patient discharge',
          timestamp: new Date(Date.now() - 259200000) // 3 days ago
        }
      ]
    });
  } catch (error) {
    console.error('Error in getAdminProfile:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
}; 