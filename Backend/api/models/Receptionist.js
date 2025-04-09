import mongoose from 'mongoose';

const receptionistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workingHours: {
    start: String,
    end: String,
    required: true
  },
  workingDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  assignedDepartment: {
    type: String,
    required: true
  },
  jobResponsibilities: [{
    type: String
  }],
  skills: [{
    type: String
  }],
  languages: [{
    type: String
  }],
  experience: {
    type: Number, // in years
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  appointmentsManaged: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  registrationsProcessed: {
    type: Number,
    default: 0
  },
  feedbackRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 0
  }
}, { timestamps: true });

export const Receptionist = mongoose.model('Receptionist', receptionistSchema); 