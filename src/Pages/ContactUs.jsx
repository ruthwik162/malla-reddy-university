import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSpinner, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUserTie } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAppContext } from '../AppContext/AppContext';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const {url} = useAppContext();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const contactData = {
      fullname: formData.name,
      email: formData.email,
      message: formData.message,
    };

    setLoading(true);

    try {
      const response = await axios.post(`${url}/user/contactus`, contactData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        toast.success("Submitted Successfully!");
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error("Failed to submit! Please try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="min-h-screen pt-20 bg-gray-50">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-120 rounded-b-xl bg-gradient-to-b from-indigo-600 to-indigo-500"></div>

      <motion.div
        className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in <span className="text-amber-600">Touch</span>
          </h1>
          <div className="w-20 h-1 bg-indigo-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to us through any of the channels below.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {/* Girls Hostel Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <FaUserTie className="text-indigo-600 text-xl" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Girls' Hostel</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaUserTie className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Warden</p>
                    <p className="text-gray-800">Mrs. Priya Sharma</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaPhone className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <p className="text-gray-800">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaEnvelope className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="text-gray-800">girls.hostel@example.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="text-gray-800">Block A, East Campus</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Boys Hostel Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-100 to-indigo-300 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <FaUserTie className="text-indigo-600 text-xl" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Boys' Hostel</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaUserTie className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Warden</p>
                    <p className="text-gray-800">Mr. Rajesh Verma</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaPhone className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <p className="text-gray-800">+91 98765 12345</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaEnvelope className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="text-gray-800">boys.hostel@example.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="text-gray-800">Block B, West Campus</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* General Contact Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-emerald-200 to-green-400 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="p-8 text-white">
              <h3 className="text-2xl font-semibold mb-6">General Contact</h3>
              <div className="space-y-5">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-indigo-100 text-sm">Address</p>
                    <p>XYZ College Hostel Campus, Near Main Gate, City Name, PIN 123456</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaEnvelope className="mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-indigo-100 text-sm">Email</p>
                    <p>info@hostelportal.edu.in</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaPhone className="mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-indigo-100 text-sm">Phone</p>
                    <p>+91 99999 88888</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Form and Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-2xl font-bold  mb-6">Send us a message</h3>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
                >
                  Your message has been sent successfully! We'll get back to you soon.
                </motion.div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium  mb-1">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium  mb-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium  mb-1">Your Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                    placeholder="How can we help you?"
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                <motion.button
                  type="submit"
                  className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white transition-colors`}
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Map Section */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl overflow-hidden shadow-xl h-full"
          >
            <iframe
              title="Hostel Location"
              src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d475.5409425917558!2d78.44399517584682!3d17.563333064725217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3bcb8f9d2f393aa5%3A0x51a517296eabcb71!2sMruh%20girls%20hostel%2C%20MALLA%20REDDY%20COLLEGE%2C%20Maisammaguda%2C%20Bhadurpalle%2C%20Hyderabad%2C%20Telangana%20500043!3m2!1d17.5634881!2d78.44418259999999!5e0!3m2!1sen!2sin!4v1750602181267!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ minHeight: '450px', border: 'none' }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactUs;