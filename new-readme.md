# Hospital Management System

A comprehensive hospital management system built with the MERN stack (MongoDB, Express, React, Node.js) that streamlines hospital operations, patient management, and medical record keeping.

## Implemented Features

### Frontend Features

#### Modern UI Components
- **Responsive Design**: All pages are fully responsive and work on mobile, tablet, and desktop devices
- **Component Library**: Custom UI components built on top of Tailwind CSS with consistent theming
- **Animation & Transitions**: Smooth animations for loading states and page transitions
- **Form Validation**: Client-side validation for all forms with error messaging
- **Error Handling**: Comprehensive error states with user-friendly messages and retry options

#### Authentication & User Management
- **Login System**: Secure login with JWT token authentication
- **Registration Flow**: Multi-step registration process with role-based fields
- **Password Management**: Password reset and recovery workflows
- **Role-Based Access**: Different interfaces for patients, doctors, and administrators
- **Profile Management**: User profile editing with avatar upload

#### Patient Portal
- **Patient Dashboard**: Personalized patient dashboard with health summaries
- **Medical Records**: View complete medical history and records
- **Appointment Booking**: Schedule, reschedule, and cancel appointments
- **Medication Management**: Track current medications and prescription history
- **Bed Assignment**: View current bed assignment and history
- **Profile Management**: Update personal and health information

#### Admin Dashboard
- **Statistics Overview**: Real-time analytics of hospital operations
- **Patient Management**: View and manage all patient records
- **Doctor Management**: Manage doctor profiles and schedules
- **Appointment Management**: View and manage all appointments
- **Revenue Analytics**: Track and analyze hospital revenue with detailed charts
- **Bed Management**: Monitor and manage hospital bed allocation
- **Dynamic Data Visualization**: Interactive charts and graphs showing hospital metrics

#### Doctor Portal
- **Doctor Dashboard**: Personalized view of scheduled appointments and patient load
- **Patient Records**: Access to assigned patients' medical histories
- **Prescription Management**: Create and manage digital prescriptions
- **Appointment Calendar**: Manage daily, weekly, and monthly appointment schedules
- **Treatment Plans**: Create and update patient treatment plans

### Backend Features

#### API Architecture
- **RESTful API**: Well-structured RESTful API following best practices
- **Middleware Chain**: Request processing through authentication, validation, and error handling middleware
- **Response Formatting**: Consistent response format with appropriate status codes
- **Rate Limiting**: Protection against excessive API requests
- **Input Validation**: Server-side validation of all inputs using Joi

#### Authentication & Security
- **JWT Authentication**: Secure authentication using JSON Web Tokens
- **Role-Based Authorization**: Access control based on user roles (patient, doctor, admin)
- **Password Encryption**: Secure password storage using bcrypt hashing
- **Token Management**: Token generation, validation, and refresh mechanisms
- **Protected Routes**: Middleware to protect routes based on user roles

#### Database Models
- **User Model**: Core user entity with role-based extensions
- **Patient Model**: Complete patient information including medical history
- **Doctor Model**: Doctor profiles with specializations and availability
- **Appointment Model**: Comprehensive appointment scheduling system
- **Prescription Model**: Digital prescription records with medication details
- **Bed Model**: Hospital bed management system
- **Medical Record Model**: Detailed patient medical records
- **Revenue Model**: Financial transaction tracking

#### Core Features Implementation
- **Patient Management**: Complete CRUD operations for patient records
- **Doctor Management**: Doctor registration, profile management, and scheduling
- **Appointment System**: Scheduling, rescheduling, and cancellation with notifications
- **Prescription System**: Digital prescription creation and management
- **Medical Records**: Creation and retrieval of patient medical history
- **Bed Management**: Allocation and tracking of hospital beds
- **Revenue Tracking**: Financial transaction recording and reporting
- **Dashboard Analytics**: Data aggregation for analytics dashboards

#### Data Management
- **MongoDB Integration**: Efficient data storage and retrieval using MongoDB
- **Mongoose ODM**: Data modeling and validation with Mongoose
- **Query Optimization**: Optimized database queries for performance
- **Aggregation Pipeline**: Complex data aggregation for reporting
- **Data Relationships**: Proper referencing between related entities

## Detailed Technical Implementation

### Frontend Implementation

#### State Management
- **Service Layer**: Dedicated service modules for API communication
- **Error Handling**: Centralized error handling with fallback data
- **Loading States**: Visual feedback during asynchronous operations
- **Data Transformation**: Client-side data processing for display

#### UI/UX Features
- **Conditional Rendering**: Smart component rendering based on data and user roles
- **Toast Notifications**: User feedback for actions and events
- **Form Handling**: Multi-step forms with validation and progress tracking
- **Data Visualization**: Interactive charts using Recharts library
- **Skeleton Loaders**: Content placeholders during data loading
- **Error Boundaries**: Graceful UI recovery from component errors

#### Routing and Navigation
- **Protected Routes**: Role-based access control to pages
- **Lazy Loading**: Component code splitting for performance
- **Navigation Guards**: Preventing unauthorized access
- **Breadcrumb Navigation**: User-friendly page hierarchy

### Backend Implementation

#### API Endpoints

1. **Authentication API**
   - `/api/auth/register`: User registration with role selection
   - `/api/auth/login`: Authentication and token issuance
   - `/api/auth/verify`: Token verification endpoint
   - `/api/auth/refresh`: Token refresh mechanism
   - `/api/auth/forgot-password`: Password recovery workflow
   - `/api/auth/reset-password`: Password reset with token validation

2. **User Management API**
   - `/api/users`: CRUD operations for user accounts
   - `/api/users/profile`: User profile management
   - `/api/users/change-password`: Secure password changing

3. **Patient API**
   - `/api/patients`: Complete patient record management
   - `/api/patients/:id`: Individual patient operations
   - `/api/patients/search`: Patient search functionality
   - `/api/patients/doctor/:doctorId`: Get patients by assigned doctor

4. **Doctor API**
   - `/api/doctors`: Doctor profile management
   - `/api/doctors/:id`: Individual doctor operations
   - `/api/doctors/availability`: Doctor availability management
   - `/api/doctors/specialization/:specialization`: Filtering by specialty

5. **Appointment API**
   - `/api/appointments`: Appointment creation and management
   - `/api/appointments/:id`: Individual appointment operations
   - `/api/appointments/patient/:patientId`: Patient's appointments
   - `/api/appointments/doctor/:doctorId`: Doctor's appointments
   - `/api/appointments/date/:date`: Appointments by date

6. **Prescription API**
   - `/api/prescriptions`: Prescription creation and management
   - `/api/prescriptions/:id`: Individual prescription operations
   - `/api/prescriptions/patient/:patientId`: Patient's prescriptions
   - `/api/prescriptions/doctor/:doctorId`: Prescriptions issued by doctor

7. **Medical Record API**
   - `/api/medical-records`: Medical record creation and retrieval
   - `/api/medical-records/:id`: Individual record operations
   - `/api/medical-records/patient/:patientId`: Patient's medical history

8. **Bed Management API**
   - `/api/beds`: Hospital bed management
   - `/api/beds/:id`: Individual bed operations
   - `/api/beds/ward/:wardId`: Beds by hospital ward
   - `/api/beds/patient/:patientId`: Patient's bed assignment

9. **Revenue API**
   - `/api/revenue`: Financial transaction recording
   - `/api/revenue/summary`: Revenue summary statistics
   - `/api/revenue/monthly`: Monthly revenue breakdown
   - `/api/revenue/by-source`: Revenue categorized by source

10. **Dashboard API**
    - `/api/dashboard/admin`: Admin dashboard statistics
    - `/api/dashboard/admin/stats`: Summary statistics for admin
    - `/api/dashboard/admin/patient-visits`: Patient visit analytics
    - `/api/dashboard/admin/appointments/today`: Today's appointments
    - `/api/dashboard/admin/doctor-schedule`: Doctor scheduling information
    - `/api/dashboard/doctor`: Doctor dashboard statistics
    - `/api/dashboard/patient`: Patient dashboard statistics

#### Middleware Implementation
- **Authentication Middleware**: Validates JWT and attaches user to request
- **Role Authorization**: Checks user roles for route access (`admin`, `doctor`, `patient`)
- **Error Handling**: Global error handling middleware
- **Request Validation**: Validates request bodies against schemas
- **Logging**: Request logging for debugging and monitoring

#### Model Implementations

1. **User Model**
   - Base user information (name, email, password)
   - Role-based access control
   - Profile image and contact information

2. **Patient Model**
   - Extended user information
   - Medical information (blood type, allergies)
   - Physical metrics (height, weight)
   - Emergency contacts

3. **Doctor Model**
   - Professional information (specialization, experience)
   - Availability schedule
   - Consultation fees
   - Qualifications and certifications

4. **Appointment Model**
   - Scheduling information (date, time)
   - Type of appointment
   - Status tracking
   - Patient and doctor references
   - Payment information

5. **Prescription Model**
   - Diagnosis information
   - Medication details with dosage instructions
   - Duration and frequency
   - Doctor and patient references

6. **Medical Record Model**
   - Diagnosis and treatment information
   - Vital signs recording
   - Lab results and attachments
   - Follow-up recommendations

7. **Bed Model**
   - Bed number and ward information
   - Status tracking (available, occupied, maintenance)
   - Patient assignment
   - History of occupancy

8. **Revenue Model**
   - Transaction information
   - Source categorization
   - Amount and payment method
   - References to related entities

## Example API Requests and Responses

### Authentication

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

### Admin Dashboard

#### Get Dashboard Statistics
```
GET /api/dashboard/admin/stats
```
Response:
```json
{
  "success": true,
  "data": {
    "patients": {
      "total": 3721,
      "growth": 12
    },
    "beds": {
      "available": 48,
      "total": 60,
      "occupancyRate": 20
    },
    "appointments": {
      "today": 24,
      "completionRate": 5
    },
    "revenue": {
      "currentMonth": 23485,
      "growth": 14
    }
  }
}
```

### Revenue Management

#### Get Revenue Summary
```
GET /api/revenue/summary
```
Response:
```json
{
  "currentMonth": {
    "total": 23485,
    "count": 145,
    "month": "August"
  },
  "previousMonth": {
    "total": 20500,
    "count": 132,
    "month": "July"
  },
  "growth": 14.56,
  "bySource": [
    { "_id": "Appointment", "totalAmount": 8350, "count": 85 },
    { "_id": "Medicine", "totalAmount": 6275, "count": 32 },
    { "_id": "Lab", "totalAmount": 4200, "count": 18 },
    { "_id": "Bed", "totalAmount": 3750, "count": 8 },
    { "_id": "Surgery", "totalAmount": 910, "count": 2 }
  ]
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

## Technology Stack

### Frontend
- **React.js**: UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Recharts**: Interactive charts and graphs
- **Lucide React**: Modern icon library
- **React Hook Form**: Form validation and handling
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **Joi**: Request validation
- **Multer**: File upload handling
- **Nodemailer**: Email sending

### DevOps
- **Git**: Version control
- **MongoDB Atlas**: Cloud database
- **Render/Vercel**: Application hosting

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Medical icons by [Flaticon](https://www.flaticon.com/)
- UI inspired by modern healthcare applications
