import { Doctor } from "../models/Doctor.js";
import { User } from "../models/User.js";
import { Patient } from "../models/Patient.js";
import { Appointment } from "../models/Appointment.js";
import { MedicalRecord } from "../models/MedicalRecord.js";

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate({
        path: 'user',
        select: 'name email mobile gender profileImage'
      });
      
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get a single doctor
export const getDoctorById = async (req, res) => {
  try {
    console.log("getDoctorById called with ID:", req.params.id);
    console.log("Authenticated user:", req.user?._id);
    
    const doctorId = req.params.id;
    
    // First try to find doctor by _id
    let doctor = await Doctor.findById(doctorId)
      .populate({
        path: 'user',
        select: 'name email mobile gender profileImage'
      })
      .populate({
        path: 'appointments',
        select: 'date time status'
      });
      
    // If not found by doctor ID, check if it's a valid user ID
    if (!doctor) {
      console.log("Doctor not found with ID:", doctorId);      
      
      // Check if this is a valid user ID with role 'doctor'
      const user = await User.findById(doctorId);
      
      console.log("No valid doctor record found");
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    
    // Check if user is authorized to view this doctor's data
    // Allow access if:
    // 1. User is an admin
    // 2. User is the doctor themselves
    // 3. User is a patient (patients can view doctor profiles)
    if (req.user && 
        req.user.role !== 'admin' && 
        doctor.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'patient') {
      console.log("User not authorized to view doctor data. User ID:", req.user._id, "Doctor User ID:", doctor.user._id);
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to view this doctor's data" 
      });
    }
    
    console.log("Doctor data successfully retrieved");
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Create a doctor profile
export const createDoctor = async (req, res) => {
  try {
    const {
      userId,
      // User fields if creating a new user
      name,
      email,
      password,
      mobile,
      gender,
      dateOfBirth,
      // Doctor profile fields
      specialization,
      experience,
      fee,
      about,
      workingHours,
      workingDays,
      qualifications
    } = req.body;
    
    // Validate doctor fields first
    if (!specialization) {
      return res.status(400).json({ 
        success: false, 
        message: "Specialization is required" 
      });
    }
    
    if (!experience) {
      return res.status(400).json({ 
        success: false, 
        message: "Experience is required" 
      });
    }
    
    if (!fee) {
      return res.status(400).json({ 
        success: false, 
        message: "Fee is required" 
      });
    }
    
    if (!about) {
      return res.status(400).json({ 
        success: false, 
        message: "About information is required" 
      });
    }
    
    // Before proceeding, ensure we have the email field for user checks
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for creating or finding a user"
      });
    }
    
    let user = null;
    
    // Try to find the user in different ways:
    // 1. By userId if provided
    // 2. By email if userId not provided or not found
    // 3. Create a new user if no existing user found
    
    // Step 1: Try to find by userId if provided
    if (userId) {
      user = await User.findById(userId);
    }
    
    // Step 2: If user not found by ID or ID not provided, try by email
    if (!user && email) {
      user = await User.findOne({ email });
    }
    
    // Step 3: If user is found, update their role if needed
    if (user) {
      if (user.role !== 'doctor') {
        user.role = 'doctor';
        
        // Optionally update other user fields if provided
        if (name) user.name = name;
        if (mobile) user.mobile = mobile;
        if (gender) user.gender = gender;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        
        await user.save();
      }
    } 
    // Step 4: If no user found, create a new one
    else {
      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Password is required to create a new user"
        });
      }
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Name is required to create a new user"
        });
      }
      
      try {
        user = await User.create({
          name,
          email,
          password,
          role: 'doctor',
          mobile: mobile || '',
          gender: gender || '',
          dateOfBirth: dateOfBirth || new Date()
        });
      } catch (userError) {
        return res.status(400).json({ 
          success: false, 
          message: "Error creating user", 
          error: userError.message 
        });
      }
    }
    
    // Check if doctor profile already exists for this user
    const existingDoctor = await Doctor.findOne({ user: user._id });
    if (existingDoctor) {
      // Update the existing doctor profile with new information
      if (specialization) existingDoctor.specialization = specialization;
      if (experience) existingDoctor.experience = Number(experience);
      if (fee) existingDoctor.fee = Number(fee);
      if (about) existingDoctor.about = about;
      if (workingHours) existingDoctor.workingHours = workingHours;
      if (workingDays) existingDoctor.workingDays = workingDays;
      if (qualifications) existingDoctor.qualifications = qualifications;
      
      await existingDoctor.save();
      
      // Populate user information
      await existingDoctor.populate({
        path: 'user',
        select: 'userId name email mobile gender profileImage'
      });
      
      return res.status(200).json({ 
        success: true, 
        message: "Doctor profile updated successfully",
        data: existingDoctor
      });
    }
    
    // Create new doctor profile
    try {
      const doctor = await Doctor.create({
        user: user._id,
        specialization,
        experience: Number(experience),
        fee: Number(fee),
        about,
        workingHours: workingHours || { start: "09:00", end: "17:00" },
        workingDays: workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        qualifications: qualifications || [],
        isAvailable: true
      });
      
      // Populate user information
      await doctor.populate({
        path: 'user',
        select: 'userId name email mobile gender profileImage'
      });
      
      res.status(201).json({ 
        success: true, 
        message: "Doctor created successfully",
        data: doctor 
      });
    } catch (doctorError) {
      return res.status(400).json({ 
        success: false, 
        message: "Error creating doctor profile", 
        error: doctorError.message 
      });
    }
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Update a doctor profile
export const updateDoctor = async (req, res) => {
  try {
    console.log("updateDoctor called with ID:", req.params.id);
    console.log("Update data received:", req.body);
    
    const doctorId = req.params.id;
    
    if (!doctorId) {
      return res.status(400).json({ 
        success: false, 
        message: "Doctor ID is required" 
      });
    }
    
    // Extract user-specific fields
    const userFields = {};
    if (req.body.user) {
      if (req.body.user.name) userFields.name = req.body.user.name;
      if (req.body.user.email) userFields.email = req.body.user.email;
      if (req.body.user.mobile) userFields.mobile = req.body.user.mobile;
      if (req.body.user.gender) userFields.gender = req.body.user.gender;
      if (req.body.user.address) userFields.address = req.body.user.address;
    }
    
    // First check if it's a doctor ID
    let doctor = await Doctor.findById(doctorId);
    
    // If not found as doctor, check if it's a user ID with role 'doctor'
    if (!doctor) {
      console.log("Doctor not found, checking if it's a user ID with role 'doctor'");
      const user = await User.findById(doctorId);
      
      // If user exists and has role 'doctor', create a doctor record
      if (user && user.role === 'doctor') {
        console.log("Found user with doctor role but no doctor record:", user._id);
        
        try {
          // Create a new doctor record for this user
          doctor = await Doctor.create({
            user: user._id,
            specialization: req.body.specialization || "General Physician",
            experience: req.body.experience || 0,
            fee: req.body.fee || 0,
            about: req.body.about || "Doctor information pending update",
            workingHours: req.body.workingHours || { start: "09:00", end: "17:00" },
            workingDays: req.body.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            qualifications: req.body.qualifications || [],
            isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true
          });
          
          console.log("Created new doctor record for user:", doctor._id);
        } catch (createError) {
          console.error("Error creating doctor record for user:", createError);
          return res.status(500).json({
            success: false,
            message: "Failed to create doctor record for user",
            error: createError.message
          });
        }
      } else {
        // Neither a doctor nor a user with doctor role
        return res.status(404).json({ 
          success: false, 
          message: "Doctor not found" 
        });
      }
    }

    // At this point we have a valid doctor record
    const doctorUpdateData = {};
    
    // Map fields from request to update object for doctor model
    if (req.body.specialization) doctorUpdateData.specialization = req.body.specialization;
    if (req.body.experience) doctorUpdateData.experience = Number(req.body.experience);
    if (req.body.fee) doctorUpdateData.fee = Number(req.body.fee);
    if (req.body.about) doctorUpdateData.about = req.body.about;
    if (req.body.workingHours) doctorUpdateData.workingHours = req.body.workingHours;
    if (req.body.workingDays) doctorUpdateData.workingDays = req.body.workingDays;
    if (req.body.qualifications) doctorUpdateData.qualifications = req.body.qualifications;
    if (req.body.isAvailable !== undefined) doctorUpdateData.isAvailable = req.body.isAvailable;

    // Log what we're updating for debugging
    console.log('Doctor ID:', doctorId);
    console.log('Doctor update data:', doctorUpdateData);
    console.log('User update data:', userFields);
    
    // Update doctor using findByIdAndUpdate
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctor._id,
      doctorUpdateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Failed to update doctor"
      });
    }

    // If we have user fields to update, update the user record as well
    let updatedUser = null;
    if (Object.keys(userFields).length > 0) {
      try {
        // Find the associated user
        const user = await User.findById(doctor.user);
        if (user) {
          // Update user fields
          Object.keys(userFields).forEach(key => {
            user[key] = userFields[key];
          });
          updatedUser = await user.save();
          console.log("User updated successfully:", updatedUser._id);
        }
      } catch (userError) {
        console.error("Error updating user:", userError);
        // We still continue if user update fails, just log the error
      }
    }
    
    // Retrieve the fully populated doctor record with all fields from both models
    const populatedDoctor = await Doctor.findById(updatedDoctor._id)
      .populate({
        path: 'user',
        select: '-password -__v' // Get all user fields except password and __v
      });
    
    if (!populatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor updated but could not retrieve the updated data"
      });
    }
    
    // Build a complete response that includes all user and doctor data
    const responseData = {
      // Doctor model fields
      _id: populatedDoctor._id,
      specialization: populatedDoctor.specialization,
      experience: populatedDoctor.experience,
      fee: populatedDoctor.fee,
      about: populatedDoctor.about,
      workingHours: populatedDoctor.workingHours,
      workingDays: populatedDoctor.workingDays,
      qualifications: populatedDoctor.qualifications,
      isAvailable: populatedDoctor.isAvailable,
      ratings: populatedDoctor.ratings,
      appointments: populatedDoctor.appointments,
      
      // User model fields (flattened)
      userId: populatedDoctor.user._id,
      name: populatedDoctor.user.name,
      email: populatedDoctor.user.email,
      mobile: populatedDoctor.user.mobile,
      gender: populatedDoctor.user.gender,
      dateOfBirth: populatedDoctor.user.dateOfBirth,
      address: populatedDoctor.user.address,
      profileImage: populatedDoctor.user.profileImage,
      role: populatedDoctor.user.role,
      
      // Include the full user object for reference if needed
      user: populatedDoctor.user
    };
    
    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: responseData
    });
    
  } catch (error) {
    console.error("Error updating doctor:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// Delete a doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    
    // Only admin can delete doctor profiles
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Not authorized to delete this doctor" });
    }
    
    await doctor.remove();
    
    res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Add rating to doctor
export const addDoctorRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    
    // Check if user has already rated this doctor
    const hasRated = doctor.ratings.find(
      r => r.patient.toString() === req.user._id.toString()
    );
    
    if (hasRated) {
      // Update existing rating
      doctor.ratings = doctor.ratings.map(r => 
        r.patient.toString() === req.user._id.toString() 
          ? { rating, review, patient: req.user._id, date: Date.now() } 
          : r
      );
    } else {
      // Add new rating
      doctor.ratings.push({
        rating,
        review,
        patient: req.user._id,
        date: Date.now()
      });
    }
    
    await doctor.save();
    
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get doctor's own profile
export const getMyProfile = async (req, res) => {
  try {
    console.log("getMyProfile called for user:", req.user?._id);
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    
    // Find doctor profile associated with the authenticated user
    let doctor = await Doctor.findOne({ user: req.user._id })
      .populate({
        path: 'user',
        select: 'name email mobile gender profileImage'
      })
      .populate({
        path: 'appointments',
        select: 'date time status'
      });
    
    // If no doctor profile exists, return error
    if (!doctor) {
      console.log("No doctor profile found for user:", req.user._id);
      return res.status(404).json({ 
        success: false, 
        message: "Doctor profile not found for this user" 
      });
    }
    
    console.log("Doctor profile successfully retrieved");
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get doctor's patients
export const getDoctorPatients = async (req, res) => {
  try {
    console.log("getDoctorPatients called for user:", req.user?._id);
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    
    // Find doctor profile associated with the authenticated user
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor) {
      console.log("No doctor profile found for user:", req.user._id);
      return res.status(404).json({ 
        success: false, 
        message: "Doctor profile not found for this user" 
      });
    }
    
    // Find all appointments for this doctor
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate({
        path: 'patient',
        populate: {
          path: 'user',
          select: 'name email mobile gender profileImage'
        }
      })
      .sort({ date: -1 });
    
    // Extract unique patients from appointments
    const patientMap = new Map();
    
    appointments.forEach(appointment => {
      if (appointment.patient && !patientMap.has(appointment.patient._id.toString())) {
        const patient = appointment.patient;
        const user = patient.user;
        
        // Format patient data
        patientMap.set(patient._id.toString(), {
          id: patient._id,
          patientId: patient._id,
          name: user?.name || 'Unknown Patient',
          email: user?.email || '',
          phone: user?.mobile || '',
          gender: user?.gender || '',
          profileImage: user?.profileImage || '',
          age: patient.age || '',
          bloodGroup: patient.bloodGroup || '',
          diagnosis: patient.diagnosis || '',
          lastVisit: appointment.date,
          nextAppointment: appointments.find(a => 
            a.patient?._id.toString() === patient._id.toString() && 
            new Date(a.date) > new Date() &&
            a.status !== 'cancelled'
          )?.date || null
        });
      }
    });
    
    // Convert map to array
    const patients = Array.from(patientMap.values());
    
    console.log(`Found ${patients.length} patients for doctor ${doctor._id}`);
    res.status(200).json({ 
      success: true, 
      count: patients.length,
      patients
    });
  } catch (error) {
    console.error("Error fetching doctor's patients:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get specific patient details for doctor
export const getPatientDetails = async (req, res) => {
  try {
    console.log("getPatientDetails called for patient:", req.params.patientId);
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    
    // Find doctor profile associated with the authenticated user
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor) {
      console.log("No doctor profile found for user:", req.user._id);
      return res.status(404).json({ 
        success: false, 
        message: "Doctor profile not found for this user" 
      });
    }
    
    // Get patient ID from params
    const patientId = req.params.patientId;
    
    // Find the patient
    const patient = await Patient.findById(patientId)
      .populate({
        path: 'user',
        select: 'name email mobile gender profileImage address'
      });
    
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: "Patient not found" 
      });
    }
    
    // Check if this doctor has appointments with this patient
    const appointments = await Appointment.find({
      doctor: doctor._id,
      patient: patient._id
    }).sort({ date: -1 });
    
    if (appointments.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to view this patient's details" 
      });
    }
    
    // Get medical records for this patient
    const medicalRecords = await MedicalRecord.find({
      patient: patient._id,
      doctor: doctor._id
    }).sort({ createdAt: -1 });
    
    // Format patient data with appointments and medical records
    const patientData = {
      id: patient._id,
      patientId: patient._id,
      name: patient.user?.name || 'Unknown Patient',
      email: patient.user?.email || '',
      phone: patient.user?.mobile || '',
      gender: patient.user?.gender || '',
      address: patient.user?.address || '',
      profileImage: patient.user?.profileImage || '',
      age: patient.age || '',
      bloodGroup: patient.bloodGroup || '',
      diagnosis: patient.diagnosis || '',
      allergies: patient.allergies || [],
      medicalHistory: patient.medicalHistory || '',
      lastVisit: appointments[0]?.date || null,
      appointments: appointments.map(appointment => ({
        id: appointment._id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        reason: appointment.reason,
        notes: appointment.notes
      })),
      medicalRecords: medicalRecords.map(record => ({
        id: record._id,
        title: record.title,
        description: record.description,
        date: record.createdAt,
        fileUrl: record.fileUrl
      }))
    };
    
    console.log(`Retrieved details for patient ${patient._id}`);
    res.status(200).json({ 
      success: true, 
      patient: patientData
    });
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};