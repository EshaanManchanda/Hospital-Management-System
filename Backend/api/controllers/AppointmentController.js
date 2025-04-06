import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";
import { User } from "../models/User.js";

// Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    let query = {};
    
    // If user is a patient, only show their appointments
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    }
    
    // If user is a doctor, only show their appointments
    if (req.user.role === 'doctor') {
      // Find the doctor profile associated with this user
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (doctorProfile) {
        query.doctor = doctorProfile._id;
      }
    }
    
    const appointments = await Appointment.find(query)
      .populate({
        path: 'patient',
        select: 'name email mobile gender'
      })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name email mobile'
        }
      })
      .sort({ date: -1 });
      
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get a single appointment
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'patient',
        select: 'name email mobile gender'
      })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name email mobile'
        }
      });
      
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    
    // Check authorization
    if (
      req.user.role !== 'admin' && 
      appointment.patient._id.toString() !== req.user._id.toString() && 
      req.user.role !== 'doctor'
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to view this appointment" });
    }
    
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      time,
      type,
      description,
      symptoms
    } = req.body;
    
    // Set patient as the logged-in user if not admin
    let patientId = req.user._id;
    
    // If admin, they can create appointment for any patient
    if (req.user.role === 'admin' && req.body.patientId) {
      patientId = req.body.patientId;
    }
    
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    
    // Check if patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    
    // Check for time slot availability
    const appointmentDate = new Date(date);
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59))
      },
      time,
      status: { $nin: ['cancelled', 'no-show'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ success: false, message: "This time slot is already booked" });
    }
    
    // Create new appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      type,
      description,
      symptoms,
      paymentAmount: doctor.fee
    });
    
    // Add appointment to doctor's appointments
    doctor.appointments.push(appointment._id);
    await doctor.save();
    
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update an appointment
export const updateAppointment = async (req, res) => {
  try {
    const {
      date,
      time,
      status,
      type,
      description,
      symptoms,
      diagnosis,
      prescription,
      notes,
      followUpDate,
      paymentStatus,
      paymentAmount
    } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    
    // Check authorization
    // Patients can only update their own appointment and only certain fields
    if (req.user.role === 'patient') {
      if (appointment.patient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Not authorized to update this appointment" });
      }
      
      // Patients can only update certain fields
      if (date) appointment.date = date;
      if (time) appointment.time = time;
      if (type) appointment.type = type;
      if (description) appointment.description = description;
      if (symptoms) appointment.symptoms = symptoms;
      
      // If the patient is cancelling the appointment
      if (status === 'cancelled') {
        appointment.status = status;
      }
    } 
    // Doctors can update medical details
    else if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      
      if (!doctorProfile || appointment.doctor.toString() !== doctorProfile._id.toString()) {
        return res.status(403).json({ success: false, message: "Not authorized to update this appointment" });
      }
      
      // Doctors can update these fields
      if (status) appointment.status = status;
      if (diagnosis) appointment.diagnosis = diagnosis;
      if (prescription) appointment.prescription = prescription;
      if (notes) appointment.notes = notes;
      if (followUpDate) appointment.followUpDate = followUpDate;
    } 
    // Admins can update any field
    else if (req.user.role === 'admin') {
      if (date) appointment.date = date;
      if (time) appointment.time = time;
      if (status) appointment.status = status;
      if (type) appointment.type = type;
      if (description) appointment.description = description;
      if (symptoms) appointment.symptoms = symptoms;
      if (diagnosis) appointment.diagnosis = diagnosis;
      if (prescription) appointment.prescription = prescription;
      if (notes) appointment.notes = notes;
      if (followUpDate) appointment.followUpDate = followUpDate;
      if (paymentStatus) appointment.paymentStatus = paymentStatus;
      if (paymentAmount) appointment.paymentAmount = paymentAmount;
    }
    
    const updatedAppointment = await appointment.save();
    
    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    
    // Only admin can delete appointments
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Not authorized to delete appointments" });
    }
    
    await appointment.remove();
    
    res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get available time slots for a doctor on a specific date
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    
    // Define all possible time slots (typically 15 or 30 minute intervals)
    const allTimeSlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30'
    ];
    
    // Get the day of week for the requested date
    const appointmentDate = new Date(date);
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][appointmentDate.getDay()];
    
    // Check if doctor works on this day
    if (!doctor.workingDays.includes(dayOfWeek)) {
      return res.status(400).json({ success: false, message: `Doctor is not available on ${dayOfWeek}` });
    }
    
    // Get already booked appointments for that day
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59))
      },
      status: { $nin: ['cancelled', 'no-show'] }
    }).select('time');
    
    // Extract booked time slots
    const bookedTimeSlots = bookedAppointments.map(appointment => appointment.time);
    
    // Filter available time slots
    const availableTimeSlots = allTimeSlots.filter(timeSlot => !bookedTimeSlots.includes(timeSlot));
    
    res.status(200).json({ success: true, data: availableTimeSlots });
  } catch (error) {
    console.error("Error getting available time slots:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get appointments by doctor ID
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Check if user is authorized to view doctor's appointments
    if (req.user.role !== 'admin' && 
        req.user.role !== 'doctor' && 
        req.user._id.toString() !== doctorId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these appointments'
      });
    }
    
    // Build query object
    const query = { doctor: doctorId };
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }
    
    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }
    
    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get appointments with pagination
    const appointments = await Appointment.find(query)
      .populate({
        path: 'patient',
        select: 'name contactNumber email address dateOfBirth gender bloodGroup'
      })
      .populate({
        path: 'doctor',
        select: 'name specialization contactNumber email'
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Appointment.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        appointments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error getting doctor appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 