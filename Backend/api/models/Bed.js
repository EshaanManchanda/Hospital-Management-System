import mongoose from 'mongoose';

const bedSchema = mongoose.Schema(
  {
    bedNumber: {
      type: String,
      required: true,
      unique: true,
    },
    ward: {
      type: String,
      required: true,
      enum: ['General', 'ICU', 'Emergency', 'Pediatric', 'Maternity', 'Surgery'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Available', 'Occupied', 'Maintenance'],
      default: 'Available',
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null,
    },
    admissionDate: {
      type: Date,
      default: null,
    },
    expectedDischargeDate: {
      type: Date,
      default: null,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
bedSchema.index({ ward: 1, status: 1 });

// Static method to get bed statistics
bedSchema.statics.getBedStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert to a more usable format
  const formatted = {};
  stats.forEach(stat => {
    formatted[stat._id] = stat.count;
  });

  // Calculate total beds and occupancy rate
  const total = stats.reduce((acc, stat) => acc + stat.count, 0);
  const occupied = formatted.Occupied || 0;
  const occupancyRate = total > 0 ? (occupied / total) * 100 : 0;

  return {
    total,
    occupied,
    available: formatted.Available || 0,
    maintenance: formatted.Maintenance || 0,
    occupancyRate: Math.round(occupancyRate * 100) / 100, // Round to 2 decimal places
  };
};

// Static method to get ward-wise bed statistics
bedSchema.statics.getWardStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: { ward: '$ward', status: '$status' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.ward',
        total: { $sum: '$count' },
        statuses: {
          $push: {
            status: '$_id.status',
            count: '$count',
          },
        },
      },
    },
  ]);
};

export const Bed = mongoose.model('Bed', bedSchema); 