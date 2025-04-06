import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaTwitter, href: 'https://x.com/YazdanH7', color: 'bg-[#1DA1F2] hover:bg-[#1DA1F2]/80' },
    { icon: FaFacebookF, href: 'https://www.facebook.com/yazdan.yazdankhan.7/', color: 'bg-[#1877F2] hover:bg-[#1877F2]/80' },
    { icon: FaInstagram, href: 'https://www.instagram.com/yazdan.haider23/', color: 'bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90' },
    { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/yazdan-haider', color: 'bg-[#0A66C2] hover:bg-[#0A66C2]/80' },
  ];

  const footerLinks = [
    { title: 'About Us', to: '/about-us' },
    { title: 'Services', to: '/services' },
    { title: 'Privacy Policy', to: '/privacy-policy' },
    { title: 'Terms of Service', to: '/terms-of-service' },
    { title: 'Contact Us', to: '/contact-us' },
  ];

  return (
    <footer className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-[hsl(var(--primary-foreground))] font-montserrat shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[hsl(var(--accent))]">Health Nest</h3>
            <p className="text-[1rem] opacity-90">
              Revolutionizing healthcare management with cutting-edge technology and compassionate care.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${link.color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition duration-300`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <link.icon className="text-lg" />
                </motion.a>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex items-center justify-center md:justify-end">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12">
              {footerLinks.map((link, index) => (
                <motion.div key={index} whileHover={{ y: -3 }}>
                  <Link
                    to={link.to}
                    className="text-[hsl(var(--primary-foreground))] hover:text-[hsl(var(--accent))] transition-colors duration-300 text-base font-medium"
                  >
                    {link.title}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[hsl(var(--accent))]/20 text-center">
          <p className="text-sm opacity-90">
            © {currentYear} Health Nest. All rights reserved.
          </p>
          <p className="mt-2 flex items-center justify-center text-sm opacity-90">
            Made with <FaHeart className="text-[hsl(var(--accent))] mx-1 animate-pulse" /> by Health Nest Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
