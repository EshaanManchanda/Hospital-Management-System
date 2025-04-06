# Hospital Management System

A comprehensive hospital management system built with the MERN stack (MongoDB, Express, React, Node.js) that streamlines hospital operations, patient management, and medical record keeping.

## Features

### Admin Dashboard
- Real-time analytics of hospital operations
- User management (staff, doctors, patients)
- Inventory management for medicines and supplies
- Revenue tracking and reporting

### Doctor Portal
- Patient appointment management
- Medical record creation and management
- Prescription management
- View patient history and treatment plans

### Patient Portal
- Book and manage appointments
- View medical history and records
- Access prescriptions and medication schedules
- Secure messaging with healthcare providers

### Key Components
- **Authentication & Authorization**: Role-based access control with JWT
- **Patient Management**: Registration, medical history, appointments
- **Doctor Management**: Profiles, specializations, availability
- **Appointment System**: Scheduling, reminders, status tracking
- **Medical Records**: Digital records with attachments
- **Prescription Management**: Digital prescriptions with dosage instructions
- **Inventory Management**: Medicine stock tracking and reordering
- **Reporting**: Custom reports generation for various stakeholders

## Technology Stack

### Frontend
- React.js
- Material UI / Tailwind CSS
- Redux for state management
- React Router for navigation
- Chart.js for analytics visualization

### Backend
- Node.js with Express
- MongoDB for database (with Mongoose ORM)
- JWT for authentication
- RESTful API architecture
- File upload handling

### DevOps
- Git for version control
- MongoDB Atlas for cloud database

## API Documentation with Sample Data

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
```
Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "mobile": "1234567890",
  "gender": "male",
  "dateOfBirth": "1990-01-01"
}
```
Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```
POST /api/auth/login
```
Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Create Patient
```
POST /api/patients/register
```
Request:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "gender": "male",
  "mobile": "1234567890",
  "age": 30,
  "password": "securePassword123",
  "bloodGroup": "O+",
  "height": 175,
  "weight": 70
}
```
Response:
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "userId": "USR-F7A12B3D",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "mobile": "1234567890",
      "gender": "male"
    },
    "patient": {
      // Patient details here
    }
  }
}
```

### Patient Endpoints

#### Get All Patients
```
GET /api/patients
```
Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "contactNumber": "1234567890",
      "gender": "male",
      "dateOfBirth": "1990-01-01",
      "bloodGroup": "O+",
      "height": 175,
      "weight": 70,
      "allergies": ["Peanuts", "Penicillin"],
      "createdAt": "2023-06-15T10:24:55.445Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "contactNumber": "9876543210",
      "gender": "female",
      "dateOfBirth": "1992-05-20",
      "bloodGroup": "A+",
      "height": 165,
      "weight": 55,
      "allergies": ["Shellfish"],
      "createdAt": "2023-06-16T08:15:22.445Z"
    }
  ]
}
```

#### Get Patient by ID
```
GET /api/patients/:id
```
Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "contactNumber": "1234567890",
    "gender": "male",
    "dateOfBirth": "1990-01-01",
    "bloodGroup": "O+",
    "height": 175,
    "weight": 70,
    "allergies": ["Peanuts", "Penicillin"],
    "appointments": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "date": "2023-06-20T09:00:00.000Z",
        "status": "scheduled",
        "doctor": {
          "name": "Dr. Smith",
          "specialization": "Cardiologist"
        }
      }
    ]
  }
}
```

#### Get Patients by Doctor
```
GET /api/patients/doctor/:doctorId
```
Response:
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "email": "john@example.com",
        "contactNumber": "1234567890"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "pages": 1
    }
  }
}
```

### Doctor Endpoints

#### Create Doctor
```
POST /api/doctors
```
Request:
```json
{
  "name": "Dr. Jane Smith",
  "email": "dr.smith@example.com",
  "password": "securePassword123",
  "mobile": "9876543210",
  "gender": "female",
  "dateOfBirth": "1985-05-15",
  "specialization": "Cardiologist",
  "experience": 10,
  "fee": 100,
  "about": "Experienced cardiologist with a focus on heart health.",
  "workingHours": {
    "start": "09:00",
    "end": "17:00"
  },
  "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "qualifications": [
    {
      "degree": "MD",
      "institution": "Harvard Medical School",
      "year": 2010
    }
  ]
}
```
Response:
```json
{
  "success": true,
  "message": "Doctor created successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c88",
    "user": {
      "userId": "USR-F7A12B3D",
      "name": "Dr. Jane Smith",
      "email": "dr.smith@example.com",
      "mobile": "9876543210"
    },
    "specialization": "Cardiologist",
    "experience": 10,
    "fee": 100,
    "about": "Experienced cardiologist with a focus on heart health.",
    "workingHours": {
      "start": "09:00",
      "end": "17:00"
    },
    "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "isAvailable": true
  }
}
```

#### Get All Doctors
```
GET /api/doctors
```
Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c88",
      "name": "Dr. Smith",
      "email": "smith@example.com",
      "contactNumber": "1122334455",
      "specialization": "Cardiologist",
      "experience": 10,
      "consultationFee": 100,
      "availability": [
        {
          "day": "Monday",
          "slots": ["09:00-12:00", "16:00-18:00"]
        },
        {
          "day": "Wednesday",
          "slots": ["09:00-12:00", "16:00-18:00"]
        }
      ]
    },
    {
      "_id": "60d21b4667d0d8992e610c89",
      "name": "Dr. Johnson",
      "email": "johnson@example.com",
      "contactNumber": "5566778899",
      "specialization": "Dermatologist",
      "experience": 7,
      "consultationFee": 80,
      "availability": [
        {
          "day": "Tuesday",
          "slots": ["10:00-13:00", "15:00-17:00"]
        },
        {
          "day": "Thursday",
          "slots": ["10:00-13:00", "15:00-17:00"]
        }
      ]
    }
  ]
}
```

#### Get Doctor by ID
```
GET /api/doctors/:id
```
Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c88",
    "name": "Dr. Smith",
    "email": "smith@example.com",
    "contactNumber": "1122334455",
    "specialization": "Cardiologist",
    "experience": 10,
    "consultationFee": 100,
    "availability": [
      {
        "day": "Monday",
        "slots": ["09:00-12:00", "16:00-18:00"]
      },
      {
        "day": "Wednesday",
        "slots": ["09:00-12:00", "16:00-18:00"]
      }
    ],
    "qualifications": [
      {
        "degree": "MD",
        "institution": "Harvard Medical School",
        "year": 2010
      }
    ]
  }
}
```

### Appointment Endpoints

#### Create Appointment
```
POST /api/appointments
```
Request:
```json
{
  "doctorId": "67f181bd797eba11169d595d",
  "date": "2023-06-20",
  "time": "09:00",
  "type": "consultation",
  "description": "Routine checkup",
  "symptoms": "No symptoms reported"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "patient": "67f177d2dd9f28b38c801f30",
    "doctor": "67f181bd797eba11169d595d",
    "date": "2023-06-20T00:00:00.000Z",
    "time": "09:00",
    "status": "scheduled",
    "type": "consultation",
    "description": "Routine checkup",
    "symptoms": "No symptoms reported",
    "paymentStatus": "pending",
    "paymentAmount": 100,
    "_id": "67f18441797eba11169d5972",
    "createdAt": "2025-04-05T19:28:01.984Z",
    "updatedAt": "2025-04-05T19:28:01.984Z",
    "__v": 0
  }
}
```

#### Get Doctor's Appointments
```
GET /api/appointments/doctor/:doctorId
```
Response:
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "date": "2023-06-20T09:00:00.000Z",
        "status": "scheduled",
        "type": "consultation",
        "patient": {
          "name": "John Doe",
          "contactNumber": "1234567890",
          "email": "john@example.com"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "pages": 1
    }
  }
}
```

### Medicine Endpoints

#### Create Medicine
```
POST /api/medicines
```
Request:
```json
{
  "name": "Amoxicillin",
  "description": "Antibiotic medication",
  "manufacturer": "Pfizer",
  "category": "Tablet",
  "price": 15.99,
  "stock": 100,
  "expiryDate": "2024-06-15",
  "dosageForm": "Oral",
  "strength": "500mg",
  "sideEffects": ["Nausea", "Diarrhea", "Rash"],
  "contraindications": ["Penicillin allergy"],
  "requiresPrescription": true
}
```
Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c90",
    "name": "Amoxicillin",
    "description": "Antibiotic medication",
    "manufacturer": "Pfizer",
    "category": "Tablet",
    "price": 15.99,
    "stock": 100,
    "expiryDate": "2024-06-15T00:00:00.000Z",
    "dosageForm": "Oral",
    "strength": "500mg",
    "sideEffects": ["Nausea", "Diarrhea", "Rash"],
    "contraindications": ["Penicillin allergy"],
    "requiresPrescription": true,
    "isActive": true,
    "createdAt": "2023-06-15T11:10:15.445Z"
  }
}
```

#### Search Medicines
```
GET /api/medicines/search?query=amox
```
Response:
```json
{
  "success": true,
  "data": {
    "medicines": [
      {
        "_id": "60d21b4667d0d8992e610c90",
        "name": "Amoxicillin",
        "description": "Antibiotic medication",
        "manufacturer": "Pfizer",
        "category": "Tablet",
        "price": 15.99,
        "stock": 100,
        "strength": "500mg"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "pages": 1
    }
  }
}
```

### Prescription Endpoints

#### Create Prescription
```
POST /api/prescriptions
```
Request:
```json
{
  "patient": "60d21b4667d0d8992e610c85",
  "doctor": "60d21b4667d0d8992e610c88",
  "diagnosis": "Bacterial infection",
  "medicines": [
    {
      "medicine": "60d21b4667d0d8992e610c90",
      "dosage": "1 tablet",
      "frequency": "3 times a day",
      "duration": "7 days",
      "notes": "Take after meals"
    }
  ],
  "instructions": "Complete the full course of antibiotics even if you feel better",
  "followUpDate": "2023-06-27T09:00:00.000Z"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c92",
    "patient": {
      "name": "John Doe",
      "contactNumber": "1234567890",
      "email": "john@example.com"
    },
    "doctor": {
      "name": "Dr. Smith",
      "specialization": "Cardiologist"
    },
    "diagnosis": "Bacterial infection",
    "medicines": [
      {
        "medicine": {
          "name": "Amoxicillin",
          "strength": "500mg",
          "dosageForm": "Oral"
        },
        "dosage": "1 tablet",
        "frequency": "3 times a day",
        "duration": "7 days",
        "notes": "Take after meals"
      }
    ],
    "instructions": "Complete the full course of antibiotics even if you feel better",
    "startDate": "2023-06-15T11:30:22.445Z",
    "followUpDate": "2023-06-27T09:00:00.000Z",
    "status": "active",
    "createdAt": "2023-06-15T11:30:22.445Z"
  }
}
```

#### Get Patient's Prescriptions
```
GET /api/prescriptions/patient/:patientId
```
Response:
```json
{
  "success": true,
  "data": {
    "prescriptions": [
      {
        "_id": "60d21b4667d0d8992e610c92",
        "diagnosis": "Bacterial infection",
        "doctor": {
          "name": "Dr. Smith",
          "specialization": "Cardiologist"
        },
        "startDate": "2023-06-15T11:30:22.445Z",
        "status": "active",
        "medicines": [
          {
            "medicine": {
              "name": "Amoxicillin",
              "strength": "500mg"
            },
            "dosage": "1 tablet",
            "frequency": "3 times a day"
          }
        ]
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "pages": 1
    }
  }
}
```

### Medical Record Endpoints

#### Create Medical Record
```
POST /api/medical-records
```
Request:
```json
{
  "patient": "60d21b4667d0d8992e610c85",
  "doctor": "60d21b4667d0d8992e610c88",
  "diagnosis": "Hypertension",
  "treatment": "Prescribed medication and lifestyle changes",
  "notes": "Patient needs to monitor blood pressure regularly",
  "vitalSigns": {
    "temperature": 37.2,
    "heartRate": 78,
    "bloodPressure": "140/90",
    "respiratoryRate": 18,
    "oxygenSaturation": 98,
    "height": 175,
    "weight": 70
  },
  "followUpDate": "2023-07-15T09:00:00.000Z"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c95",
    "patient": {
      "name": "John Doe",
      "contactNumber": "1234567890",
      "email": "john@example.com"
    },
    "doctor": {
      "name": "Dr. Smith",
      "specialization": "Cardiologist"
    },
    "diagnosis": "Hypertension",
    "treatment": "Prescribed medication and lifestyle changes",
    "notes": "Patient needs to monitor blood pressure regularly",
    "vitalSigns": {
      "temperature": 37.2,
      "heartRate": 78,
      "bloodPressure": "140/90",
      "respiratoryRate": 18,
      "oxygenSaturation": 98,
      "height": 175,
      "weight": 70
    },
    "date": "2023-06-15T12:00:15.445Z",
    "followUpDate": "2023-07-15T09:00:00.000Z",
    "status": "open"
  }
}
```

#### Get Patient's Medical Records
```
GET /api/medical-records/patient/:patientId
```
Response:
```json
{
  "success": true,
  "data": {
    "medicalRecords": [
      {
        "_id": "60d21b4667d0d8992e610c95",
        "diagnosis": "Hypertension",
        "treatment": "Prescribed medication and lifestyle changes",
        "doctor": {
          "name": "Dr. Smith",
          "specialization": "Cardiologist"
        },
        "date": "2023-06-15T12:00:15.445Z",
        "status": "open",
        "vitalSigns": {
          "bloodPressure": "140/90",
          "heartRate": 78
        }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "pages": 1
    }
  }
}
```

### Dashboard Endpoints

#### Admin Dashboard Stats
```
GET /api/dashboard/admin
```
Response:
```json
{
  "success": true,
  "data": {
    "totalUsers": 45,
    "usersByRole": {
      "admin": 3,
      "doctor": 12,
      "patient": 30
    },
    "totalAppointments": 120,
    "appointmentStats": {
      "scheduled": 50,
      "completed": 60,
      "cancelled": 10
    },
    "patientStats": {
      "total": 30,
      "new": 5
    },
    "revenueStats": {
      "total": 12500,
      "monthly": 3500,
      "yearly": 12500
    },
    "medicineStats": {
      "total": 200,
      "lowStock": 15
    }
  }
}
```

#### Doctor Dashboard Stats
```
GET /api/dashboard/doctor
```
Response:
```json
{
  "success": true,
  "data": {
    "totalAppointments": 45,
    "appointmentStats": {
      "scheduled": 20,
      "completed": 22,
      "cancelled": 3
    },
    "patientStats": {
      "total": 35,
      "new": 8
    },
    "upcomingAppointments": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "date": "2023-06-20T09:00:00.000Z",
        "patient": {
          "name": "John Doe",
          "contactNumber": "1234567890"
        }
      }
    ],
    "recentPrescriptions": 12,
    "recentMedicalRecords": 15
  }
}
```

#### Patient Dashboard Stats
```
GET /api/dashboard/patient
```
Response:
```json
{
  "success": true,
  "data": {
    "appointments": {
      "total": 8,
      "upcoming": 2,
      "completed": 6
    },
    "prescriptions": {
      "total": 5,
      "active": 2
    },
    "medicalRecords": {
      "total": 6,
      "recentVisit": "2023-06-15T12:00:15.445Z"
    },
    "upcomingAppointments": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "date": "2023-06-20T09:00:00.000Z",
        "doctor": {
          "name": "Dr. Smith",
          "specialization": "Cardiologist"
        }
      }
    ]
  }
}
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### Backend
1. Navigate to the backend directory:
   ```
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```
   cd Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and go to `http://localhost:3000`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Medical icons by [Flaticon](https://www.flaticon.com/)
- UI inspired by modern healthcare applications 