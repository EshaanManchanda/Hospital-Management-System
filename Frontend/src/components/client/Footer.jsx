import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [activeSection, setActiveSection] = useState(null);
  const [emailInput, setEmailInput] = useState('');

  const socialLinks = [
    { icon: FaTwitter, href: 'https://x.com/EshaanManchanda', color: 'bg-[#1DA1F2]', hoverColor: 'bg-white text-[#1DA1F2]' },
    { icon: FaFacebookF, href: 'https://www.facebook.com/eshaan.official2002/', color: 'bg-[#1877F2]', hoverColor: 'bg-white text-[#1877F2]' },
    { icon: FaInstagram, href: 'https://www.instagram.com/eshaan.official2002/', color: 'bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]', hoverColor: 'bg-white text-[#DD2A7B]' },
    { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/eshaan-manchanda/', color: 'bg-[#0A66C2]', hoverColor: 'bg-white text-[#0A66C2]' },
  ];

  const footerLinks = [
    { title: 'About Us', to: '/about-us' },
    { title: 'Services', to: '/services' },
    { title: 'Privacy Policy', to: '/privacy-policy' },
    { title: 'Terms of Service', to: '/terms-of-service' },
    { title: 'Contact Us', to: '/contact-us' },
  ];

  const contactInfo = [
    { icon: FaPhone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: FaEnvelope, text: 'info@healthnest.com', href: 'mailto:info@healthnest.com' },
    { icon: FaMapMarkerAlt, text: '123 Medical Center Dr, Healthcare City, HC 12345', href: 'https://maps.google.com' },
  ];

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${emailInput}`);
    setEmailInput('');
  };

  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-montserrat shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.2)]">
      {/* Top Wave Decoration */}
      <div className="w-full overflow-hidden">
        <svg className="w-full h-12 fill-blue-600 translate-y-1" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-white">Health Nest</h3>
              <div className="w-16 h-1 bg-white mt-2 mb-4 rounded-full"></div>
              <p className="text-[1rem] text-blue-100">
                Revolutionizing healthcare management with cutting-edge technology and compassionate care.
              </p>
            </motion.div>
            
            <div className="flex space-x-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${link.color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 overflow-hidden group`}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <link.icon className="text-lg group-hover:scale-110 transition-transform duration-300" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">Quick Links</span>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '50px' }}
                transition={{ duration: 0.7 }}
                className="h-[2px] bg-white"
              />
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className="text-blue-100 hover:text-white transition-colors duration-300 text-base flex items-center group"
                  >
                    <motion.span
                      className="inline-block mr-2 opacity-0 group-hover:opacity-100"
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                    >
                      <FaChevronRight size={10} />
                    </motion.span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.title}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">Contact Us</span>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '50px' }}
                transition={{ duration: 0.7 }}
                className="h-[2px] bg-white"
              />
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start"
                >
                  <div className="bg-blue-500 rounded-full p-2 mr-3 mt-1">
                    <item.icon className="text-white w-4 h-4" />
                  </div>
                  <a 
                    href={item.href}
                    className="text-blue-100 hover:text-white transition-colors duration-300"
                  >
                    {item.text}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">Stay Updated</span>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '50px' }}
                transition={{ duration: 0.7 }}
                className="h-[2px] bg-white"
              />
            </h3>
            <p className="text-blue-100 text-sm">Subscribe to our newsletter for the latest updates on healthcare services and technology.</p>
            
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex flex-col space-y-3">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Your email address"
                  className="px-4 py-2 rounded-md bg-blue-700 border border-blue-400 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <motion.button
                  type="submit"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-blue-400/30 text-center">
          <p className="text-sm text-blue-100">
            © {currentYear} Health Nest. All rights reserved.
          </p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 flex items-center justify-center text-sm text-blue-100"
          >
            Made with 
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5
              }}
              className="mx-2"
            >
              <FaHeart className="text-red-400" />
            </motion.div>
            by Health Nest Team
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
