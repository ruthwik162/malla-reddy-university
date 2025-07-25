import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaWifi, 
  FaUtensils, 
  FaBook, 
  FaShieldAlt, 
  FaTshirt, 
  FaBed, 
  FaBus, 
  FaFirstAid,
  FaGamepad,
  FaSnowflake,
  FaStar,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const AboutCard = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const featuresPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8087/user/about");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setFeatures(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const localFeatures = [
    { icon: <FaBed className="text-3xl text-indigo-600" />, title: "Spacious Rooms", color: "bg-indigo-100" },
    { icon: <FaWifi className="text-3xl text-blue-500" />, title: "High-Speed WiFi", color: "bg-blue-100" },
    { icon: <FaUtensils className="text-3xl text-green-500" />, title: "Nutritious Meals", color: "bg-green-100" },
    { icon: <FaShieldAlt className="text-3xl text-red-500" />, title: "24/7 Security", color: "bg-red-100" },
    { icon: <FaBook className="text-3xl text-purple-500" />, title: "Study Rooms", color: "bg-purple-100" },
    { icon: <FaGamepad className="text-3xl text-yellow-500" />, title: "Recreation", color: "bg-yellow-100" },
    { icon: <FaTshirt className="text-3xl text-pink-500" />, title: "Laundry", color: "bg-pink-100" },
    { icon: <FaFirstAid className="text-3xl text-red-400" />, title: "Medical Support", color: "bg-red-50" },
    { icon: <FaBus className="text-3xl text-teal-500" />, title: "Transportation", color: "bg-teal-100" },
    { icon: <FaSnowflake className="text-3xl text-cyan-400" />, title: "AC Facilities", color: "bg-cyan-100" }
  ];

  const combinedFeatures = features.map((feature, index) => ({
    ...(localFeatures[index] || { icon: "❓", title: "Feature", color: "bg-gray-100" }),
    description: feature.description || "Premium amenity designed for student comfort and convenience",
    information: feature.information || "Available to all residents",
    details: feature.details || [
      "24/7 availability",
      "Professional maintenance",
      "Included in hostel fees"
    ]
  }));

  const paginatedFeatures = combinedFeatures.slice(
    currentPage * featuresPerPage,
    (currentPage + 1) * featuresPerPage
  );

  const totalPages = Math.ceil(combinedFeatures.length / featuresPerPage);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <section className="pt-10 md:px-10 px-2 bg-white">
      <div className="container mx-auto px-4 max-w-9xl bg-gradient-to-r from-emerald-200 to-green-400 p-2 rounded-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 mb-4">
            <FaStar className="mr-2 text-amber-500" />
            <span className="font-medium">Premium Facilities</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
            Exceptional <span className="text-indigo-600">Hostel Amenities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need for comfortable living, academic success, and memorable experiences
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="relative">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {paginatedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:border-indigo-300 border-2 border-transparent transition-all cursor-pointer ${activeFeature === index ? 'ring-2 ring-indigo-500' : ''}`}
                onClick={() => setActiveFeature(activeFeature === index ? null : index)}
              >
                <div className={`mb-4 p-4 ${feature.color} rounded-full`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-3 flex-grow">{feature.description}</p>
                <div className="flex items-center text-xs text-indigo-500 font-medium">
                  <span>{feature.information}</span>
                  <FaStar className="ml-1 text-amber-400 text-xs" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="p-2 rounded-full bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 transition-colors"
              >
                <FaChevronLeft className="text-indigo-600" />
              </button>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage === i ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'} shadow-sm`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-full bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 transition-colors"
              >
                <FaChevronRight className="text-indigo-600" />
              </button>
            </div>
          )}
        </div>

        {/* Feature Detail Modal */}
        <AnimatePresence>
          {activeFeature !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setActiveFeature(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setActiveFeature(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <div className={`p-4 ${combinedFeatures[activeFeature]?.color} rounded-full inline-flex mb-6`}>
                  {combinedFeatures[activeFeature]?.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {combinedFeatures[activeFeature]?.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {combinedFeatures[activeFeature]?.description}
                </p>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Key Features:</h4>
                  <ul className="space-y-2">
                    {combinedFeatures[activeFeature]?.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <p className="text-indigo-700 font-medium text-sm">
                    {combinedFeatures[activeFeature]?.information}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-xl mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience Premium Hostel Living?</h3>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of students enjoying our world-class facilities and supportive community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/plan">
                <motion.button
                  className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Plans
                </motion.button>
              </Link>
              <Link to="/contactus">
                <motion.button
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-green-200/30 hover:bg-opacity-10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutCard;