import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa';
import Logo from '@/assets/logo.svg';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('/');
    const location = useLocation();

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location]);

    const navItems = [
        { title: 'Home', path: '/' },
        { title: 'Appointments', path: '/appointments' },
        { title: 'Patients', path: '/patients' },
        { title: 'Doctors', path: '/doctors' },
        { title: 'About', path: '/about-us' },
        { title: 'Contact', path: '/contact-us' },
    ];

    return (
        <header className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] py-3 px-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src={Logo} alt="Health Nest Logo" className="h-10 w-auto" />
                        <span className="text-2xl font-bold text-[hsl(var(--accent))]">Health Nest</span>
                    </Link>

                    <nav className="hidden md:flex space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative px-3 py-2 text-base font-medium text-[hsl(var(--primary-foreground))] hover:text-[hsl(var(--accent))] transition-colors duration-300 ${
                                    activeItem === item.path ? 'text-[hsl(var(--accent))]' : ''
                                }`}
                            >
                                {item.title}
                                {activeItem === item.path && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--accent))]"
                                        layoutId="underline"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center space-x-3">
                        <Link to="/signup" className="bg-[hsl(var(--accent))] text-white px-4 py-1.5 rounded-full hover:bg-[hsl(var(--accent))/80] transition duration-300 text-sm font-medium shadow-md">
                            <FaUser className="inline-block mr-1" />Sign Up
                        </Link>
                        <Link to="/login" className="bg-white text-[hsl(var(--primary))] px-4 py-1.5 rounded-full hover:bg-gray-100 transition duration-300 text-sm font-medium border border-[hsl(var(--border))] shadow-sm">
                            <FaSignInAlt className="inline-block mr-1" />Log In
                        </Link>
                    </div>

                    <button 
                        className="md:hidden text-[hsl(var(--primary-foreground))] focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden mt-3"
                        >
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`block py-2 px-3 text-base font-medium text-[hsl(var(--primary-foreground))] hover:text-[hsl(var(--accent))] transition duration-300 ${
                                        activeItem === item.path ? 'text-[hsl(var(--accent))]' : ''
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.title}
                                </Link>
                            ))}
                            <Link
                                to="/signup"
                                className="block py-2 px-3 mt-2 text-base font-medium text-white bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))/80] transition duration-300 rounded-lg flex items-center w-fit"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FaUser className="inline-block mr-1" />Sign Up
                            </Link>
                            <Link
                                to="/login"
                                className="block py-2 px-3 mt-2 text-base font-medium text-[hsl(var(--primary))] bg-white hover:bg-gray-100 transition duration-300 border border-[hsl(var(--border))] rounded-lg flex items-center w-fit"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FaSignInAlt className="inline-block mr-1" />Log In
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Header;
