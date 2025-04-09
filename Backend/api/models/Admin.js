import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminLevel: {
    type: String,
    enum: ['super', 'manager', 'assistant'],
    default: 'assistant'
  },
  permissions: [{
    type: String,
    enum: [
      'all', 
      'manage_users', 
      'manage_doctors', 
      'manage_patients', 
      'manage_nurses', 
      'manage_receptionists', 
      'manage_appointments', 
      'manage_inventory', 
      'manage_billing', 
      'view_reports', 
      'manage_settings'
    ]
  }],
  department: {
    type: String,
    default: 'Administration'
  },
  contactNumber: {
    type: String
  },
  office: {
    type: String
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  activityLog: [{
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String
  }]
}, { timestamps: true });

// Add permission check methods
adminSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes('all') || this.permissions.includes(permission);
};

adminSchema.methods.logActivity = function(action, details) {
  this.activityLog.push({
    action,
    details,
    timestamp: new Date()
  });
  return this.save();
};

// Update last login time
adminSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

export const Admin = mongoose.model('Admin', adminSchema); 