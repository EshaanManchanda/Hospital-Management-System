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
    console.log("Request received for patient registration:", JSON.stringify(req.body, null, 2));
    
    // Extract user and patient data from request body
    const { 
      name, 
      email, 
      gender, 
      mobile, 
      password, 
      dateOfBirth,
      address,
      bloodGroup, 
      height, 
      weight,
      allergies,
      conditions,
      chronicDiseases,
      medications,
      surgeries,
      medicalHistory,
      emergencyContact,
      insurance,
      notes,
      status
    } = req.body;

    // Validate required fields
    if (!email) {
      console.log("Missing required field: email");
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    if (!name) {
      console.log("Missing required field: name");
      return res.status(400).json({ 
        success: false, 
        message: "Name is required" 
      });
    }

    // Debug log of the extracted values
    console.log("Extracted fields:", {
      name, email, gender, mobile, dateOfBirth,
      bloodGroup, height, weight,
      allergiesLength: allergies?.length,
      chronicDiseasesLength: chronicDiseases?.length || conditions?.length,
      medicationsLength: medications?.length
    });

    // Check if the user already exists
    console.log("Checking for existing user with email:", email);
    let existingUser = await User.findOne({ email });
    
    let userId;
    
    try {
      if (existingUser) {
        console.log("Existing user found:", existingUser._id);
        // If user exists but is not a patient, allow creating a patient profile
        const existingPatient = await Patient.findOne({ user: existingUser._id });
        if (existingPatient) {
          console.log("Patient already exists for this user");
          return res.status(400).json({ 
            success: false, 
            message: "Patient with this email already exists" 
          });
        }
        
        // Update existing user if needed
        if (name) existingUser.name = name;
        if (gender) existingUser.gender = gender;
        if (mobile) existingUser.mobile = mobile;
        if (dateOfBirth) existingUser.dateOfBirth = new Date(dateOfBirth);
        if (address) existingUser.address = address;
        
        console.log("Updating existing user with new data");
        await existingUser.save();
        userId = existingUser._id;
      } else {
        // Create a new user
        console.log("Creating new user with name:", name, "and email:", email);
        try {
          const newUser = new User({
            name,
            email,
            password: password || "password123",
            role: "patient",
            mobile,
            gender,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
            address
          });
          
          await newUser.save();
          userId = newUser._id;
          console.log("New user created with ID:", userId);
        } catch (userError) {
          console.error("Error creating user:", userError);
          return res.status(400).json({
            success: false,
            message: "Error creating user",
            error: userError.message
          });
        }
      }

      // Now create a patient record linked to the user
      console.log("Creating patient record for user:", userId);
      
      // Use either chronicDiseases or conditions based on what was provided
      const chronicConditions = chronicDiseases || conditions || [];
      
      // Prepare patient data
      const patientData = {
        user: userId,
        bloodGroup: bloodGroup || "O+",
        height: height || 170,
        weight: weight || 70,
        allergies: allergies || [],
        chronicDiseases: chronicConditions,
        medications: medications || [],
        medicalHistory: medicalHistory || [],
        emergencyContact: emergencyContact || {},
        insurance: insurance || {},
        notes: notes || "",
        isActive: status === "Inactive" ? false : true,
        status: status || "Active"
      };
      
      console.log("Patient data:", JSON.stringify(patientData, null, 2));
      
      const newPatient = new Patient(patientData);
      await newPatient.save();
      
      console.log("New patient created with ID:", newPatient._id);

      // Get the user details to include in response
      const user = await User.findById(userId).select('-password');

      return res.status(201).json({ 
        success: true, 
        message: "Patient registered successfully",
        data: {
          user,
          patient: newPatient
        }
      });
    } catch (specificError) {
      console.error("Specific error in patient registration:", specificError);
      return res.status(400).json({
        success: false,
        message: "Error in patient registration process",
        error: specificError.message
      });
    }
  } catch (error) {
    console.error("General error registering patient:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
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
import crypto from 'crypto';

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
      insuranceDetails,
      name,
      email,
      mobile,
      gender,
      dateOfBirth,
      address,
      password
    } = req.body;
    
    // Check if user exists
    let user = await User.findById(userId);

    if (!user) {
      // If user doesn't exist, create a new user with missing fields handled
      const newUserData = {
        name: name || 'Default Name',  // Provide a default name if missing
        email: email,
        mobile: mobile || '1234567890',  // Provide a default mobile number if missing
        gender: gender || 'male',  // Provide a default gender if missing
        dateOfBirth: dateOfBirth || new Date('2000-01-01'),  // Default date if missing
        address: address || { street: 'Default St', city: 'City', state: 'State', zipCode: '00000', country: 'Country' },
        password: crypto.randomBytes(8).toString('hex'),  // Generate a random password if missing
        role: 'patient',  // Default role as 'patient'
      };

      const newUser = await User.create(newUserData);
      user = newUser;  // Assign the newly created user to the user variable
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
      user: user._id,
      bloodGroup: bloodGroup || 'O+',  // Use the provided blood group or default to 'O+'
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
    const patient = await Patient.findById(req.params.id).populate('user');
    
    if (!patient) {
      return res.status(404).json({ 
        success: false,
        message: "Patient not found" 
      });
    }

    // Log the incoming request body for debugging
    console.log('Update request body:', req.body);
    
    // Update user fields if they exist in the request
    if (patient.user && req.body.user) {
      const userFields = req.body.user;
      const allowedUserFields = ['name', 'email', 'mobile', 'gender', 'dateOfBirth', 'address'];

      allowedUserFields.forEach(field => {
        if (userFields[field] !== undefined && userFields[field] !== null && userFields[field] !== '') {
          patient.user[field] = userFields[field];
        }
      });

      await patient.user.save();
    }

    // Update patient fields if they exist in the request
    const patientFields = [
      'height',
      'weight',
      'allergies',
      'notes',
      'status',
      'bloodGroup',  // Make sure this is included in the update list
      'chronicDiseases'
    ];

    patientFields.forEach(field => {
      const value = req.body[field];
      if (value !== undefined && value !== null && value !== '') {
        if (field === 'status') {
          patient.isActive = value === 'Active'; // Update the isActive flag based on the status
        } else {
          patient[field] = value;
        }
      }
    });

    // Handle emergency contact separately since it's an object
    if (req.body.emergencyContact) {
      const emergencyFields = ['name', 'relationship', 'phone'];
      patient.emergencyContact = patient.emergencyContact || {}; // Ensure the object exists

      emergencyFields.forEach(field => {
        if (
          req.body.emergencyContact[field] !== undefined && 
          req.body.emergencyContact[field] !== null && 
          req.body.emergencyContact[field] !== ''
        ) {
          patient.emergencyContact[field] = req.body.emergencyContact[field];
        }
      });
    }

    // Log the patient object before saving for debugging
    console.log('Patient object before save:', patient);

    const updatedPatient = await patient.save();
    
    // Fetch the updated patient with populated user data
    const populatedPatient = await Patient.findById(updatedPatient._id)
      .populate('user', 'name email mobile gender dateOfBirth address');
    
    // Log the response data for debugging
    console.log('Response data:', populatedPatient);

    res.status(200).json({ 
      success: true, 
      data: populatedPatient,
      message: 'Patient updated successfully'
    });
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

// Add this function to PatientController.js

// Get patient by user ID
export const getPatientByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }
    
    console.log(`Fetching patient with user ID: ${userId}`);
    
    const patient = await Patient.findOne({ user: userId })
      .populate({
        path: 'user',
        select: 'name email mobile gender dateOfBirth address'
      });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found for this user ID"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: patient,
      message: "Patient retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching patient by user ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
