import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage({
        type: 'success',
        text: 'Thank you! Your message has been sent successfully.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage(null);
      }, 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <FaPhone className="h-6 w-6" />,
      title: "Phone",
      details: [
        "+91 8377012270"
      ]
    },
    {
      icon: <FaEnvelope className="h-6 w-6" />,
      title: "Email",
      details: [
        "eshaanmanchanda01@gmail.com"
      ]
    },
    {
      icon: <FaMapMarkerAlt className="h-6 w-6" />,
      title: "Address",
      details: [
        "37 Block Ashok Nagar,",
        "New Delhi, Delhi 110018",
        "India"
      ]
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Working Hours",
      details: [
        "Monday - Friday: 8:00 AM - 8:00 PM",
        "Saturday: 9:00 AM - 5:00 PM",
        "Sunday: Closed"
      ]
    }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Have questions about Health Nest? We're here to help and would love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>
      
      <div className="container mx-auto max-w-6xl px-4 -mt-10">
        {/* Contact Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {contactInfo.map((info, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{info.title}</h3>
              </div>
              <div className="text-gray-600 ml-2">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="mb-1">
                    {detail}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <motion.div 
            className="lg:col-span-3 bg-white p-8 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-blue-800">Send Us a Message</h2>
            
            {submitMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 mb-6 rounded-lg ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-100 text-green-800 border-l-4 border-green-500' 
                    : 'bg-red-100 text-red-800 border-l-4 border-red-500'
                }`}
              >
                {submitMessage.text}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Please provide details about your inquiry..."
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center font-medium text-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="h-5 w-5 mr-2" />
                    <span>Send Message</span>
                  </div>
                )}
              </button>
            </form>
          </motion.div>
          
          {/* Contact Details and Social */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-blue-800 text-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6">Connect With Us</h3>
              <p className="mb-6 text-blue-100">
                Feel free to reach out to us on social media or through our contact information.
              </p>
              
              <div className="space-y-4">
                <a 
                  href="https://www.linkedin.com/in/eshaan-manchanda/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  <FaLinkedin className="h-6 w-6 mr-3" />
                  <span>Connect on LinkedIn</span>
                  <ChevronRight className="h-5 w-5 ml-auto" />
                </a>
                
                <a 
                  href="https://github.com/EshaanManchanda" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  <FaGithub className="h-6 w-6 mr-3" />
                  <span>Follow on GitHub</span>
                  <ChevronRight className="h-5 w-5 ml-auto" />
                </a>
                
                <a 
                  href="mailto:eshaanmanchanda01@gmail.com" 
                  className="flex items-center p-3 bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  <FaEnvelope className="h-6 w-6 mr-3" />
                  <span>Send an Email</span>
                  <ChevronRight className="h-5 w-5 ml-auto" />
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Our Location</h3>
              </div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.5002353535904!2d77.17746081508854!3d28.673022982399897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d02e1b4c22329%3A0xa9f0a07e65f01b67!2sAshok%20Nagar%2C%20GTB%20Nagar%2C%20Delhi%2C%20110018!5e0!3m2!1sen!2sin!4v1649191200000!5m2!1sen!2sin" 
                width="100%" 
                height="250" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Health Nest Location"
                className="w-full"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <motion.section
        className="container mx-auto max-w-4xl px-4 mt-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-10">Frequently Asked Questions</h2>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            <div className="p-6 hover:bg-blue-50 transition-colors duration-300">
              <h3 className="text-xl font-medium text-gray-800 mb-2">What is Health Nest?</h3>
              <p className="text-gray-600">Health Nest is a comprehensive hospital management system designed to streamline healthcare operations, improve patient care, and enhance administrative efficiency.</p>
            </div>
            
            <div className="p-6 hover:bg-blue-50 transition-colors duration-300">
              <h3 className="text-xl font-medium text-gray-800 mb-2">How can I book an appointment?</h3>
              <p className="text-gray-600">You can book appointments through our online portal by registering as a patient, or you can contact us directly by phone or email.</p>
            </div>
            
            <div className="p-6 hover:bg-blue-50 transition-colors duration-300">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Is my medical data secure?</h3>
              <p className="text-gray-600">Yes, Health Nest prioritizes data security and complies with healthcare data protection regulations to ensure your information is always safe and confidential.</p>
            </div>
            
            <div className="p-6 hover:bg-blue-50 transition-colors duration-300">
              <h3 className="text-xl font-medium text-gray-800 mb-2">How can hospitals implement Health Nest?</h3>
              <p className="text-gray-600">Hospitals interested in implementing Health Nest can contact our team for a consultation. We provide customized solutions based on the hospital's specific needs and requirements.</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ContactUs;
