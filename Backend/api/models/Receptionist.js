import mongoose from 'mongoose';

const receptionistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workingHours: {
    start: {
      type: String,
      default: "09:00",
      required: true
    },
    end: {
      type: String,
      default: "17:00",
      required: true
    }
  },
  workingDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  assignedDepartment: {
    type: String,
    required: true,
    default: "Front Desk"
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
    default: null,
    validate: {
      validator: function(v) {
        return v === null || (v >= 1 && v <= 5);
      },
      message: props => `${props.value} is not a valid rating! Rating must be between 1 and 5, or null`
    }
  }
}, { timestamps: true });

// Add a method to the schema (example)
receptionistSchema.methods.isWorking = function(dayOfWeek) {
  return this.workingDays.includes(dayOfWeek);
};

// Create the model
const Receptionist = mongoose.model('Receptionist', receptionistSchema);

// Export as both default and named export
export default Receptionist;
export { Receptionist }; 