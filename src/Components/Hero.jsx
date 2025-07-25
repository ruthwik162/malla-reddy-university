import React, { useEffect, useState } from 'react';
import { useAppContext } from '../AppContext/AppContext';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';

const Hero = () => {
  const { navigate, setShowUserLogin, user } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const handleNavigation = () => {
    if (!user) {
      setShowUserLogin(true);
    } else {
      navigate("/plan");
    }
  };

  return (
    <div className="relative flex md:px-10  flex-col items-center justify-center w-full min-h-screen pt-30 md:pt-60 text-white bg-white bg-cover bg-center bg-no-repeat">
      {/* Enhanced gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-120 rounded-b-xl bg-gradient-to-br from-indigo-600/90 via-indigo-700/80 to-indigo-800/70"></div>

      <motion.div
        className="relative z-10 w-full max-w-9xl px-3 mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between w-full p-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl backdrop-blur-sm shadow-2xl border border-indigo-500/30"
          variants={itemVariants}
        >
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              src={assets.welcome}
              className='h-auto w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-500'
              alt="Welcome to MRU Hostels"
            />
          </div>

          <div className="md:w-1/2 md:pl-8">
            {/* Enhanced Badge */}
            <motion.div
              className="flex hidden items-center gap-2 w-full px-2  py-2 text-sm font-medium text-white transition-all justify-around duration-300 bg-indigo-800/70 rounded-full hover:bg-indigo-900/80 shadow-md"
              variants={itemVariants}
            >
              <span className="text-indigo-100 md:text-lg text-[3vw]">New platform update available</span>
              <div className="flex items-center gap-1 md:px-5 px-2 py-1 bg-indigo-400 rounded-full">
                <span>Explore</span>
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path
                    d="M1 4.5h10.182m-4-3.5 4 3.5-4 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Enhanced Title */}
            <motion.h1
              className="mb-6 text-2xl w-full scale-130 md:scale-170   font-bold leading-tight text-center sm:text-5xl md:text-5xl lg:text-4xl bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Malla Reddy University <br className="hidden sm:block" /> Hostel
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p
              className="max-w-2xl mx-auto mb-8 text-sm text-center md:text-md text-indigo-100"
              variants={itemVariants}
            >
              Premium accommodation with modern amenities, fostering a supportive environment for academic excellence and personal growth.
            </motion.p>

            {/* Enhanced Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
              variants={itemVariants}
            >
              {/* Primary Button */}
              <button
                onClick={handleNavigation}
                className="relative px-8 py-3 font-medium text-white transition-all duration-300 transform bg-indigo-600 rounded-lg hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-lg overflow-hidden group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="relative z-10 flex justify-center items-center">
                  {user ? 'Book Now' : 'Join Now'}
                  {isHovered && (
                    <motion.span
                      className="inline-block ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  )}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>

              {/* Learn More + Icon */}
              <div className="relative flex justify-center gap-10 items-center">
                <button
                  onClick={() => navigate('/about')}
                  className="flex items-center justify-center gap-2 px-8 py-3 font-medium text-white transition-all duration-300 border-2 border-indigo-300 rounded-lg hover:bg-indigo-500/20 hover:scale-105 active:scale-95 hover:border-indigo-400 shadow-md"
                >
                  Learn more
                  <motion.svg
                    width="12"
                    height="9"
                    viewBox="0 0 12 9"
                    className="mt-1"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <path
                      d="M1 4.5h10.182m-4-3.5 4 3.5-4 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </button>

                {/* Decorative Icon */}
                <div className="absolute -bottom-6 -right-20 sm:-bottom-42 sm:right-0 w-20 h-20 sm:w-38 sm:h-38 opacity-20 pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;