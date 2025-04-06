import { MedicalRecord } from "../models/MedicalRecord.js";
import { Patient } from "../models/Patient.js";

// Get all medical records
export const getAllMedicalRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get medical records with pagination
    const medicalRecords = await MedicalRecord.find()
      .populate({
        path: 'patient',
        select: 'name contactNumber email'
      })
      .populate({
        path: 'doctor',
        select: 'name specialization contactNumber email'
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await MedicalRecord.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        medicalRecords,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get medical record by ID
export const getMedicalRecordById = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
      .populate({
        path: 'patient',
        select: 'name contactNumber email address dateOfBirth gender bloodGroup'
      })
      .populate({
        path: 'doctor',
        select: 'name specialization contactNumber email'
      });
    
    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }
    
    // Check authorization
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'doctor' && 
      medicalRecord.patient._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this medical record'
      });
    }
    
    res.status(200).json({
      success: true,
      data: medicalRecord
    });
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get patient's medical records
export const getPatientMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Check if user is authorized to view patient's medical records
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'doctor' && 
      patientId !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these medical records'
      });
    }
    
    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get medical records with pagination
    const medicalRecords = await MedicalRecord.find({ patient: patientId })
      .populate({
        path: 'doctor',
        select: 'name specialization contactNumber email'
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await MedicalRecord.countDocuments({ patient: patientId });
    
    res.status(200).json({
      success: true,
      data: {
        medicalRecords,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching patient medical records:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get doctor's medical records
export const getDoctorMedicalRecords = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Check if user is authorized to view doctor's medical records
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'doctor' && 
      doctorId !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these medical records'
      });
    }
    
    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get medical records with pagination
    const medicalRecords = await MedicalRecord.find({ doctor: doctorId })
      .populate({
        path: 'patient',
        select: 'name contactNumber email address dateOfBirth gender bloodGroup'
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await MedicalRecord.countDocuments({ doctor: doctorId });
    
    res.status(200).json({
      success: true,
      data: {
        medicalRecords,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching doctor medical records:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new medical record
export const createMedicalRecord = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      diagnosis,
      treatment,
      notes,
      attachments,
      vitalSigns,
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
    
    // Create new medical record
    const medicalRecord = await MedicalRecord.create({
      patient,
      doctor: doctor || req.user._id,
      diagnosis,
      treatment,
      notes,
      attachments: attachments || [],
      vitalSigns: vitalSigns || {},
      followUpDate,
      date: new Date()
    });
    
    // Populate the response
    const populatedMedicalRecord = await MedicalRecord.findById(medicalRecord._id)
      .populate({
        path: 'patient',
        select: 'name contactNumber email'
      })
      .populate({
        path: 'doctor',
        select: 'name specialization'
      });
    
    res.status(201).json({
      success: true,
      data: populatedMedicalRecord
    });
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update medical record
export const updateMedicalRecord = async (req, res) => {
  try {
    const {
      diagnosis,
      treatment,
      notes,
      attachments,
      vitalSigns,
      followUpDate
    } = req.body;
    
    // Find medical record by ID
    const medicalRecord = await MedicalRecord.findById(req.params.id);
    
    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }
    
    // Check authorization
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'doctor' && 
      medicalRecord.doctor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this medical record'
      });
    }
    
    // Update fields
    if (diagnosis) medicalRecord.diagnosis = diagnosis;
    if (treatment) medicalRecord.treatment = treatment;
    if (notes) medicalRecord.notes = notes;
    if (attachments) medicalRecord.attachments = attachments;
    if (vitalSigns) {
      medicalRecord.vitalSigns = {
        ...medicalRecord.vitalSigns,
        ...vitalSigns
      };
    }
    if (followUpDate) medicalRecord.followUpDate = followUpDate;
    
    // Save the updated medical record
    await medicalRecord.save();
    
    // Populate the response
    const updatedMedicalRecord = await MedicalRecord.findById(medicalRecord._id)
      .populate({
        path: 'patient',
        select: 'name contactNumber email'
      })
      .populate({
        path: 'doctor',
        select: 'name specialization'
      });
    
    res.status(200).json({
      success: true,
      data: updatedMedicalRecord
    });
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete medical record
export const deleteMedicalRecord = async (req, res) => {
  try {
    // Find medical record by ID
    const medicalRecord = await MedicalRecord.findById(req.params.id);
    
    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }
    
    // Delete medical record
    await medicalRecord.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get medical records statistics
export const getMedicalRecordsStats = async (req, res) => {
  try {
    // Only admins and doctors can access stats
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access medical records statistics'
      });
    }
    
    // Get total count
    const totalRecords = await MedicalRecord.countDocuments();
    
    // Get records by diagnosis
    const diagnosisCounts = await MedicalRecord.aggregate([
      {
        $group: {
          _id: '$diagnosis',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    // Get records by month
    const recordsByMonth = await MedicalRecord.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      },
      {
        $limit: 12
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalRecords,
        diagnosisCounts,
        recordsByMonth
      }
    });
  } catch (error) {
    console.error('Error getting medical records stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add attachment to medical record
export const addAttachment = async (req, res) => {
  try {
    const { id } = req.params; // Get medical record ID from the route parameters
    const { filename, filePath, fileType } = req.body; // Get attachment details from the request body

    // Find the medical record by ID
    const medicalRecord = await MedicalRecord.findById(id);
    
    if (!medicalRecord) {
      return res.status(404).json({ success: false, message: 'Medical record not found' });
    }

    // Add the new attachment to the medical record
    medicalRecord.attachments.push({ filename, filePath, fileType });

    // Save the updated medical record
    await medicalRecord.save();

    res.status(200).json({
      success: true,
      data: medicalRecord.attachments[medicalRecord.attachments.length - 1] // Return the newly added attachment
    });
  } catch (error) {
    console.error('Error adding attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 