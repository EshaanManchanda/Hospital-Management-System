// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '45000');

// Authentication constants
export const TOKEN_KEY = 'token';
export const USER_DATA_KEY = 'userData';
export const USER_ROLE_KEY = 'userRole';

// User roles
export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_DASHBOARD: '/admin-dashboard',
  DOCTOR_DASHBOARD: '/doctor-dashboard',
  PATIENT_DASHBOARD: '/patient-dashboard',
  PROFILE: '/profile',
}; 