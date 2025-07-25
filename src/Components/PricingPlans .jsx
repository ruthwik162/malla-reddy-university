import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../AppContext/AppContext";
import { motion } from "framer-motion";
import { FaWifi, FaUtensils, FaBook, FaShieldAlt, FaTshirt, FaBed, FaStar, FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useParams } from "react-router-dom";

const PricingPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { navigate, user } = useAppContext();

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`http://localhost:8087/user/plans`);
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter(plan => {
    if (activeFilter !== "all" && plan.category !== activeFilter) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        plan.name.toLowerCase().includes(query) ||
        plan.description.toLowerCase().includes(query) ||
        plan.features.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getPlanIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case "basic":
        return <FaBed className="text-xl text-indigo-500" />;
      case "standard":
        return <FaTshirt className="text-xl text-blue-500" />;
      case "premium":
        return <FaStar className="text-xl text-yellow-500" />;
      default:
        return <FaBed className="text-xl text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
            ></motion.div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700">Loading Hostel Plans...</h3>
          <p className="text-gray-500">Please wait while we fetch the best options for you</p>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen py-30  overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-120 rounded-b-xl bg-gradient-to-b from-indigo-600 to-indigo-500"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Hostel Accommodation Plans</h2>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            Choose the perfect living space for your academic journey with our range of comfortable options
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12"
        >
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search plans by name, description or features..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="inline-flex bg-white rounded-full p-1 shadow-md">
            {["all"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  activeFilter === filter
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {filteredPlans.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {filteredPlans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative"
              >
                {plan.name.toLowerCase() === "standard plan" && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg rounded-br-lg transform translate-x-2 -translate-y-2 z-10">
                    Most Popular
                  </div>
                )}

                <div
                  className={`h-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                    plan.name.toLowerCase() === "standard plan" ? "border-2 border-yellow-400" : "border border-gray-200"
                  }`}
                >
                  <div
                    className={`p-6 ${
                      plan.name.toLowerCase() === "standard plan" ? "bg-gradient-to-r from-indigo-50 to-blue-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      {getPlanIcon(plan.name)}
                      <h3 className="ml-3 text-xl font-bold text-gray-800">{plan.name}</h3>
                    </div>

                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-3xl font-bold text-gray-900">₹{plan.price_monthly}</span>
                      <span className="text-sm text-gray-500"> /month</span>
                      <div className="text-sm text-indigo-600 mt-1">
                        Or ₹{plan.price_yearly} billed annually
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.split(",").map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700">{feature.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="px-6 pb-6">
                    <motion.button
                      onClick={() => {navigate(`/plan/${plan._id}`);scrollTo(0,0)}}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center ${
                        plan.name.toLowerCase() === "standard plan"
                          ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {user ? "Book Now" : "View Details"}
                      <IoIosArrowForward className="ml-2" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-xl shadow-md"
          >
            <FaSearch className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No plans found</h3>
            <p className="text-gray-500">
              We couldn't find any plans matching your search. Try different keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all")
              }}
              className="mt-4 text-indigo-600 font-medium hover:text-indigo-800"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Need help choosing?</h3>
          <p className="text-gray-600 mb-4">
            Our accommodation advisors are available to help you select the perfect hostel plan based on your needs and budget.
          </p>
          <button className="text-indigo-600 font-medium flex items-center hover:text-indigo-800">
            Contact our housing team
            <IoIosArrowForward className="ml-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingPlans;