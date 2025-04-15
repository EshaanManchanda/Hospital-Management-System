import Joi from 'joi';

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    
    next();
  };
};

// Validation schemas
const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('patient', 'doctor', 'admin', 'nurse', 'receptionist').required(),
    // Optional user fields
    mobile: Joi.string().allow(''),
    gender: Joi.string().valid('male', 'female', 'other'),
    dateOfBirth: Joi.date(),
    address: Joi.object({
      street: Joi.string().allow(''),
      city: Joi.string().allow(''),
      state: Joi.string().allow(''),
      zipCode: Joi.string().allow(''),
      country: Joi.string().allow('')
    }),
    // Admin specific fields
    adminLevel: Joi.string().valid('super', 'manager', 'assistant'),
    permissions: Joi.array().items(Joi.string().valid(
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
      'manage_settings',
      'approve_requests'
    )),
    department: Joi.string(),
    contactNumber: Joi.string(),
    office: Joi.string(),
    // Doctor specific fields
    specialization: Joi.string(),
    experience: Joi.number(),
    fee: Joi.number(),
    about: Joi.string(),
    workingHours: Joi.object({
      start: Joi.string(),
      end: Joi.string()
    }),
    workingDays: Joi.array().items(Joi.string()),
    qualifications: Joi.array().items(Joi.object({
      degree: Joi.string(),
      institution: Joi.string(),
      year: Joi.number()
    })),
    // Patient specific fields
    bloodGroup: Joi.string(),
    height: Joi.number(),
    weight: Joi.number(),
    allergies: Joi.array().items(Joi.string()),
    chronicDiseases: Joi.array().items(Joi.string())
  }).unknown(true),

  updateProfile: Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    address: Joi.string()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  verifyResetToken: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  })
};

export { validateRequest, schemas }; 