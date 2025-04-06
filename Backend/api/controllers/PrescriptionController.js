import { Prescription } from "../models/Prescription.js";
import { Patient } from "../models/Patient.js";
import { Medicine } from "../models/Medicine.js";

// Get all prescriptions
export const getAllPrescriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get prescriptions with pagination
    const prescriptions = await Prescription.find()
      .populate({
        path: 'patient',
        select: 'name contactNumber email'
      })
      .populate({
        path: 'doctor',
        select: 'name specialization'
      })
      .populate('medicines.medicine')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Prescription.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get prescription by ID
export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate({
        path: 'patient',
        select: 'name contactNumber email address dateOfBirth gender bloodGroup'
      })
      .populate({
        path: 'doctor',
        select: 'name specialization contactNumber email'
      })
      .populate('medicines.medicine');
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    
    // Check authorization
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'doctor' && 
      prescription.patient._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this prescription'
      });
    }
    
    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get prescriptions by patient ID
export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Check authorization
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'doctor' && 
      patientId !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these prescriptions'
      });
    }
    
    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get prescriptions with pagination
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate({
        path: 'doctor',
        select: 'name specialization contactNumber email'
      })
      .populate('medicines.medicine')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Prescription.countDocuments({ patient: patientId });
    
    res.status(200).json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get prescriptions by doctor ID
export const getPrescriptionsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Check authorization
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'doctor' && 
      doctorId !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these prescriptions'
      });
    }
    
    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get prescriptions with pagination
    const prescriptions = await Prescription.find({ doctor: doctorId })
      .populate({
        path: 'patient',
        select: 'name contactNumber email address dateOfBirth gender bloodGroup'
      })
      .populate('medicines.medicine')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Prescription.countDocuments({ doctor: doctorId });
    
    res.status(200).json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching doctor prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new prescription
export const createPrescription = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      diagnosis,
      medicines,
      instructions,
      startDate,
      endDate,
      followUpDate
    } = req.body;
    
    // Check if patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Create new prescription
    const prescription = await Prescription.create({
      patient,
      doctor: doctor || req.user._id,
      diagnosis,
      medicines,
      instructions,
      startDate,
      endDate,
      followUpDate
    });
    
    // Populate the response
    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate({
        path: 'patient',
        select: 'name contactNumber email'
      })
      .populate({
        path: 'doctor',
        select: 'name specialization'
      })
      .populate('medicines.medicine');
    
    res.status(201).json({
      success: true,
      data: populatedPrescription
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update prescription
export const updatePrescription = async (req, res) => {
  try {
    const {
      diagnosis,
      medicines,
      instructions,
      startDate,
      endDate,
      followUpDate
    } = req.body;
    
    // Find prescription by ID
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    
    // Check authorization
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'doctor' && 
      prescription.doctor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this prescription'
      });
    }
    
    // Update fields
    if (diagnosis) prescription.diagnosis = diagnosis;
    if (medicines) prescription.medicines = medicines;
    if (instructions) prescription.instructions = instructions;
    if (startDate) prescription.startDate = startDate;
    if (endDate) prescription.endDate = endDate;
    if (followUpDate) prescription.followUpDate = followUpDate;
    
    // Save the updated prescription
    await prescription.save();
    
    // Populate the response
    const updatedPrescription = await Prescription.findById(prescription._id)
      .populate({
        path: 'patient',
        select: 'name contactNumber email'
      })
      .populate({
        path: 'doctor',
        select: 'name specialization'
      })
      .populate('medicines.medicine');
    
    res.status(200).json({
      success: true,
      data: updatedPrescription
    });
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete prescription
export const deletePrescription = async (req, res) => {
  try {
    // Find prescription by ID
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    
    // Delete prescription
    await prescription.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 