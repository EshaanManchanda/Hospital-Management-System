import mongoose from 'mongoose';

const nurseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  shift: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Night', 'Rotating'],
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: Number, // in years
    required: true
  },
  specialization: {
    type: String
  },
  assignedDoctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  assignedPatients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  workingDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  workingHours: {
    start: String,
    end: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  skills: [{
    type: String
  }],
  certifications: [{
    name: String,
    issuedBy: String,
    year: Number,
    expiryDate: Date
  }]
}, { timestamps: true });

export const Nurse = mongoose.model('Nurse', nurseSchema); 