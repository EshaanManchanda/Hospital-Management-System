// Import all services except the ones creating circular dependencies
import authService from './authService';
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

// Import patientService with a dynamically resolved promise to avoid circular dependencies
let api, patientService;

// Dynamically import the api and patientService
const loadDependencies = async () => {
  const apiModule = await import('../utils/api');
  api = apiModule.default;
  
  const patientServiceModule = await import('./patientService');
  patientService = patientServiceModule.default;
};

// Start loading dependencies
loadDependencies();

// Export the api instance and all services
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

// Export these with getters to ensure they're loaded when accessed
export const getApi = () => api;
export const getPatientService = () => patientService; 