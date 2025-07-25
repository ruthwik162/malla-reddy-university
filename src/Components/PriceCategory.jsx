import React from 'react';
import { motion } from 'framer-motion';
import {
  FaShieldAlt,
  FaWifi,
  FaUtensils,
  FaBook,
  FaUsers,
  FaLeaf,
  FaMapMarkerAlt,
  FaStar
} from 'react-icons/fa';

const WhyOurHostels = () => {
  const features = [
    {
      icon: <FaShieldAlt className="text-xl text-indigo-600" />,
      title: "24/7 Security",
      description: "Round-the-clock security with CCTV surveillance and trained personnel to ensure student safety"
    },
    {
      icon: <FaWifi className="text-xl text-blue-500" />,
      title: "High-Speed Connectivity",
      description: "Campus-wide high-speed WiFi and dedicated study spaces with internet access"
    },
    {
      icon: <FaUtensils className="text-xl text-green-500" />,
      title: "Nutritious Dining",
      description: "Hygienic mess facilities serving balanced meals with vegetarian and non-vegetarian options"
    },
    {
      icon: <FaBook className="text-xl text-purple-500" />,
      title: "Academic Support",
      description: "Quiet study rooms, library access, and peer learning spaces for academic excellence"
    },
    {
      icon: <FaUsers className="text-xl text-amber-500" />,
      title: "Vibrant Community",
      description: "Diverse student community with cultural events, workshops, and leadership opportunities"
    },
    {
      icon: <FaLeaf className="text-xl text-emerald-500" />,
      title: "Eco-Friendly Spaces",
      description: "Sustainable hostel design with green spaces, solar power, and waste management systems"
    }
  ];

  return (
    <section className="bg-white px-3 md:px-10 pt-5">
      <div className="container mx-auto  p-5 bg-gradient-to-r flex flex-col items-center justify-center  from-indigo-100 to-indigo-300 rounded-2xl  max-w-9xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 mb-4">
            <FaStar className="mr-2 text-amber-500" />
            <span className="font-medium">Campus Living</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-indigo-600">Our Hostels</span>
          </h2>
          <p className="md:text-lg text-gray-600">
            Experience the perfect blend of comfort, security, and community in our university-managed hostels
          </p>
        </motion.div>

          <div className="flex flex-col md:flex-col justify-center bg-indigo-300 rounded-2xl py-1 px-2 w-full items-start ">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-6 p-4 md:px-55 justify-center rounded-lg transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {feature.icon}
              </div>
              <div>
                <h3 className="md:text-lg text-md font-semibold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm md:text-md">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="x border-gray-200 pt-12"
        >
          <div className="flex flex-col md:flex-col justify-center px-10 md:px-55 items-start gap-6 bg-gradient-to-r from-emerald-200 to-green-400 p-10 rounded-2xl">
            <div className='flex  items-center gap-4 mb-6 md:mb-0'>
              <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                <FaMapMarkerAlt className="text-2xl text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Prime Campus Location</h3>
            </div>

            <div className=''>
              <p className="text-gray-600 mb-4">
                Our hostels are strategically located within walking distance to academic buildings,
                libraries, and sports facilities. Enjoy the convenience of campus life with 24/7 access
                to university resources.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FaStar className="text-amber-400 mr-2 text-sm" />
                  <span className="text-gray-700">5-minute walk to lecture halls</span>
                </li>
                <li className="flex items-center">
                  <FaStar className="text-amber-400 mr-2 text-sm" />
                  <span className="text-gray-700">On-campus medical center</span>
                </li>
                <li className="flex items-center">
                  <FaStar className="text-amber-400 mr-2 text-sm" />
                  <span className="text-gray-700">24/7 transportation access</span>
                </li>
                <li className="flex items-center">
                  <FaStar className="text-amber-400 mr-2 text-sm" />
                  <span className="text-gray-700">Proximity to student centers</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyOurHostels;