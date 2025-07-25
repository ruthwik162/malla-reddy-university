import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FiCheck, FiStar, FiArrowLeft, FiDownload, FiClock, FiUsers, FiWifi, FiCoffee, FiLoader } from 'react-icons/fi';
import { FaWifi, FaUtensils, FaBook, FaShieldAlt, FaTshirt, FaBed, FaStar } from 'react-icons/fa';
import { useAppContext } from '../AppContext/AppContext';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const PlanDetails = () => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const {url} = useAppContext();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}/user/plans`);
        const foundRoom = response.data.find(plan => String(plan._id) === String(id));
        if (foundRoom) {
          setRoom({
            ...foundRoom,
            rating: foundRoom.rating || 4.5,
            offerPrice: foundRoom.offerPrice || foundRoom.priceMonthly,
            price: foundRoom.priceMonthly,
            description: foundRoom.description || "Premium workspace with all amenities included for maximum productivity.",
            features: foundRoom.features || "High-speed WiFi, 24/7 Support, Daily Meals, Access to Gym"
          });
        } else {
          setError("Plan not found");
        }
      } catch (error) {
        console.error("Error fetching plan:", error);
        setError("Failed to load plan details");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [id]);

  const handlePayment = () => {
    const options = {
      key: "rzp_live_0CAWJFt3q8oaUX",
      amount: room.priceMonthly * 100,
      currency: "INR",
      name: "ExcelR",
      description: "Plan Payment",
      handler: async function (response) {
        const payload = {
          name: room.name,
          planId: id,
          paymentId: response.razorpay_payment_id,
          amount: room.priceMonthly,
          user: {
            name: "John Doe",
            email: "john@example.com",
            mobile: "9876543210"
          }
        };

        try {
          await axios.post(`${url}/user/save-order`, payload);
          generateInvoice(response.razorpay_payment_id, payload);
          navigate("/dashboard");
        } catch (error) {
          console.error("Order saving failed:", error);
        }
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9876543210",
      },
      theme: { color: "#4f46e5" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const generateInvoice = (paymentId, data) => {
    setGeneratingInvoice(true);

    try {
      const doc = new jsPDF();

      // Set default font
      doc.setFont('helvetica', 'normal');

      // Add header with logo and decorative elements
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, 220, 40, 'F');

      // Add logo text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text("ExcelR", 15, 25);

      // Add decorative line under header
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.5);
      doc.line(15, 35, 195, 35);

      // Invoice title section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text("INVOICE", 105, 55, { align: 'center' });

      // Invoice details
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Invoice #: INV-${paymentId.slice(0, 8).toUpperCase()}`, 15, 50);
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 15, 55);

      // Add decorative border
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.roundedRect(10, 60, 190, 140, 3, 3);

      // Customer details section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("BILLED TO:", 20, 70);
      doc.setFont('helvetica', 'normal');
      doc.text(data.user.name, 20, 77);
      doc.text(data.user.email, 20, 84);
      doc.text(data.user.mobile, 20, 91);

      // Plan details section
      doc.setFont('helvetica', 'bold');
      doc.text("PLAN DETAILS:", 20, 105);
      doc.setFont('helvetica', 'normal');
      doc.text(`Plan: ${data.name}`, 20, 112);
      doc.text(`Subscription: Monthly`, 20, 119);

      // Payment details section
      doc.setFont('helvetica', 'bold');
      doc.text("PAYMENT DETAILS:", 120, 70);
      doc.setFont('helvetica', 'normal');
      doc.text(`Payment ID: ${paymentId}`, 120, 77);
      doc.text(`Payment Method: Razorpay`, 120, 84);
      doc.text(`Status: Paid`, 120, 91);

      // Items table
      const headers = [["Description", "Amount"]];
      const invoiceData = [
        [`${data.name} Plan (Monthly)`, `₹${data.amount}`],
        ["Taxes (included)", "₹0"],
        ["Discount", "-₹0"],
        ["Total", `₹${data.amount}`]
      ];

      doc.autoTable({
        startY: 130,
        head: headers,
        body: invoiceData,
        theme: 'grid',
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          cellPadding: 5,
          fontSize: 10,
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 'auto', fontStyle: 'bold' },
          1: { cellWidth: 'auto', halign: 'right' }
        },
        didDrawPage: function (data) {
          // Footer
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("Thank you for your purchase!", 105, 280, { align: 'center' });
          doc.text("For any queries, contact support@excelr.com", 105, 285, { align: 'center' });

          // Company info footer
          doc.setFontSize(8);
          doc.text("ExcelR Hostels, 123 Education Street, Bangalore, Karnataka 560001", 105, 290, { align: 'center' });
          doc.text("GSTIN: 22AAAAA0000A1Z5 | CIN: U80302KA2022PTC123456", 105, 295, { align: 'center' });
        }
      });

      // Add watermark
      doc.setFontSize(60);
      doc.setTextColor(230, 230, 230);
      doc.setFont('helvetica', 'bold');
      doc.text("PAID", 60, 150, { angle: 45 });

      doc.save(`Invoice_${paymentId.slice(0, 8)}.pdf`);
    } catch (error) {
      console.error("Error generating invoice:", error);
    } finally {
      setGeneratingInvoice(false);
    }
  };

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated spinner with gradient */}
        {/* <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500 animate-spin"></div>
        </div> */}
        <FiLoader className='w-10 h-10 animate-spin text-indigo-600'/>
        
        {/* Loading text with animated dots */}
        <div className="flex flex-col items-center space-y-2">
          <p className="text-lg font-medium text-gray-700">Loading plan details</p>
          <div className="flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Plan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center mx-auto"
          >
            <FiArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <section className="relative min-h-screen py-20 bg-gray-50 overflow-hidden">
        {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-120 rounded-b-xl bg-gradient-to-br from-indigo-600/90 via-indigo-700/80 to-indigo-800/70"></div>

        <div className="relative max-w-7xl max-h-5xl z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{room.name} Plan Details</h2>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              Everything you need to know about our {room.name.toLowerCase()} accommodation
            </p>
          </motion.div>
          <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white cursor-pointer border-2 p-3 rounded-2xl hover:text-indigo-200 mb-8 transition"
            >
              <FiArrowLeft className="mr-2" /> Back to Plans
            </button>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            
            <div className="md:flex">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="md:w-1/2 relative"
              >
                <img
                  src={room.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full shadow-sm flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-medium">{room.rating}</span>
                </div>
              </motion.div>

              <div className="p-8 md:w-1/2">
                <motion.div variants={stagger}>
                  <motion.h1
                    variants={fadeUp}
                    className="text-3xl font-bold text-gray-900 mb-2"
                  >
                    {room.name} Accommodation
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    className="text-gray-600 mb-6"
                  >
                    {room.description}
                  </motion.p>

                  {/* Pricing card with decorative elements */}
                  <motion.div
                    variants={fadeUp}
                    className="bg-indigo-50 p-6 rounded-xl mb-8 relative overflow-hidden"
                  >
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-100 rounded-full opacity-20"></div>
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-200 rounded-full opacity-10"></div>

                    <div className="relative z-10 flex justify-between items-center mb-4">
                      <div>
                        <p className="text-gray-500 text-sm">Monthly Price</p>
                        <p className="text-2xl font-bold text-indigo-700">₹{room.price_monthly}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Yearly (Save 20%)</p>
                        <p className="text-2xl font-bold text-indigo-700">₹{room.price_yearly}</p>
                      </div>
                    </div>
                    <p className="relative z-10 text-xs text-gray-500">* Prices inclusive of all taxes</p>
                  </motion.div>

                  {/* Features with icons */}
                  <motion.div
                    variants={fadeUp}
                    className="mb-8"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Features</h3>
                    <motion.ul
                      variants={stagger}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {room.features.split(',').map((feature, idx) => (
                        <motion.li
                          key={idx}
                          variants={fadeUp}
                          className="flex items-start"
                        >
                          <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature.trim()}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>

                  {/* Amenities section with decorative icons */}
                  <motion.div
                    variants={fadeUp}
                    className="mb-8 bg-gray-50 p-5 rounded-xl"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities Included</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                        <FaWifi className="text-indigo-600 text-2xl mb-2" />
                        <span className="text-sm text-gray-700">High-speed WiFi</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                        <FaUtensils className="text-indigo-600 text-2xl mb-2" />
                        <span className="text-sm text-gray-700">Daily Meals</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                        <FaShieldAlt className="text-indigo-600 text-2xl mb-2" />
                        <span className="text-sm text-gray-700">24/7 Security</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                        <FaBook className="text-indigo-600 text-2xl mb-2" />
                        <span className="text-sm text-gray-700">Study Room</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action buttons */}
                  <motion.div
                    variants={fadeUp}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <button
                      onClick={handlePayment}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => generateInvoice("preview", {
                        name: room.name,
                        amount: room.priceMonthly,
                        user: {
                          name: "Sample User",
                          email: "sample@example.com",
                          mobile: "9876543210"
                        }
                      })}
                      disabled={generatingInvoice}
                      className="flex items-center justify-center gap-2 flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-6 rounded-lg transition"
                    >
                      {generatingInvoice ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <FiDownload /> Download Brochure
                        </>
                      )}
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Testimonials section with decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto relative overflow-hidden"
          >
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-100 rounded-full opacity-10"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-200 rounded-full opacity-5"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-gray-800 mb-6">What Our Residents Say</h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3">JS</div>
                    <div>
                      <h4 className="font-medium">John Smith</h4>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} className={`text-sm ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"The {room.name} plan offers great value for money. The facilities are well-maintained and the staff is very helpful."</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3">MP</div>
                    <div>
                      <h4 className="font-medium">Maria Perez</h4>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} className={`text-sm ${star <= 5 ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"I've been staying here for 6 months and it feels like home. The community events are a great bonus!"</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </AnimatePresence>
  );
};

export default PlanDetails;