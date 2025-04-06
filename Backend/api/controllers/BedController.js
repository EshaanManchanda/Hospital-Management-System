import { Bed } from '../models/Bed.js';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';

// @desc    Get all beds
// @route   GET /api/beds
// @access  Private/Admin
export const getAllBeds = async (req, res) => {
  try {
    const { ward, status, search } = req.query;
    
    // Build query
    const query = {};
    
    if (ward) {
      query.ward = ward;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.bedNumber = { $regex: search, $options: 'i' };
    }
    
    const beds = await Bed.find(query)
      .populate('patient', 'name gender age contactNumber')
      .populate('assignedDoctor', 'name specialty contactNumber')
      .sort({ ward: 1, bedNumber: 1 });
      
    res.status(200).json(beds);
  } catch (error) {
    console.error('Error in getAllBeds:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get bed by ID
// @route   GET /api/beds/:id
// @access  Private/Admin
export const getBedById = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id)
      .populate('patient', 'name gender age contactNumber medicalHistory')
      .populate('assignedDoctor', 'name specialty contactNumber email');
      
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    
    res.status(200).json(bed);
  } catch (error) {
    console.error('Error in getBedById:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new bed
// @route   POST /api/beds
// @access  Private/Admin
export const createBed = async (req, res) => {
  try {
    const { bedNumber, ward, price, notes } = req.body;
    
    // Check if bed number already exists
    const bedExists = await Bed.findOne({ bedNumber });
    
    if (bedExists) {
      return res.status(400).json({ message: 'Bed number already exists' });
    }
    
    const newBed = await Bed.create({
      bedNumber,
      ward,
      price,
      notes,
      status: 'Available',
    });
    
    res.status(201).json(newBed);
  } catch (error) {
    console.error('Error in createBed:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update bed details
// @route   PUT /api/beds/:id
// @access  Private/Admin
export const updateBed = async (req, res) => {
  try {
    const { bedNumber, ward, status, price, notes } = req.body;
    
    const bed = await Bed.findById(req.params.id);
    
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    
    // If changing bed number, check if new number already exists
    if (bedNumber && bedNumber !== bed.bedNumber) {
      const bedExists = await Bed.findOne({ bedNumber });
      
      if (bedExists) {
        return res.status(400).json({ message: 'Bed number already exists' });
      }
    }
    
    // Update fields
    bed.bedNumber = bedNumber || bed.bedNumber;
    bed.ward = ward || bed.ward;
    bed.status = status || bed.status;
    bed.price = price !== undefined ? price : bed.price;
    bed.notes = notes !== undefined ? notes : bed.notes;
    
    // If status changed to Available, clear patient and doctor
    if (status === 'Available' && bed.status !== 'Available') {
      bed.patient = null;
      bed.assignedDoctor = null;
      bed.admissionDate = null;
      bed.expectedDischargeDate = null;
    }
    
    const updatedBed = await bed.save();
    
    res.status(200).json(updatedBed);
  } catch (error) {
    console.error('Error in updateBed:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a bed
// @route   DELETE /api/beds/:id
// @access  Private/Admin
export const deleteBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    
    // Check if bed is occupied
    if (bed.status === 'Occupied') {
      return res.status(400).json({ message: 'Cannot delete an occupied bed' });
    }
    
    await bed.remove();
    
    res.status(200).json({ message: 'Bed removed successfully' });
  } catch (error) {
    console.error('Error in deleteBed:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Assign patient to bed
// @route   PUT /api/beds/:id/assign
// @access  Private/Admin
export const assignPatientToBed = async (req, res) => {
  try {
    const { patientId, doctorId, expectedDischargeDate } = req.body;
    
    const bed = await Bed.findById(req.params.id);
    
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    
    // Check if bed is available
    if (bed.status !== 'Available') {
      return res.status(400).json({ message: 'Bed is not available' });
    }
    
    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Verify doctor exists if provided
    if (doctorId) {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
    }
    
    // Update bed
    bed.patient = patientId;
    bed.assignedDoctor = doctorId || null;
    bed.status = 'Occupied';
    bed.admissionDate = new Date();
    bed.expectedDischargeDate = expectedDischargeDate || null;
    
    const updatedBed = await bed.save();
    
    // Return the updated bed with populated patient and doctor
    const populatedBed = await Bed.findById(updatedBed._id)
      .populate('patient', 'name gender age contactNumber')
      .populate('assignedDoctor', 'name specialty contactNumber');
    
    res.status(200).json(populatedBed);
  } catch (error) {
    console.error('Error in assignPatientToBed:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Discharge patient from bed
// @route   PUT /api/beds/:id/discharge
// @access  Private/Admin
export const dischargePatient = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    
    // Check if bed is occupied
    if (bed.status !== 'Occupied') {
      return res.status(400).json({ message: 'Bed is not occupied' });
    }
    
    // Update bed
    bed.patient = null;
    bed.assignedDoctor = null;
    bed.status = 'Available';
    bed.admissionDate = null;
    bed.expectedDischargeDate = null;
    
    const updatedBed = await bed.save();
    
    res.status(200).json(updatedBed);
  } catch (error) {
    console.error('Error in dischargePatient:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get bed statistics
// @route   GET /api/beds/stats
// @access  Private/Admin
export const getBedStats = async (req, res) => {
  try {
    const stats = await Bed.getBedStats();
    const wardStats = await Bed.getWardStats();
    
    res.status(200).json({
      summary: stats,
      wardStats
    });
  } catch (error) {
    console.error('Error in getBedStats:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}; 