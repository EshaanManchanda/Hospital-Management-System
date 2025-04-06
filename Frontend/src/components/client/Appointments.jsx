import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Login from "./Login";
import {
  FaCalendarPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import LoginContext from "@/contexts/LoginContext";

const Appointments = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    doctorId: "",
    appointmentDate: new Date(),
    notes: "",
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedDoctorId = queryParams.get("doctorId");

  useEffect(() => {
    setDoctors([
      { id: 1, name: "Dr. Smith", specialty: "Cardiology" },
      { id: 2, name: "Dr. Johnson", specialty: "Pediatrics" },
      { id: 3, name: "Dr. Williams", specialty: "Orthopedics" },
    ]);

    setAppointments([
      {
        id: 1,
        patientName: "John Doe",
        doctorId: 1,
        appointmentDate: new Date(),
        notes: "Regular checkup",
        status: "Scheduled",
      },
      {
        id: 2,
        patientName: "Jane Smith",
        doctorId: 2,
        appointmentDate: new Date(Date.now() + 86400000),
        notes: "Follow-up",
        status: "Scheduled",
      },
    ]);

    if (selectedDoctorId) {
      setNewAppointment((prev) => ({ ...prev, doctorId: selectedDoctorId }));
      setShowForm(true);
    }
  }, [selectedDoctorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setNewAppointment((prev) => ({ ...prev, appointmentDate: date }));
  };

  const validateName = (name) => {
    const namePattern = /^[A-Za-z][A-Za-z\s]{3,}$/;
    return namePattern.test(name);
  };

  const validateDate = (date) => {
    return date > new Date();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateName(newAppointment.patientName)) {
      alert(
        "Patient name must start with a letter and be at least 4 characters long."
      );
      return;
    }
    if (!validateDate(newAppointment.appointmentDate)) {
      alert("Appointment date must be in the future.");
      return;
    }
    const appointment = {
      id: appointments.length + 1,
      ...newAppointment,
      status: "Scheduled",
    };
    setAppointments([...appointments, appointment]);
    setNewAppointment({
      patientName: "",
      doctorId: "",
      appointmentDate: new Date(),
      notes: "",
    });
    setShowForm(false);
  };

  const deleteAppointment = (id) => {
    setAppointments(
      appointments.filter((appointment) => appointment.id !== id)
    );
  };

  const completeAppointment = (id) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "Completed" }
          : appointment
      )
    );
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctors
        .find((d) => d.id === appointment.doctorId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isLoggedIn ? (
        <div className="bg-[hsl(var(--background))] min-h-screen p-4 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--primary))] mb-6 sm:mb-8">
            Appointment Management
          </h1>

          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[hsl(var(--accent))] text-white px-6 py-2 rounded-full font-bold flex items-center shadow-md hover:bg-[hsl(var(--accent))/80] transition duration-300"
              onClick={() => setShowForm(!showForm)}
            >
              <FaCalendarPlus className="mr-2" />
              {showForm ? "Cancel" : "New Appointment"}
            </motion.button>
            <div className="relative w-full sm:w-auto">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-[hsl(var(--border))] rounded-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {showForm && (
            <motion.form
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[hsl(var(--card))] p-6 rounded-lg shadow-lg mb-8"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="patientName"
                  placeholder="Patient Name"
                  className="p-2 border border-[hsl(var(--border))] rounded"
                  value={newAppointment.patientName}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="doctorId"
                  className="p-2 border border-[hsl(var(--border))] rounded"
                  value={newAppointment.doctorId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
                <DatePicker
                  selected={newAppointment.appointmentDate}
                  onChange={handleDateChange}
                  className="p-2 border border-[hsl(var(--border))] rounded w-full"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  showTimeSelect
                  minDate={new Date()}
                  required
                />
                <textarea
                  name="notes"
                  placeholder="Notes"
                  className="p-2 border border-[hsl(var(--border))] rounded"
                  value={newAppointment.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="mt-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-[hsl(var(--accent))] text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-[hsl(var(--accent))/80] transition duration-300"
                >
                  Schedule Appointment
                </motion.button>
              </div>
            </motion.form>
          )}

          <div className="bg-[hsl(var(--card))] rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                  <tr>
                    <th className="py-3 px-4 text-left">Patient</th>
                    <th className="py-3 px-4 text-left">Doctor</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))/0.05]"
                      >
                        <td className="py-3 px-4">{appointment.patientName}</td>
                        <td className="py-3 px-4">
                          {
                            doctors.find((d) => d.id === Number(appointment.doctorId))
                              ?.name
                          }
                        </td>
                        <td className="py-3 px-4">
                          {appointment.appointmentDate.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.status === "Completed"
                                ? "bg-green-500 text-white"
                                : "bg-[hsl(var(--accent))] text-white"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              className="text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))]"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-[hsl(var(--hospital-success))] hover:text-[hsl(var(--hospital-success))/80]"
                              title="Complete"
                              onClick={() => completeAppointment(appointment.id)}
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              className="text-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive))/80]"
                              title="Delete"
                              onClick={() => deleteAppointment(appointment.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-4 px-4 text-center text-[hsl(var(--muted-foreground))]"
                      >
                        No appointments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Appointments;
