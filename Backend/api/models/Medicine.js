import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Drops', 'Inhaler', 'Other']
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  dosageForm: {
    type: String,
    required: true
  },
  strength: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  sideEffects: {
    type: [String],
    default: []
  },
  contraindications: {
    type: [String],
    default: []
  },
  requiresPrescription: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Add text indexes for search
medicineSchema.index({
  name: 'text',
  description: 'text',
  manufacturer: 'text',
  category: 'text'
});

// Virtual for stock status
medicineSchema.virtual('stockStatus').get(function() {
  if (this.stock <= 0) {
    return 'out-of-stock';
  } else if (this.stock <= this.reorderLevel) {
    return 'low';
  } else {
    return 'available';
  }
});

export const Medicine = mongoose.model('Medicine', medicineSchema); 