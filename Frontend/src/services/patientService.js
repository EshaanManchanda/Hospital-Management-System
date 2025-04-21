// We'll use dynamic imports to avoid circular dependencies
let api = null;

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  return {
    'Authorization': getAuthToken(),
    'Content-Type': 'application/json'
  };
};

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

      // Use the existing helper function for headers
      const config = {
        headers: getAuthHeaders(),
        params: {
          page: params.page || 1,
          limit: params.limit || 10
        }
      };
      
      const response = await api.get('/api/patients', config);
      
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
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch patients'
      };
    }
  },
  
  /**
   * Get a patient by ID
   * @param {string} id - Patient ID
   * @returns {Promise<Object>} - Patient data
   */
  async getPatientById(id) {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.get(`/api/patients/${id}`, config);
      
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
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      // Extract data from user object and other fields
      const userData = patientData.user || patientData;
      
      // Structure data to exactly match backend controller expectations
      const formattedData = {
        // Direct fields expected by the controller
        name: userData.name,
        email: userData.email,
        password: userData.password || "password123",
        mobile: userData.mobile,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
        
        // Patient specific fields
        bloodGroup: patientData.bloodGroup || patientData.bloodType,
        height: patientData.height,
        weight: patientData.weight,
        allergies: patientData.allergies || [],
        chronicDiseases: patientData.chronicConditions || patientData.conditions || [],
        medications: patientData.medications || [],
        medicalHistory: patientData.medicalHistory || [],
        surgeries: patientData.surgeries || [],
        emergencyContact: patientData.emergencyContact || {},
        insurance: patientData.insurance || {},
        notes: patientData.notes || "",
        status: patientData.status || "Active"
      };
      
      // Validate required fields
      if (!formattedData.email) {
        return {
          success: false,
          message: 'Email is required for patient creation'
        };
      }
      
      if (!formattedData.name) {
        return {
          success: false,
          message: 'Name is required for patient creation'
        };
      }
      
      console.log('Creating patient with data:', JSON.stringify(formattedData, null, 2));
      
      try {
        const config = { headers: getAuthHeaders() };
        const response = await api.post(`/api/patients/register`, formattedData, config);
        
        if (response.data && response.data.success) {
          return {
            success: true,
            data: response.data.data,
            message: response.data.message || 'Patient created successfully'
          };
        }
        
        return {
          success: false,
          message: response.data?.message || 'Failed to create patient'
        };
      } catch (apiError) {
        console.error('API Error creating patient:', apiError.response?.data || apiError.message);
        return {
          success: false,
          message: apiError.response?.data?.message || apiError.message || 'Failed to create patient',
          error: apiError.response?.data?.error || apiError.message
        };
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create patient',
        error: error.response?.data?.error || error.message
      };
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

      // Filter out empty or undefined values
      const filteredData = Object.entries(patientData).reduce((acc, [key, value]) => {
        // Handle nested user object
        if (key === 'user' && typeof value === 'object') {
          const filteredUser = Object.entries(value).reduce((userAcc, [userKey, userValue]) => {
            if (userValue !== undefined && userValue !== null && userValue !== '') {
              userAcc[userKey] = userValue;
            }
            return userAcc;
          }, {});
          if (Object.keys(filteredUser).length > 0) {
            acc[key] = filteredUser;
          }
        }
        // Handle emergencyContact object
        else if (key === 'emergencyContact' && typeof value === 'object') {
          const filteredContact = Object.entries(value).reduce((contactAcc, [contactKey, contactValue]) => {
            if (contactValue !== undefined && contactValue !== null && contactValue !== '') {
              contactAcc[contactKey] = contactValue;
            }
            return contactAcc;
          }, {});
          if (Object.keys(filteredContact).length > 0) {
            acc[key] = filteredContact;
          }
        }
        // Handle arrays (allergies, chronicConditions, medications, surgeries)
        else if (Array.isArray(value)) {
          if (value.length > 0) {
            acc[key] = value;
          }
        }
        // Handle regular fields
        else if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      // Add headers to the request
      const config = {
        headers: getAuthHeaders()
      };

      console.log('Sending update request with data:', filteredData);
      const response = await api.put(`/api/patients/${id}`, filteredData, config);
      console.log('Update response:', response);
      
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
      return {
        success: false,
        patient: null,
        message: error.response?.data?.message || 'An error occurred while updating the patient'
      };
    }
  },
  
  /**
   * Delete a patient by ID
   * @param {string} id - Patient ID
   * @returns {Promise<Object>} - Deletion result
   */
  async deletePatient(id) {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.delete(`/api/patients/${id}`, config);
      
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
  
  // Remove this block:
  // /**
  //  * Get patient medical records
  //  * @param {string} id - Patient ID
  //  * @returns {Promise<Object>} - Medical records data
  //  */
  // async getPatientMedicalRecords(id) {
  //   try {
  //     if (!api) {
  //       api = (await import('../utils/api')).default;
  //     }
  //     
  //     const config = { headers: getAuthHeaders() };
  //     const response = await api.get(`/api/patients/${id}/medical-records`, config);
  //     
  //     if (response.data && response.data.success) {
  //       return {
  //         success: true,
  //         records: response.data.data,
  //         message: response.data.message
  //       };
  //     }
  //     
  //     return {
  //       success: false,
  //       records: null,
  //       message: response.data?.message || 'Failed to fetch medical records'
  //     };
  //   } catch (error) {
  //     console.error(`Error fetching medical records for patient ${id}:`, error);
  //     throw error;
  //   }
  // },
  
  /**
   * Update patient medical records
   * @param {string} id - Patient ID
   * @param {Object} recordsData - Updated medical records data
   * @returns {Promise<Object>} - Updated records data
   */
  async updatePatientMedicalRecords(id, recordsData) {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.put(`/api/patients/${id}/medical-records`, recordsData, config);
      
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
  },

  /**
   * Get patient and user data from localStorage
   * @returns {Object} - Combined user and patient data
   */
  getLocalPatientData() {
    try {
      if (typeof window === 'undefined') return {};
      
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const patient = JSON.parse(localStorage.getItem('patient') || 'null');
      
      return {
        user: user || null,
        patient: patient || null,
        token: localStorage.getItem('token') || null
      };
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
      return { user: null, patient: null, token: null };
    }
  },
  /**
   * Get a patient by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Patient data
   */
  async getPatientByUserId(userId) {
    try {
      if (!api) {
        api = (await import('../utils/api')).default;
      }
      
      const config = { headers: getAuthHeaders() };
      const response = await api.get(`/api/patients/user/${userId}`, config);
      
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
        message: response.data?.message || 'Failed to fetch patient by user ID'
      };
    } catch (error) {
      console.error(`Error fetching patient with user ID ${userId}:`, error);
      return {
        success: false,
        patient: null,
        message: error.response?.data?.message || 'Error fetching patient data'
      };
    }
  },
};

// Export as both default and named export
export { patientService };
export default patientService;