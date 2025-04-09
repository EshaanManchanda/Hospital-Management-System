import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaSignInAlt, FaBars, FaTimes, FaUserCircle, FaRegHospital, FaUserMd, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import Logo from '@/assets/logo.svg';
import { authService } from "../../services";
import { LogOut, X, ChevronRight } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('/');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setActiveItem(location.pathname);
        
        // Check authentication status
        const checkAuth = () => {
            setIsAuthenticated(authService.isAuthenticated());
            setUserRole(authService.getUserRole());
        };
        
        checkAuth();
        
        // Also check when storage changes (login/logout events)
        window.addEventListener('storage', checkAuth);
        
        // Track scroll for header appearance change
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location]);

    // Skip rendering the header on patient dashboard routes
    if (location.pathname.startsWith('/patient-dashboard')) {
        return null;
    }

    const handleLogout = () => {
        authService.logout();
    };

    const navItems = [
        { title: 'Home', path: '/', icon: <FaRegHospital className="w-5 h-5" /> },
        { title: 'Doctors', path: '/doctors', icon: <FaUserMd className="w-5 h-5" /> },
        { title: 'About Us', path: '/about-us', icon: <FaInfoCircle className="w-5 h-5" /> },
        { title: 'Contact', path: '/contact-us', icon: <FaEnvelope className="w-5 h-5" /> }
    ];

    return (
        <motion.header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white shadow-md py-2' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-800 py-4'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src={Logo} alt="Health Nest Logo" className="h-10 w-auto" />
                        <span className={`text-2xl font-bold ${isScrolled ? 'text-blue-700' : 'text-white'}`}>
                            Health Nest
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative px-3 py-2 text-base font-medium transition-colors duration-300 flex items-center ${
                                    isScrolled 
                                        ? 'text-gray-700 hover:text-blue-700' 
                                        : 'text-blue-100 hover:text-white'
                                } ${
                                    activeItem === item.path 
                                        ? isScrolled ? 'text-blue-700' : 'text-white' 
                                        : ''
                                }`}
                            >
                                <span className="mr-1.5">{item.icon}</span>
                                {item.title}
                                {activeItem === item.path && (
                                    <motion.div
                                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                                            isScrolled ? 'bg-blue-600' : 'bg-white'
                                        }`}
                                        layoutId="underline"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        {isAuthenticated ? (
                            <>
                                <Link 
                                    to={userRole === 'admin' ? '/admin-dashboard' : 
                                        userRole === 'doctor' ? '/doctor-dashboard' : 
                                        '/patient-dashboard'} 
                                    className={`px-5 py-2 rounded-full transition duration-300 text-sm font-medium shadow-md flex items-center ${
                                        isScrolled 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-white text-blue-700 hover:bg-blue-50'
                                    }`}
                                >
                                    <FaUserCircle className="inline-block mr-1.5" />
                                    Dashboard
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className={`px-5 py-2 rounded-full transition duration-300 text-sm font-medium shadow-md flex items-center ${
                                        isScrolled 
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                            : 'bg-red-500 text-white hover:bg-red-600'
                                    }`}
                                >
                                    <LogOut className="h-4 w-4 mr-1.5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/signup" 
                                    className={`px-5 py-2 rounded-full transition duration-300 text-sm font-medium shadow-md flex items-center ${
                                        isScrolled 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                            : 'bg-white text-blue-700 hover:bg-blue-50'
                                    }`}
                                >
                                    <FaUser className="inline-block mr-1.5" />
                                    Sign Up
                                </Link>
                                <Link 
                                    to="/login" 
                                    className={`px-5 py-2 rounded-full transition duration-300 text-sm font-medium shadow-md flex items-center ${
                                        isScrolled 
                                            ? 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                                            : 'bg-blue-700 text-white hover:bg-blue-800'
                                    }`}
                                >
                                    <FaSignInAlt className="inline-block mr-1.5" />
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className={`md:hidden focus:outline-none ${isScrolled ? 'text-blue-700' : 'text-white'}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden mt-3 bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-5 border-b">
                                <span className="font-bold text-lg text-blue-800">Menu</span>
                                <button 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <nav className="p-3">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                                            activeItem === item.path
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className={`p-2 rounded-full mr-3 ${
                                            activeItem === item.path
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-gray-100'
                                        }`}>
                                            {item.icon}
                                        </div>
                                        <span className="font-medium">{item.title}</span>
                                        <ChevronRight className="w-5 h-5 ml-auto" />
                                    </Link>
                                ))}
                                
                                <div className="border-t my-3"></div>
                                
                                {isAuthenticated && (
                                    <Link 
                                        to={userRole === 'admin' ? '/admin-dashboard' : 
                                            userRole === 'doctor' ? '/doctor-dashboard' : 
                                            '/patient-dashboard'} 
                                        className="flex items-center p-3 my-1 rounded-lg bg-blue-50 text-blue-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full mr-3">
                                            <FaUserCircle className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">Dashboard</span>
                                        <ChevronRight className="w-5 h-5 ml-auto" />
                                    </Link>
                                )}
                                
                                <div className="px-3 pt-3 pb-5 space-y-3">
                                {!isAuthenticated ? (
                                    <>
                                        <Link 
                                            to="/signup" 
                                            className="flex items-center justify-center w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <FaUser className="mr-2" />
                                            Sign Up
                                        </Link>
                                        <Link 
                                            to="/login" 
                                            className="flex items-center justify-center w-full p-3 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <FaSignInAlt className="mr-2" />
                                            Login
                                        </Link>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            authService.logout();
                                            setIsMenuOpen(false);
                                        }} 
                                        className="flex items-center justify-center w-full p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
                                    >
                                        <LogOut className="w-5 h-5 mr-2" />
                                        <span>Logout</span>
                                    </button>
                                )}
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};

export default Header;
