// We'll use dynamic imports to avoid circular dependencies
let api = null;

/**
 * Service for patient-related API calls
 */
const patientService = {
  /**
   * Get all patients with optional pagination
   * @param {Object} params - Optional pagination parameters
   * @returns {Promise<Object>} - List of patients and total count
   */
  async getAllPatients(params = {}) {
    try {
      // Ensure api is available
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const response = await api.get(`/api/patients`, { params });
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
          total: response.data.count || 0,
          message: response.data.message
        };
      }
      
      return {
        success: false,
        data: [],
        total: 0,
        message: response.data?.message || 'Failed to fetch patients'
      };
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },
  
  /**
   * Get a patient by ID
   * @param {string} id - Patient ID
   * @returns {Promise<Object>} - Patient data
   */
  async getPatientById(id) {
    try {
      // Ensure api is available
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const response = await api.get(`/api/patients/${id}`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          patient: response.data.data,
          message: response.data.message
        };
      }
      
      return {
        success: false,
        patient: null,
        message: response.data?.message || 'Failed to fetch patient'
      };
    } catch (error) {
      console.error(`Error fetching patient with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new patient
   * @param {Object} patientData - Patient data including user information
   * @returns {Promise<Object>} - Created patient data
   */
  async createPatient(patientData) {
    try {
      // Ensure api is available
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      // Structure data to match backend expectations
      const formattedData = {
        // User related fields
        name: patientData.name,
        email: patientData.email,
        password: patientData.password,
        mobile: patientData.mobile,
        gender: patientData.gender,
        dateOfBirth: patientData.dateOfBirth,
        profileImage: patientData.profileImage,
        address: patientData.address,
        
        // Patient specific fields
        bloodGroup: patientData.bloodGroup,
        allergies: patientData.allergies,
        conditions: patientData.conditions,
        medications: patientData.medications,
        surgeries: patientData.surgeries,
        emergencyContact: patientData.emergencyContact,
        medicalHistory: patientData.medicalHistory,
        insurance: patientData.insurance,
        
        // Add a flag to indicate this is an admin creation and should not trigger auth redirects
        skipAuthRedirect: true
      };
      
      const response = await api.post(`/api/patients`, formattedData);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          patient: response.data.data,
          message: response.data.message || 'Patient created successfully'
        };
      }
      
      return {
        success: false,
        patient: null,
        message: response.data?.message || 'Failed to create patient'
      };
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing patient
   * @param {string} id - Patient ID
   * @param {Object} patientData - Updated patient data
   * @returns {Promise<Object>} - Updated patient data
   */
  async updatePatient(id, patientData) {
    try {
      // Ensure api is available
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      // Structure data to match backend expectations
      const formattedData = {
        // User related fields
        name: patientData.name,
        email: patientData.email,
        mobile: patientData.mobile,
        gender: patientData.gender,
        dateOfBirth: patientData.dateOfBirth,
        profileImage: patientData.profileImage,
        address: patientData.address,
        
        // Patient specific fields
        bloodGroup: patientData.bloodGroup,
        allergies: patientData.allergies,
        conditions: patientData.conditions,
        medications: patientData.medications,
        surgeries: patientData.surgeries,
        emergencyContact: patientData.emergencyContact,
        medicalHistory: patientData.medicalHistory,
        insurance: patientData.insurance
      };
      
      const response = await api.put(`/api/patients/${id}`, formattedData);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          patient: response.data.data,
          message: response.data.message || 'Patient updated successfully'
        };
      }
      
      return {
        success: false,
        patient: null,
        message: response.data?.message || 'Failed to update patient'
      };
    } catch (error) {
      console.error(`Error updating patient with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a patient by ID
   * @param {string} id - Patient ID
   * @returns {Promise<Object>} - Deletion result
   */
  async deletePatient(id) {
    try {
      // Ensure api is available
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const response = await api.delete(`/api/patients/${id}`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Patient deleted successfully'
        };
      }
      
      return {
        success: false,
        message: response.data?.message || 'Failed to delete patient'
      };
    } catch (error) {
      console.error(`Error deleting patient with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get patient medical records
   * @param {string} id - Patient ID
   * @returns {Promise<Object>} - Medical records data
   */
  async getPatientMedicalRecords(id) {
    try {
      // Ensure api is available
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const response = await api.get(`/api/patients/${id}/medical-records`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          records: response.data.data,
          message: response.data.message
        };
      }
      
      return {
        success: false,
        records: null,
        message: response.data?.message || 'Failed to fetch medical records'
      };
    } catch (error) {
      console.error(`Error fetching medical records for patient ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Update patient medical records
   * @param {string} id - Patient ID
   * @param {Object} recordsData - Updated medical records data
   * @returns {Promise<Object>} - Updated records data
   */
  async updatePatientMedicalRecords(id, recordsData) {
    try {
      // Ensure api is available
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const response = await api.put(`/api/patients/${id}/medical-records`, recordsData);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          records: response.data.data,
          message: response.data.message || 'Medical records updated successfully'
        };
      }
      
      return {
        success: false,
        records: null,
        message: response.data?.message || 'Failed to update medical records'
      };
    } catch (error) {
      console.error(`Error updating medical records for patient ${id}:`, error);
      throw error;
    }
  }
};

// Export as both default and named export
export { patientService };
export default patientService; 