import React from 'react';
import { FaHeartbeat, FaCogs, FaUsers, FaHospital, FaCalendarAlt, FaUserMd, FaAward, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import profilePic from '@/assets/profile_image.png';

const AboutUs = () => {
  const features = [
    {
      icon: FaHeartbeat,
      title: 'Our Mission',
      description: 'To deliver healthcare solutions that ensure better patient care through efficiency and technological advancement.',
    },
    {
      icon: FaCogs,
      title: 'Our Vision',
      description: 'We aim to revolutionize healthcare management by developing tools that healthcare professionals can rely on.',
    },
    {
      icon: FaUsers,
      title: 'Our Values',
      description: 'We are dedicated to providing innovative, reliable, and user-friendly solutions for healthcare providers worldwide.',
    },
  ];

  const achievements = [
    { icon: FaHospital, count: '20+', label: 'Partnered Hospitals' },
    { icon: FaUserMd, count: '500+', label: 'Medical Professionals' },
    { icon: FaCalendarAlt, count: '10k+', label: 'Appointments Managed' },
    { icon: FaAward, count: '5', label: 'Industry Awards' },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-blue-800 mb-6">About Health Nest</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Health Nest is a cutting-edge hospital management system designed to streamline healthcare operations and improve patient care through innovative technology solutions.
          </p>
        </motion.div>

        {/* Mission, Vision, Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-lg text-center border-t-4 border-blue-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            >
              <feature.icon className="text-6xl text-blue-600 mb-6 mx-auto" />
              <h3 className="text-2xl font-semibold mb-4 text-blue-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-lg">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats/Achievement Section */}
        <motion.div 
          className="bg-blue-800 text-white rounded-2xl p-10 mb-20 shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {achievements.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <item.icon className="text-4xl mx-auto mb-4 text-blue-300" />
                <div className="text-3xl font-bold mb-2">{item.count}</div>
                <div className="text-blue-200">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">Our Team</h2>
          <div className="flex justify-center">
            <motion.div
              className="bg-white p-8 shadow-xl rounded-2xl text-center max-w-md border-b-4 border-blue-500"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative mb-6 inline-block">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-lg opacity-50"></div>
                <img
                  src={profilePic}
                  alt="Eshaan Manchanda"
                  className="w-48 h-48 rounded-full mx-auto relative object-cover border-4 border-white shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-blue-800">Eshaan Manchanda</h3>
              <p className="text-lg text-blue-600 mb-4">Full Stack Developer</p>
              <p className="text-gray-600 mb-6">Passionate about creating innovative healthcare solutions that make a difference in people's lives.</p>
              <div className="flex justify-center space-x-4">
                <a href="https://www.linkedin.com/in/eshaan-manchanda/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <FaLinkedin size={22} />
                </a>
                <a href="https://github.com/EshaanManchanda" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <FaGithub size={22} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Info */}
        <motion.div 
          className="bg-white rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <FaEnvelope className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">eshaanmanchanda01@gmail.com</p>
            </div>
            <div className="p-4">
              <FaPhone className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">+91 8377012270</p>
            </div>
            <div className="p-4">
              <FaMapMarkerAlt className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600">37 Block Ashok Nagar, New Delhi, Delhi 110018</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
