import { Medicine } from "../models/Medicine.js";
import { Prescription } from "../models/Prescription.js";
import { Patient } from "../models/Patient.js";

// Get all medicines
export const getAllMedicines = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    
    // Build query
    const query = {};
    if (category) {
      query.category = category;
    }
    
    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get medicines with pagination
    const medicines = await Medicine.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Medicine.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        medicines,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get medicine by ID
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    console.error('Error fetching medicine:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new medicine
export const createMedicine = async (req, res) => {
  try {
    const {
      name,
      description,
      manufacturer,
      category,
      price,
      stock,
      expiryDate,
      dosageForm,
      strength,
      sideEffects,
      contraindications,
      requiresPrescription,
      image
    } = req.body;
    
    // Check if medicine already exists
    const existingMedicine = await Medicine.findOne({ name, manufacturer });
    if (existingMedicine) {
      return res.status(400).json({
        success: false,
        message: 'Medicine already exists'
      });
    }
    
    // Create new medicine
    const medicine = await Medicine.create({
      name,
      description,
      manufacturer,
      category,
      price,
      stock,
      expiryDate,
      dosageForm,
      strength,
      sideEffects: sideEffects || [],
      contraindications: contraindications || [],
      requiresPrescription: requiresPrescription !== undefined ? requiresPrescription : true,
      image
    });
    
    res.status(201).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    console.error('Error creating medicine:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update medicine
export const updateMedicine = async (req, res) => {
  try {
    const {
      name,
      description,
      manufacturer,
      category,
      price,
      stock,
      expiryDate,
      dosageForm,
      strength,
      sideEffects,
      contraindications,
      requiresPrescription,
      isActive,
      image
    } = req.body;
    
    // Find medicine by ID
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }
    
    // Update fields
    if (name) medicine.name = name;
    if (description) medicine.description = description;
    if (manufacturer) medicine.manufacturer = manufacturer;
    if (category) medicine.category = category;
    if (price) medicine.price = price;
    if (stock !== undefined) medicine.stock = stock;
    if (expiryDate) medicine.expiryDate = expiryDate;
    if (dosageForm) medicine.dosageForm = dosageForm;
    if (strength) medicine.strength = strength;
    if (sideEffects) medicine.sideEffects = sideEffects;
    if (contraindications) medicine.contraindications = contraindications;
    if (requiresPrescription !== undefined) medicine.requiresPrescription = requiresPrescription;
    if (isActive !== undefined) medicine.isActive = isActive;
    if (image) medicine.image = image;
    
    // Save the updated medicine
    const updatedMedicine = await medicine.save();
    
    res.status(200).json({
      success: true,
      data: updatedMedicine
    });
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete medicine
export const deleteMedicine = async (req, res) => {
  try {
    // Find medicine by ID
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }
    
    // Delete medicine
    await medicine.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Search medicines
export const searchMedicines = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Search using text index
    const medicines = await Medicine.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Medicine.countDocuments({ $text: { $search: query } });
    
    res.status(200).json({
      success: true,
      data: {
        medicines,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error searching medicines:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create prescription
export const createPrescription = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      medications,
      additionalInstructions,
      startDate,
      endDate,
      notes
    } = req.body;
    
    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: "Patient not found" 
      });
    }
    
    // Create new prescription
    const prescription = await Prescription.create({
      patient: patientId,
      doctor: doctorId,
      appointment: appointmentId,
      diagnosis,
      medications,
      additionalInstructions,
      startDate: startDate || new Date(),
      endDate,
      notes
    });
    
    // Populate medication details
    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate('patient', 'user')
      .populate('doctor', 'user specialization')
      .populate('medications.medicine', 'name genericName dosageForm strength');
    
    res.status(201).json({ success: true, data: populatedPrescription });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get all prescriptions
export const getAllPrescriptions = async (req, res) => {
  try {
    const { patientId, doctorId, status, dispensed } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Filter by patient
    if (patientId) {
      filter.patient = patientId;
    }
    
    // Filter by doctor
    if (doctorId) {
      filter.doctor = doctorId;
    }
    
    // Filter by status
    if (status) {
      filter.status = status;
    }
    
    // Filter by dispensed status
    if (dispensed !== undefined) {
      filter.dispensed = dispensed === 'true';
    }
    
    const prescriptions = await Prescription.find(filter)
      .populate('patient', 'user')
      .populate({
        path: 'doctor',
        select: 'user specialization',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .populate('medications.medicine', 'name genericName dosageForm strength')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: prescriptions.length, 
      data: prescriptions 
    });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
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
        populate: {
          path: 'user',
          select: 'name email mobile gender dateOfBirth'
        }
      })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .populate('medications.medicine');
    
    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: "Prescription not found" 
      });
    }
    
    res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Dispense prescription
export const dispensePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('medications.medicine');
    
    if (!prescription) {
      return res.status(404).json({ 
        success: false, 
        message: "Prescription not found" 
      });
    }
    
    // Check if already dispensed
    if (prescription.dispensed) {
      return res.status(400).json({ 
        success: false, 
        message: "Prescription has already been dispensed" 
      });
    }
    
    // Check stock levels for all medications
    for (const med of prescription.medications) {
      const medicine = med.medicine;
      
      if (medicine.stock <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: `${medicine.name} is out of stock` 
        });
      }
      
      // Update medicine stock (subtract 1 for each medication)
      await Medicine.findByIdAndUpdate(medicine._id, {
        $inc: { stock: -1 }
      });
    }
    
    // Update prescription as dispensed
    prescription.dispensed = true;
    prescription.dispensedBy = req.user._id;
    prescription.dispensedDate = new Date();
    
    await prescription.save();
    
    res.status(200).json({ 
      success: true, 
      message: "Prescription successfully dispensed", 
      data: prescription 
    });
  } catch (error) {
    console.error("Error dispensing prescription:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get low stock items (for dashboard alerts)
export const getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Medicine.find({
      $expr: { $lte: ['$stock', '$reorderLevel'] },
      isActive: true
    }).sort({ stock: 1 });
    
    res.status(200).json({ 
      success: true, 
      count: lowStockItems.length, 
      data: lowStockItems 
    });
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get medicine statistics (for dashboard)
export const getMedicineStats = async (req, res) => {
  try {
    // Get total medicines count
    const totalMedicines = await Medicine.countDocuments({ isActive: true });
    
    // Get out of stock count
    const outOfStockCount = await Medicine.countDocuments({ 
      stock: 0, 
      isActive: true 
    });
    
    // Get low stock count
    const lowStockCount = await Medicine.countDocuments({
      $expr: { $and: [
        { $gt: ['$stock', 0] },
        { $lte: ['$stock', '$reorderLevel'] }
      ]},
      isActive: true
    });
    
    // Get category breakdown
    const categoryBreakdown = await Medicine.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get top prescribed medicines (requires additional aggregation)
    const topPrescribedMedicines = await Prescription.aggregate([
      { $unwind: '$medications' },
      {
        $group: {
          _id: '$medications.medicine',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'medicines',
          localField: '_id',
          foreignField: '_id',
          as: 'medicineDetails'
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          name: { $arrayElemAt: ['$medicineDetails.name', 0] },
          genericName: { $arrayElemAt: ['$medicineDetails.genericName', 0] }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalMedicines,
        outOfStockCount,
        lowStockCount,
        categoryBreakdown,
        topPrescribedMedicines
      }
    });
  } catch (error) {
    console.error("Error getting medicine stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
}; 