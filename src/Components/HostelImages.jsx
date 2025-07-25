import React from 'react';
import { assets } from '../assets/assets';
import Hostel from './Hostel';
import { motion } from 'framer-motion';
import { FaUtensils, FaFemale, FaMale, FaHeart, FaShieldAlt, FaLeaf, FaStar } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { GiMeal } from 'react-icons/gi';

const HostelImages = () => {
  const messFeatures = [
    { icon: <FaLeaf className="text-2xl text-emerald-400" />, title: "Organic Ingredients", description: "Locally sourced, fresh produce used in all meals" },
    { icon: <FaHeart className="text-2xl text-rose-500" />, title: "Nutritionist Approved", description: "Menus designed for balanced student nutrition" },
    { icon: <FaShieldAlt className="text-2xl text-blue-500" />, title: "Hygiene Certified", description: "Regular health inspections and staff training" },
    { icon: <GiMeal className="text-2xl text-amber-500" />, title: "Diverse Menu", description: "Vegetarian & non-vegetarian options available daily" }
  ];



  return (

    <section className=" min-h-full px-2 md:px-10 pt-20  bg-white overflow-hidden">
      <div className="absolute top-0 pb-50 left-0 w-full rounded-b-xl h-120 bg-gradient-to-b from-indigo-600 to-indigo-500"></div>

      <div className="relative overflow-hidden ">
        {/* Hero Section with Parallax Effect */}


        {/* Hostel Facilities Section */}
        <section className="py-10  max-w-7xl mx-auto relative">
          <div className="absolute -top-20 left-0 right-0 h-0 bg-white z-0"></div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="text-center flex flex-col items-center justify-center">
              <div className="inline-flex items-center justify-center px-6 py-2 bg-indigo-100 text-indigo-700 rounded-full mb-4">
                <FaStar className="mr-2 text-amber-500" />
                <span className="font-semibold">Premium Facilities</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Modern Hostel <span className="text-amber-600">Living Spaces</span></h2>
              <p className="text-sm text-gray-600 max-w-3xl my-2">
                Designed for comfort, productivity, and community building with premium amenities
              </p>
            </div>

          </motion.div>
        </section>

        {/* Dining Experience Section */}
        <section className=" ">
          <Hostel />

          <div className="max-w-8xl mx-auto px-4 bg-gradient-to-r from-purple-400 to-pink-500 p-10 rounded-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 "
            >
              <div className="inline-flex items-center justify-center px-6 py-2 bg-amber-100 text-amber-700 rounded-full mb-4">
                <FaUtensils className="mr-2" />
                <span className="font-semibold">Gourmet Dining</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Exceptional <span className="text-indigo-600">Dining Experience</span></h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Separately managed dining halls with nutritionally balanced, chef-prepared meals
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-20">
              {messFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className="text-4xl mb-6 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-[4vw] md:text-lg font-bold text-center text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm md:text-lg text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>



            {/* Dining Halls Section */}
            <div className="space-y-16 pb-5 text-[3vw] md:text-[1vw]">
              {/* Girls' Dining Hall */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col text-[3vw] md:text-lg lg:flex-row items-center px-5 py-5 gap-5 bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="w-full lg:w-1/2 h-60 md:h-100 rounded-3xl lg:h-auto overflow-hidden">
                  <motion.img
                    src={assets.hoste_girls}
                    alt="Girls Dining Hall"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    whileHover={{ scale: 1.03 }}
                  />
                </div>
                <div className="w-full lg:w-1/2 p-2 lg:p-12">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-pink-100 rounded-full mr-4">
                      <FaFemale className="text-2xl text-pink-600" />
                    </div>
                    <h3 className="text-[5vw] md:text-xl font-bold  text-gray-800">Girls' Dining Hall</h3>
                  </div>
                  <p className="text-gray-600 mb-8 text-[3vw] md:text-lg">
                    Our exclusive girls' dining area provides a comfortable, safe environment with nutritionally balanced meals prepared by our professional chefs. The menu is carefully curated with input from nutritionists and student feedback.
                  </p>

                  <div className="mb-8 ">
                    <h4 className="font-bold text-gray-800 mb-4 text-xl">Featured Menu Items:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-pink-50 rounded-xl p-4">
                        <h5 className="font-semibold text-pink-600 mb-2">Breakfast Specials</h5>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            <span>Avocado toast with poached eggs</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            <span>Protein smoothie bowls</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            <span>Whole grain pancakes</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-pink-50 rounded-xl p-4">
                        <h5 className="font-semibold text-pink-600 mb-2">Lunch Favorites</h5>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            <span>Quinoa salad with grilled chicken</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            <span>Vegetable biryani with raita</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            <span>Paneer tikka wrap</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-full flex items-center"
                  >
                    View Full Menu <IoIosArrowForward className="ml-2" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Boys' Dining Hall */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col lg:flex-row-reverse py-5 items-center gap-5 bg-white px-5 rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="w-full lg:w-1/2  h-60 md:h-100 rounded-3xl lg:h-auto overflow-hidden">
                  <motion.img
                    src={assets.hostel_boys}
                    alt="Girls Dining Hall"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    whileHover={{ scale: 1.03 }}
                  />
                </div>
                <div className="w-full lg:w-1/2 p-2 lg:p-12">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-blue-100 rounded-full mr-4">
                      <FaMale className="text-2xl text-blue-600" />
                    </div>
                    <h3 className="text-[5vw] md:text-lg font-bold  text-gray-800">Boys' Dining Hall</h3>
                  </div>
                  <p className="text-gray-600 mb-8 text-[3.1vw] md:text-lg">
                    Designed to fuel active lifestyles, our boys' dining facility offers hearty portions with flexible serving times. The menu emphasizes protein-rich options and energy-boosting meals, with special late-night options during exams.
                  </p>

                  <div className="mb-8">
                    <h4 className="font-bold text-gray-800 mb-4 text-[3vw] md:text-lg">Featured Menu Items:</h4>
                    <div className="grid grid-cols-1 text-[3vw] md:text-lg md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h5 className="font-semibold text-blue-600 mb-2">Protein Picks</h5>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Grilled chicken with sweet potatoes</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Egg white omelet station</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Lean beef burgers</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h5 className="font-semibold text-blue-600 mb-2">Energy Boosters</h5>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Pasta bar with whole grain options</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Build-your-own burrito bowls</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Peanut butter protein shakes</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full flex items-center"
                  >
                    View Full Menu <IoIosArrowForward className="ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default HostelImages;