import { User } from "../models/User.js";
import { Patient } from "../models/Patient.js";
import { Doctor } from "../models/Doctor.js";
import { Appointment } from "../models/Appointment.js";
import { Medicine } from "../models/Medicine.js";
import { MedicalRecord } from "../models/MedicalRecord.js";
import { Prescription } from "../models/Prescription.js";

// Get admin dashboard statistics
export const getAdminDashboardStats = async (req, res) => {
  try {
    // Only admin can access this endpoint
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to access admin dashboard" 
      });
    }

    // User statistics
    const totalUsers = await User.countDocuments();
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to object format for easier frontend use
    const usersCount = {};
    usersByRole.forEach(role => {
      usersCount[role._id] = role.count;
    });

    // Patient statistics
    const totalPatients = await Patient.countDocuments();
    
    // Get new patients in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newPatients = await Patient.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Doctor statistics
    const totalDoctors = await Doctor.countDocuments();
    
    // Get doctors by specialization
    const doctorsBySpecialization = await Doctor.aggregate([
      {
        $group: {
          _id: '$specialization',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Appointment statistics
    const totalAppointments = await Appointment.countDocuments();
    
    // Get appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
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
    
    const todayAppointments = await Appointment.countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    // Get appointments for the next 7 days
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingAppointments = await Appointment.countDocuments({
      date: {
        $gte: today,
        $lt: nextWeek
      }
    });

    // Medicine statistics
    const totalMedicines = await Medicine.countDocuments();
    const lowStockMedicines = await Medicine.countDocuments({
      $expr: { $lte: ['$stock', '$reorderLevel'] }
    });
    
    // Revenue statistics (mock data - would need to integrate with billing system)
    const revenue = {
      total: 150000,
      thisMonth: 15000,
      lastMonth: 12000,
      growth: 25 // percentage
    };

    // Medical records statistics
    const totalMedicalRecords = await MedicalRecord.countDocuments();
    const recordsByType = await MedicalRecord.aggregate([
      {
        $group: {
          _id: '$recordType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Return all statistics
    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          byRole: usersCount
        },
        patients: {
          total: totalPatients,
          new: newPatients
        },
        doctors: {
          total: totalDoctors,
          bySpecialization: doctorsBySpecialization
        },
        appointments: {
          total: totalAppointments,
          byStatus: appointmentsCount,
          today: todayAppointments,
          upcoming: upcomingAppointments
        },
        medicines: {
          total: totalMedicines,
          lowStock: lowStockMedicines
        },
        medicalRecords: {
          total: totalMedicalRecords,
          byType: recordsByType
        },
        revenue
      }
    });
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
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
    // Only patient can access their own dashboard
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
      status: 'scheduled'
    })
    .populate({
      path: 'doctor',
      populate: {
        path: 'user',
        select: 'name'
      }
    })
    .sort({ date: 1 })
    .limit(5);

    // Get prescriptions count
    const activePrescriptions = await Prescription.countDocuments({ 
      patient: patient._id,
      status: 'active'
    });

    // Get medical records count
    const medicalRecordsCount = await MedicalRecord.countDocuments({ patient: patient._id });

    // Get recent medical records
    const recentMedicalRecords = await MedicalRecord.find({ patient: patient._id })
      .sort({ date: -1 })
      .limit(5);

    // Return all statistics
    res.status(200).json({
      success: true,
      data: {
        patient: {
          name: req.user.name,
          bloodGroup: patient.bloodGroup,
          height: patient.height,
          weight: patient.weight
        },
        appointments: {
          total: totalAppointments,
          byStatus: appointmentsCount,
          upcoming: upcomingAppointments
        },
        prescriptions: {
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