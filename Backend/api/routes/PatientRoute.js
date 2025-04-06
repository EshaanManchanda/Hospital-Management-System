// routes/patientRoute.js
import express from 'express';
import { 
    registerPatient, 
    getAllPatients, 
    getPatientById, 
    updatePatient, 
    deletePatient,
    createPatient,
    addMedicalHistory,
    addMedication,
    addMedicalReport,
    getPatientStats,
    getDoctorPatients
} from '../controllers/PatientController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerPatient);

// Protected routes
router.use(protect);

// Patient routes
router.route('/')
    .get(authorize('admin', 'doctor'), getAllPatients)
    .post(authorize('admin'), createPatient);

router.route('/:id')
    .get(getPatientById)
    .put(updatePatient)
    .delete(authorize('admin'), deletePatient);

// Medical history routes
router.post('/:id/medical-history', authorize('admin', 'doctor'), addMedicalHistory);

// Medication routes
router.post('/:id/medications', authorize('admin', 'doctor'), addMedication);

// Medical report routes
router.post('/:id/reports', addMedicalReport);

// Stats route
router.get('/stats', authorize('admin'), getPatientStats);

// Doctor's patients route
router.get('/doctor/:doctorId', authorize('admin', 'doctor'), getDoctorPatients);

export default router;
