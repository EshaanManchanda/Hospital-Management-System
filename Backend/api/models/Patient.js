// models/Patient.js
import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  height: {
    type: Number,  // in cm
    required: true
  },
  weight: {
    type: Number,  // in kg
    required: true
  },
  allergies: [{
    type: String
  }],
  chronicDiseases: [{
    type: String
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  medicalHistory: [{
    diagnosis: String,
    treatment: String,
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    }
  }],
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  reports: [{
    title: String,
    type: String,
    file: String,
    uploadedDate: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  insuranceDetails: {
    provider: String,
    policyNumber: String,
    validUntil: Date,
    coverageDetails: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const Patient = mongoose.model('Patient', patientSchema);
