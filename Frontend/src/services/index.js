// Import all services except the ones creating circular dependencies
import authService from './authservice';
import doctorService from './doctorService';
import appointmentService from './appointmentService';
import adminService from './adminService';
import medicalRecordService from './medicalRecordService';
import pharmacyService from './pharmacyService';
import bedService from './bedService';
import messageService from './messageService';
import scheduleService from './scheduleService';
import notificationService from './notificationService';
import reportService from './reportService';
import revenueService from './revenueService';

// Initialize services that need dynamic loading
let api, patientService;

// Export API getter to ensure it's loaded when accessed
export const getApi = () => api;
export const getPatientService = () => patientService;

const loadDependencies = async () => {
  try {
    const apiModule = await import('../utils/api');
    api = apiModule.default;
    
    const patientServiceModule = await import('./patientservice');
    patientService = patientServiceModule.default;
  } catch (error) {
    console.error('Error loading dependencies:', error);
    throw error;
  }
};

// Start loading dependencies
loadDependencies();

// Export all services
export {
  authService,
  doctorService,
  appointmentService,
  adminService,
  medicalRecordService,
  pharmacyService,
  bedService,
  messageService,
  scheduleService,
  notificationService,
  reportService,
  revenueService
};
