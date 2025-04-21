import api from '../utils/api';

// Helper to decode JWT token
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
}

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

function getPatientId() {
  // Try direct localStorage
  let patientId = localStorage.getItem('patientId');
  if (patientId) return patientId;

  // Try user object in localStorage
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      patientId = user.patientId || user._id || user.id;
      if (patientId) return patientId;
    } catch (e) {}
  }

  // Try patient object in localStorage
  const patientStr = localStorage.getItem('patient');
  if (patientStr) {
    try {
      const patient = JSON.parse(patientStr);
      patientId = patient._id || patient.patientId || patient.id;
      if (patientId) return patientId;
    } catch (e) {}
  }

  // Try decoding from JWT token
  const token = localStorage.getItem('token');
  if (token) {
    const payload = parseJwt(token);
    patientId = payload.patientId || payload._id || payload.id;
    if (patientId) return patientId;
  }

  return null;
}

const medicineService = {
  getPatientId, // Export for use elsewhere if needed

  getMedicationsByPatient: async () => {
    const patientId = getPatientId();
    if (!patientId) {
      throw new Error("Patient ID not found. Please log in again.");
    }
    const response = await api.get(`/api/medicines/patient/${patientId}/medications`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
  requestRefill: async (prescriptionId, medicineId) => {
    const response = await api.post('/api/medicines/request-refill', { prescriptionId, medicineId }, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
  getMedicineById: async (id) => {
    const response = await api.get(`/api/medicines/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  }
};

export default medicineService;