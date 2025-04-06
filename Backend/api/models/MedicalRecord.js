import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  attachments: [{
    filename: String,
    filePath: String,
    fileType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  vitalSigns: {
    temperature: Number,
    heartRate: Number,
    bloodPressure: String,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    height: Number,
    weight: Number
  },
  date: {
    type: Date,
    default: Date.now
  },
  followUpDate: Date,
  status: {
    type: String,
    enum: ['open', 'closed', 'pending'],
    default: 'open'
  }
}, { timestamps: true });

// Index for faster search
medicalRecordSchema.index({ patient: 1, date: -1 });
medicalRecordSchema.index({ recordType: 1 });

export const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema); 