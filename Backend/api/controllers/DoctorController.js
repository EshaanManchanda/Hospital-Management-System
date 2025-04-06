import { Doctor } from "../models/Doctor.js";
import { User } from "../models/User.js";

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
    const doctor = await Doctor.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email mobile gender profileImage'
      })
      .populate({
        path: 'appointments',
        select: 'date time status'
      });
      
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    
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
    const {
      specialization,
      experience,
      fee,
      about,
      workingHours,
      workingDays,
      qualifications,
      isAvailable
    } = req.body;
    
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    
    // Check if the user is updating their own profile
    if (req.user.role !== 'admin' && doctor.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this doctor" });
    }
    
    // Update fields
    if (specialization) doctor.specialization = specialization;
    if (experience) doctor.experience = experience;
    if (fee) doctor.fee = fee;
    if (about) doctor.about = about;
    if (workingHours) doctor.workingHours = workingHours;
    if (workingDays) doctor.workingDays = workingDays;
    if (qualifications) doctor.qualifications = qualifications;
    if (isAvailable !== undefined) doctor.isAvailable = isAvailable;
    
    const updatedDoctor = await doctor.save();
    
    res.status(200).json({ success: true, data: updatedDoctor });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
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