// controllers/patientController.js
import { Patient } from "../models/Patient.js";
import { User } from "../models/User.js";
import { Appointment } from "../models/Appointment.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import prescriptionRoute from '../routes/PrescriptionRoute.js'; // Ensure this path is correct

// Register a new patient
export const registerPatient = async (req, res) => {
  try {
    console.log("Request received:", req.body);
    const { name, email, gender, mobile, age, password, bloodGroup, height, weight } = req.body;

    // Check if the user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    // Create a new user first
    const newUser = await User.create({
      name,
      email,
      password: password || "password123", // Set a default password if not provided
      role: "patient",
      mobile,
      gender,
      dateOfBirth: new Date() // Add proper date of birth handling
    });

    // Now create a patient record linked to the user
    const newPatient = await Patient.create({
      user: newUser._id,
      bloodGroup: bloodGroup || "O+", // Default blood group if not provided
      height: height || 170, // Default height in cm
      weight: weight || 70, // Default weight in kg
      allergies: [],
      chronicDiseases: [],
      isActive: true
    });

    // Generate token for the new patient
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
      expiresIn: '30d',
    });

    res.status(201).json({ 
      success: true, 
      message: "Patient registered successfully", 
      token,
      patientId: newPatient._id, // Include patient ID directly in the response
      role: "patient",
      data: {
        user: {
          _id: newUser._id,
          userId: newUser.userId,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          gender: newUser.gender
        },
        patient: newPatient
      }
    });
  } catch (error) {
    console.error("Error registering patient:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    // For non-admin users, restrict access
    if (req.user && req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to access all patient records" 
      });
    }

    const patients = await Patient.find()
      .populate({
        path: 'user',
        select: 'userId name email mobile gender dateOfBirth address'
      })
      .populate({
        path: 'appointments',
        select: 'date time status type',
        options: { sort: { date: -1 }, limit: 5 }
      });
    
    // Format the response to include user details
    const formattedPatients = patients.map(patient => {
      const patientObj = patient.toObject();
      // Ensure user object exists
      if (!patientObj.user) {
        patientObj.user = { userId: 'Unknown', name: 'Unknown', email: 'Unknown' };
      }
      return patientObj;
    });
      
    res.status(200).json({ 
      success: true, 
      count: formattedPatients.length, 
      data: formattedPatients 
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get patient by ID
export const getPatientById = async (req, res) => {
  try {
    console.log("getPatientById called with ID:", req.params.id);
    console.log("Authenticated user:", req.user?._id);
    
    const patient = await Patient.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'userId name email mobile gender dateOfBirth profileImage address'
      })
      .populate({
        path: 'appointments',
        select: 'date time status type description doctor',
        populate: {
          path: 'doctor',
          select: 'specialization user',
          populate: {
            path: 'user',
            select: 'userId name'
          }
        }
      });
      
    if (!patient) {
      console.log("Patient not found with ID:", req.params.id);
      return res.status(404).json({ 
        success: false, 
        message: "Patient not found" 
      });
    }
    
    // Check if user is authorized to view this patient's data
    // Allow access if:
    // 1. User is an admin
    // 2. User is a doctor
    // 3. User is the patient themselves
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'doctor' && 
      patient.user._id.toString() !== req.user._id.toString()
    ) {
      console.log("User not authorized to view patient data. User ID:", req.user._id, "Patient User ID:", patient.user._id);
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to view this patient's data" 
      });
    }
    
    console.log("Patient data successfully retrieved");
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Login a patient
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the patient by email
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deletePatient = async (req, res) => {
  const { patientId } = req.body;

  const patient = await Patient.deleteOne({ _id: patientId });

  console.log(patient);

  if (!patient) {
    return res.status(400).json({
      success: false,
      message: "Patient not found",
    });
  }

  return res.status();
};

// Create patient profile
export const createPatient = async (req, res) => {
  try {
    const {
      userId,
      bloodGroup,
      height,
      weight,
      allergies,
      chronicDiseases,
      emergencyContact,
      insuranceDetails
    } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // Check if patient profile already exists
    const existingPatient = await Patient.findOne({ user: userId });
    if (existingPatient) {
      return res.status(400).json({ 
        success: false, 
        message: "Patient profile already exists" 
      });
    }
    
    // Create patient profile
    const patient = await Patient.create({
      user: userId,
      bloodGroup,
      height,
      weight,
      allergies: allergies || [],
      chronicDiseases: chronicDiseases || [],
      emergencyContact,
      insuranceDetails
    });
    
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Update patient profile
export const updatePatient = async (req, res) => {
  try {
    const {
      bloodGroup,
      height,
      weight,
      allergies,
      chronicDiseases,
      emergencyContact,
      insuranceDetails
    } = req.body;
    
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: "Patient not found" 
      });
    }
    
    // Check if user is authorized to update this patient
    if (
      req.user.role !== 'admin' && 
      patient.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to update this patient" 
      });
    }
    
    // Update fields
    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (height) patient.height = height;
    if (weight) patient.weight = weight;
    if (allergies) patient.allergies = allergies;
    if (chronicDiseases) patient.chronicDiseases = chronicDiseases;
    if (emergencyContact) {
      patient.emergencyContact = {
        ...patient.emergencyContact,
        ...emergencyContact
      };
    }
    if (insuranceDetails) {
      patient.insuranceDetails = {
        ...patient.insuranceDetails,
        ...insuranceDetails
      };
    }
    
    const updatedPatient = await patient.save();
    
    res.status(200).json({ success: true, data: updatedPatient });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Add medical history to patient
export const addMedicalHistory = async (req, res) => {
  try {
    const { diagnosis, treatment, doctorId, notes } = req.body;
    
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: "Patient not found" 
      });
    }
    
    // Only doctors and admins can add medical history
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to add medical history" 
      });
    }
    
    // Create new medical history entry
    const medicalHistoryEntry = {
      diagnosis,
      treatment,
      doctor: doctorId,
      date: new Date(),
      notes
    };
    
    patient.medicalHistory.push(medicalHistoryEntry);
    await patient.save();
    
    res.status(200).json({ 
      success: true, 
      data: patient.medicalHistory[patient.medicalHistory.length - 1] 
    });
  } catch (error) {
    console.error("Error adding medical history:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Add medication to patient
export const addMedication = async (req, res) => {
  try {
    const { name, dosage, frequency, startDate, endDate, prescribedBy } = req.body;
    
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: "Patient not found" 
      });
    }
    
    // Only doctors and admins can add medications
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to add medications" 
      });
    }
    
    // Create new medication entry
    const medicationEntry = {
      name,
      dosage,
      frequency,
      startDate,
      endDate,
      prescribedBy
    };
    
    patient.medications.push(medicationEntry);
    await patient.save();
    
    res.status(200).json({ 
      success: true, 
      data: patient.medications[patient.medications.length - 1] 
    });
  } catch (error) {
    console.error("Error adding medication:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Add medical report to patient
export const addMedicalReport = async (req, res) => {
  try {
    const { title, type, file, notes } = req.body;
    
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: "Patient not found" 
      });
    }
    
    // Check authorization
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'doctor' && 
      patient.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to add medical reports" 
      });
    }
    
    // Create new report entry
    const reportEntry = {
      title,
      type,
      file,
      uploadedDate: new Date(),
      notes
    };
    
    patient.reports.push(reportEntry);
    await patient.save();
    
    res.status(200).json({ 
      success: true, 
      data: patient.reports[patient.reports.length - 1] 
    });
  } catch (error) {
    console.error("Error adding medical report:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get patient statistics (for dashboard)
export const getPatientStats = async (req, res) => {
  try {
    // Only accessible by admins
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to access patient statistics" 
      });
    }

    const totalPatients = await Patient.countDocuments();
    
    // Get new patients in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newPatients = await Patient.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get total appointments
    const totalAppointments = await Appointment.countDocuments();
    
    // Get appointments in the last 30 days
    const recentAppointments = await Appointment.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get appointment status counts
    const appointmentStatusCounts = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format the appointment status counts
    const appointmentStats = {};
    appointmentStatusCounts.forEach(item => {
      appointmentStats[item._id] = item.count;
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        newPatients,
        totalAppointments,
        recentAppointments,
        appointmentStats
      }
    });
  } catch (error) {
    console.error("Error getting patient stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get patients by doctor ID
export const getDoctorPatients = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10, search } = req.query;
    
    // Check if user is authorized to view doctor's patients
    if (req.user.role !== 'admin' && 
        req.user.role !== 'doctor' && 
        req.user._id.toString() !== doctorId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these patients'
      });
    }
    
    // Get unique patient IDs from appointments with this doctor
    const appointments = await Appointment.find({ doctor: doctorId });
    const patientIds = [...new Set(appointments.map(app => app.patient))];
    
    // Build query for patients
    let query = { _id: { $in: patientIds } };
    
    // Add search filter if provided
    if (search) {
      query = {
        ...query,
        $or: [
          { 'name': { $regex: search, $options: 'i' } },
          { 'email': { $regex: search, $options: 'i' } },
          { 'contactNumber': { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get patients with pagination
    const patients = await Patient.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Patient.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        patients,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error getting doctor patients:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
