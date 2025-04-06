import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Review from './Review';
import { FaHospital, FaUserMd, FaCalendarCheck, FaHeartbeat, FaAmbulance, FaLaptopMedical, FaUsers, FaAward, FaHospitalAlt } from 'react-icons/fa';
import Slider from 'react-slick'; 
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
    const features = [
        { icon: FaHospital, title: 'State-of-the-art Facilities', description: 'Experience healthcare in our modern, well-equipped facilities.' },
        { icon: FaUserMd, title: 'Expert Medical Staff', description: 'Our team of experienced doctors and nurses provide top-notch care.' },
        { icon: FaCalendarCheck, title: 'Easy Appointments', description: 'Book and manage your appointments with just a few clicks.' },
        { icon: FaHeartbeat, title: "Comprehensive Care", description: "From preventive care to complex treatments, we've got you covered." },
        { icon: FaAmbulance, title: '24/7 Emergency Services', description: 'Round-the-clock emergency care for your peace of mind.' },
        { icon: FaLaptopMedical, title: 'Telemedicine', description: 'Get expert medical advice from the comfort of your home.' },
    ];
    
    const testimonials = [
      {
          name: "John Doe",
          text: "Health Nest has revolutionized how I manage my healthcare. It's so easy to use!",
          image: "https://randomuser.me/api/portraits/men/32.jpg",
          role: "Patient since 2020"
      },
      {
          name: "Jane Smith",
          text: "I love how I can access all my medical information in one place. Great job, Health Nest!",
          image: "https://randomuser.me/api/portraits/women/44.jpg",
          role: "Regular visitor"
      },
      {
          name: "Mike Johnson",
          text: "Booking appointments has never been easier. Health Nest is a game-changer!",
          image: "https://randomuser.me/api/portraits/men/22.jpg",
          role: "Heart patient"
      },
      {
          name: "Emily Davis",
          text: "The staff is incredibly helpful and caring. I highly recommend Health Nest!",
          image: "https://randomuser.me/api/portraits/women/25.jpg",
          role: "New mother"
      },
      {
          name: "James Wilson",
          text: "The platform is user-friendly and has made my life so much easier!",
          image: "https://randomuser.me/api/portraits/men/15.jpg",
          role: "Senior patient"
      },
      {
          name: "Mary Brown",
          text: "I appreciate the convenience of managing everything online. Thank you, Health Nest!",
          image: "https://randomuser.me/api/portraits/women/13.jpg",
          role: "Regular checkup"
      },
  ];

  const statistics = [
    { icon: FaUsers, count: "10,000+", label: "Satisfied Patients" },
    { icon: FaUserMd, count: "50+", label: "Specialist Doctors" },
    { icon: FaHospitalAlt, count: "10+", label: "Medical Centers" },
    { icon: FaAward, count: "15+", label: "Years of Excellence" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
};

const images = [
  {
      src: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Modern Hospital",
  },
  {
      src: "https://i.ytimg.com/vi/XCxz9yyEkmg/maxresdefault.jpg",
      alt: "Patient Care",
  },
  {
    src: "https://5.imimg.com/data5/SELLER/Default/2021/10/YI/WX/NZ/30422219/hospitality-interior-design-service-1000x1000.jpg",
    alt: "Hospital Interior",
  },
];

    return (
      <div className="bg-[hsl(var(--background))] min-h-screen">
        {/* Hero Section with Animated Gradient and Shapes */}
        <section className="relative overflow-hidden py-16 sm:py-24 mt-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
          
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="container relative mx-auto px-6 text-center z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100">Health Nest</span>
              </motion.h1>
              
              <motion.p
                className="text-xl mb-10 text-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Your comprehensive healthcare management solution designed with care
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <Link to="/signup">
                  <motion.button
                    className="bg-white text-blue-700 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition duration-300 shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
                <Link to="/about-us">
                  <motion.button
                    className="bg-transparent text-white border-2 border-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6"
                >
                  <div className="flex justify-center mb-3">
                    <stat.icon className="text-4xl text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.count}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section with Animated Cards */}
        <section className="features py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[hsl(var(--primary))]">
                Our Features
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] text-lg">
                Discover how Health Nest makes healthcare management simple, efficient, and accessible for everyone.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Animated border effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                  
                  <div className="relative bg-[hsl(var(--card))] p-8 rounded-3xl shadow-lg text-center h-full flex flex-col justify-between z-10">
                    <div>
                      <div className="inline-flex p-3 rounded-full bg-blue-100 mb-6">
                        <feature.icon className="text-3xl sm:text-4xl text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-[hsl(var(--primary))]">
                        {feature.title}
                      </h3>
                      <p className="text-[hsl(var(--muted-foreground))] text-base">
                        {feature.description}
                      </p>
                    </div>
                    <motion.div 
                      className="mt-6 pt-4 border-t border-gray-100"
                      whileHover={{ y: -5 }}
                    >
                      <a href="#" className="text-blue-600 inline-flex items-center gap-1 font-medium text-sm">
                        Learn more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section with Enhanced Design */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-3xl transform rotate-3"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-xl">
                  <Slider {...{...sliderSettings}}>
                    {images.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-[400px] object-cover"
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[hsl(var(--primary))]">
                    About Health Nest
                  </h2>
                  
                  <div className="space-y-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Health Nest is a cutting-edge healthcare management system
                      designed to streamline medical processes and enhance patient
                      care. Our platform integrates advanced technology with medical
                      expertise to provide a seamless experience for both healthcare
                      providers and patients.
                    </p>
                    
                    <p className="text-gray-700 text-lg leading-relaxed">
                      With Health Nest, you can easily manage appointments, access
                      medical records, and communicate with your healthcare team.
                      We're committed to improving healthcare accessibility and
                      efficiency, ensuring that you receive the best possible care.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">Secure & Private</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">24/7 Support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">Integrated Care</span>
                      </div>
                    </div>
                    
                    <Link to="/about-us">
                      <motion.button
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 shadow-md mt-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Discover More
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Redesigned Testimonials */}
        <section className="testimonials py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[hsl(var(--primary))]">
                What Our Patients Say
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] text-lg">
                Hear from our patients who have experienced the benefits of Health Nest
              </p>
            </motion.div>
            
            <Slider {...settings} className="testimonial-slider">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="px-2">
                  <motion.div
                    className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col relative overflow-hidden"
                    whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
                    <div className="flex items-center mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full border-4 border-blue-50" 
                      />
                      <div className="ml-4">
                        <h4 className="font-semibold text-lg text-gray-800">{testimonial.name}</h4>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6 flex-grow">
                      <svg className="h-8 w-8 text-blue-200 mb-2" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M10,8H6a2,2,0,0,0-2,2v4a2,2,0,0,0,2,2h4v6H6a6,6,0,0,1-6-6V10A6,6,0,0,1,6,4h4Zm14,0H20a2,2,0,0,0-2,2v4a2,2,0,0,0,2,2h4v6H20a6,6,0,0,1-6-6V10A6,6,0,0,1,20,4h4Z" />
                      </svg>
                      <p className="text-gray-700 leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-800"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full transform -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full transform translate-y-1/2 -translate-x-1/3"></div>
          </div>
          
          <div className="relative container mx-auto px-4 z-10">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 max-w-4xl mx-auto">
              <div className="text-center">
                <motion.h2 
                  className="text-3xl sm:text-4xl font-bold mb-6 text-white"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  Ready to Take Control of Your Healthcare?
                </motion.h2>
                
                <motion.p 
                  className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  Join Health Nest today and experience the future of healthcare management. Sign up now for seamless healthcare coordination.
                </motion.p>
                
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <Link to="/signup">
                    <motion.button
                      className="bg-white text-blue-700 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition duration-300 shadow-lg w-full sm:w-auto"
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Up Now
                    </motion.button>
                  </Link>
                  <Link to="/contact">
                    <motion.button
                      className="bg-transparent text-white border-2 border-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition duration-300 w-full sm:w-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Contact Us
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Review section */}
        <Review />
      </div>
    );
};

export default Home;
