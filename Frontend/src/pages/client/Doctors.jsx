import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaUserMd, 
  FaHeartbeat, 
  FaClock, 
  FaCalendarCheck, 
  FaSearch, 
  FaGraduationCap, 
  FaStethoscope,
  FaHospital,
  FaStar
} from "react-icons/fa";

// Sample doctor data
const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    experience: 12,
    patients: 1500,
    education: "Harvard Medical School",
    awards: 5,
    availability: "Mon, Wed, Fri",
    rating: 4.9,
    bio: "Dr. Johnson is a board-certified cardiologist with over a decade of experience in treating various heart conditions."
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    experience: 15,
    patients: 2000,
    education: "Johns Hopkins University",
    awards: 7,
    availability: "Tue, Thu, Sat",
    rating: 4.8,
    bio: "Dr. Chen specializes in neurological disorders and has pioneered several treatment methods for complex neurological conditions."
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    experience: 8,
    patients: 2500,
    education: "Stanford Medical School",
    awards: 3,
    availability: "Mon-Fri",
    rating: 4.9,
    bio: "Dr. Rodriguez has dedicated her career to children's health and has a special interest in developmental pediatrics."
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    experience: 20,
    patients: 3000,
    education: "Yale School of Medicine",
    awards: 10,
    availability: "Mon, Wed, Fri",
    rating: 4.7,
    bio: "Dr. Wilson is a leading orthopedic surgeon who has performed over 5,000 successful surgeries throughout his distinguished career."
  },
  {
    id: 5,
    name: "Dr. Aisha Patel",
    specialty: "Dermatology",
    image: "https://randomuser.me/api/portraits/women/37.jpg",
    experience: 10,
    patients: 4000,
    education: "University of Pennsylvania",
    awards: 4,
    availability: "Tue, Thu, Sat",
    rating: 4.8,
    bio: "Dr. Patel is an expert in cosmetic and medical dermatology, helping patients with skin conditions and aesthetic concerns."
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialty: "Oncology",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    experience: 18,
    patients: 1800,
    education: "Columbia University",
    awards: 9,
    availability: "Mon-Fri",
    rating: 4.9,
    bio: "Dr. Kim is a compassionate oncologist who works closely with patients to develop personalized cancer treatment plans."
  }
];

// Features data
const features = [
  { 
    icon: <FaUserMd size={36} className="text-blue-500" />,
    title: "Expert Specialists", 
    description: "Our doctors are board-certified specialists with extensive training and experience in their respective fields."
  },
  { 
    icon: <FaHeartbeat size={36} className="text-red-500" />,
    title: "Compassionate Care", 
    description: "We believe in treating patients with dignity, respect, and understanding throughout their healthcare journey."
  },
  { 
    icon: <FaClock size={36} className="text-green-500" />,
    title: "Available 24/7", 
    description: "Our medical team is available around the clock to provide emergency care whenever you need it."
  },
  { 
    icon: <FaCalendarCheck size={36} className="text-purple-500" />,
    title: "Easy Appointments", 
    description: "Schedule appointments online or by phone with flexible timing options to fit your busy schedule."
  },
  { 
    icon: <FaGraduationCap size={36} className="text-yellow-500" />,
    title: "Leading Education", 
    description: "Our doctors are graduates from top medical schools and continue to stay updated with the latest medical advancements."
  },
  { 
    icon: <FaStethoscope size={36} className="text-indigo-500" />,
    title: "Comprehensive Services", 
    description: "From routine check-ups to specialized treatments, we offer a wide range of medical services under one roof."
  }
];

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData);
  
  // List of unique specialties
  const specialties = ["All", ...new Set(doctorsData.map(doctor => doctor.specialty))];
  
  // Filter doctors based on search and specialty
  useEffect(() => {
    let filtered = doctorsData;
    
    if (selectedSpecialty !== "All") {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty]);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Meet Our World-Class Medical Team
              </motion.h1>
              <motion.p 
                className="text-xl mb-8 text-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Dedicated professionals committed to providing exceptional healthcare services with compassion and expertise.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link 
                  to="/appointments" 
                  className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300 inline-flex items-center"
                >
                  <FaCalendarCheck className="mr-2" />
                  Book an Appointment
                </Link>
              </motion.div>
            </div>
            <div className="lg:w-1/2">
              <motion.div 
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-blue-700 p-6 rounded-lg shadow-lg">
                  <FaUserMd className="text-5xl text-blue-300 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Expert Specialists</h3>
                  <p className="text-blue-100">Board-certified doctors in all major specialties</p>
                </div>
                <div className="bg-blue-700 p-6 rounded-lg shadow-lg">
                  <FaClock className="text-5xl text-blue-300 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Available 24/7</h3>
                  <p className="text-blue-100">Round-the-clock care for all medical needs</p>
                </div>
                <div className="bg-blue-700 p-6 rounded-lg shadow-lg">
                  <FaHeartbeat className="text-5xl text-blue-300 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Compassionate Care</h3>
                  <p className="text-blue-100">Putting patients first in everything we do</p>
                </div>
                <div className="bg-blue-700 p-6 rounded-lg shadow-lg">
                  <FaHospital className="text-5xl text-blue-300 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Modern Facilities</h3>
                  <p className="text-blue-100">State-of-the-art equipment and technology</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Doctors</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Our medical professionals are committed to providing exceptional care with advanced medical expertise and a compassionate approach to treatment.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Doctors Listing Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Medical Specialists</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Meet our team of experienced doctors who are experts in their respective fields.</p>
          </motion.div>
          
          {/* Filter and Search */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              {specialties.map((specialty, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    selectedSpecialty === specialty
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setSelectedSpecialty(specialty)}
                >
                  {specialty}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-full h-48 object-cover" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">{doctor.name}</h3>
                    <p className="text-blue-300">{doctor.specialty}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar 
                          key={i}
                          className={`${i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'} h-4 w-4`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-700 ml-2">{doctor.rating}/5</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-700">
                      <FaGraduationCap className="mr-2 text-blue-500" />
                      {doctor.education}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaUserMd className="mr-2 text-blue-500" />
                      {doctor.experience} years experience
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaClock className="mr-2 text-blue-500" />
                      Available: {doctor.availability}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{doctor.bio}</p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Link 
                      to={`/doctor/${doctor.id}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-300 font-medium"
                    >
                      View Profile
                    </Link>
                    <Link 
                      to={`/appointments?doctor=${doctor.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-300"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <FaUserMd className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Expert Medical Care?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">Schedule an appointment with one of our specialists and take the first step towards better health.</p>
          <Link 
            to="/appointments" 
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300 inline-flex items-center"
          >
            <FaCalendarCheck className="mr-2" />
            Book an Appointment Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Doctors; 