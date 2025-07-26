import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FiCheck, FiStar, FiArrowLeft, FiDownload, FiLoader } from 'react-icons/fi';
import { FaWifi, FaUtensils, FaBook, FaShieldAlt, FaTshirt, FaBed, FaStar } from 'react-icons/fa';
import { useAppContext } from '../AppContext/AppContext';
import toast from 'react-hot-toast';

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
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [existingBooking, setExistingBooking] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { url ,setShowUserLogin} = useAppContext();

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
  }, [id, url]);

  useEffect(() => {
    const checkExistingBooking = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.email) {
        try {
          const response = await axios.get(`${url}/user/save-order/${storedUser.email}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.data) {
            setExistingBooking(response.data);
            setAlreadyBooked(true);
          }
        } catch (error) {
          console.log("No existing booking found");
        }
      }
    };

    checkExistingBooking();
  }, [url]);

const handlePayment = async () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser?.email) {
    toast.error("Please login to complete your booking");
    setShowUserLogin(true);
    return;
  }

  try {
    const mockPaymentId = `PAY${Date.now().toString().slice(-8)}MRU`;

    const payload = {
      name: storedUser.username || "MRU Student",
      email: storedUser.email,
      mobile: storedUser.mobile || "Not Provided",
      address: "Malla Reddy University Campus",
      gender: storedUser.gender || "other",
      planId: id,
      paymentId: mockPaymentId,
      totalAmount: room.priceMonthly || room.price_yearly / 12
    };

    console.log("Submitting booking with payload:", payload);

    const response = await axios.post(`${url}/user/save-order`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      timeout: 10000
    });

    if (response.status === 201 && response.data?.orderId) {
      const bookingData = {
        ...response.data,
        user: {
          name: storedUser.username,
          email: storedUser.email,
          mobile: storedUser.mobile,
          gender: storedUser.gender
        },
        amount: payload.totalAmount
      };

      setOrderData(bookingData);
      setBookingSuccess(true);
      setAlreadyBooked(true);

      alert(`🎉 Booking Confirmed!\n\nRoom: ${response.data.roomNumber}\nBlock: ${response.data.blockName}\nAmount: ₹${payload.totalAmount}`);
    } else {
      console.warn("Unexpected response from server:", response.data);
      throw new Error("Unexpected booking response. Please contact support.");
    }
  } catch (error) {
    console.error("Booking error details:", {
      error: error.response?.data || error.message,
      config: error.config
    });

    let errorMessage = "Booking failed. Please try again.";

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage =
          "Validation error: " +
          (error.response.data.errors?.map(e => e.msg).join(", ") ||
            error.response.data.message);
      } else if (error.response.status === 500) {
        errorMessage = "Server error. Please contact support if this persists.";
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = "Request timed out. Check your internet connection.";
    }

    alert(errorMessage);
  }
};


const downloadInvoice = async () => {
  setGeneratingInvoice(true);

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      alert("User not found in local storage.");
      return;
    }

    const email = user.email;
    const response = await axios.get(`${url}/user/save-order/${email}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const orders = response.data.orders;
    if (!orders || orders.length === 0) {
      alert("No booking found for this user.");
      return;
    }

    const bookingData = orders[0];
    if (!bookingData.paymentId || !bookingData.createdAt) {
      alert("Incomplete booking data. Cannot generate invoice.");
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 220, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("Malla Reddy University", 15, 25);

    // Invoice Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("BOOKING INVOICE", 105, 50, { align: 'center' });

    // Invoice Meta Info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: INV-${bookingData.paymentId.slice(0, 8)}`, 15, 60);
    doc.text(`Date: ${new Date(bookingData.createdAt).toLocaleDateString('en-IN')}`, 15, 65);
    if (bookingData.room?.number) {
      doc.text(`Room: ${bookingData.room.number}`, 15, 70);
    }

    // Student Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(33, 33, 33);
    doc.text("STUDENT DETAILS", 20, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Name: ${bookingData.name}`, 20, 92);
    doc.text(`Email: ${bookingData.email}`, 20, 99);
    doc.text(`Mobile: ${bookingData.mobile}`, 20, 106);
    doc.text(`Gender: ${bookingData.gender}`, 20, 113);

    // Booking Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(33, 33, 33);
    doc.text("BOOKING DETAILS", 120, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    if (bookingData.block?.name) doc.text(`Block: ${bookingData.block.name}`, 120, 92);
    if (bookingData.room?.number) doc.text(`Room: ${bookingData.room.number}`, 120, 99);
    doc.text(`Plan ID: ${bookingData.planId}`, 120, 106);

    // Payment Table
    const amount = bookingData.totalAmount?.toFixed(2) || '0.00';

    autoTable(doc, {
      startY: 125,
      head: [["Description", "Amount"]],
      body: [
        [`Hostel Booking (${bookingData.planId})`, `₹${amount}`],
        ["Total Amount", `₹${amount}`]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 'auto', fontStyle: 'bold' },
        1: { cellWidth: 'auto', halign: 'right' }
      },
      margin: { top: 125 }
    });

    const finalY = doc.lastAutoTable?.finalY || 150;

    // Footer Note
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your booking!", 105, finalY + 20, { align: 'center' });
    doc.text("For queries: hostel@mallareddyuniversity.ac.in", 105, finalY + 26, { align: 'center' });

    // Watermark
    doc.setFont("courier", "bold");
    doc.setFontSize(60);
    doc.setTextColor(230, 230, 230);
    doc.text("PAID", 60, 160, { angle: 45 });

    // Save File
    const fileName = `MRU_Booking_${bookingData.paymentId.slice(0, 8)}.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error("Error generating invoice:", error);
    alert(`Failed to generate invoice: ${error.message}`);
  } finally {
    setGeneratingInvoice(false);
  }
};


  const renderActionButtons = () => {
    if (alreadyBooked) {
      return (
        <>
          <button
            onClick={() => {navigate('/');scrollTo(0, 0)}}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
          >
            View Dashboard
          </button>
          <button
            onClick={downloadInvoice}
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
                <FiDownload /> Download Invoice
              </>
            )}
          </button>
        </>
      );
    }

    if (bookingSuccess) {
      return (
        <>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Go to Dashboard
          </button>
          <button
            onClick={downloadInvoice}
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
                <FiDownload /> Download Invoice
              </>
            )}
          </button>
        </>
      );
    }

    return (
      <button
        onClick={handlePayment}
        className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
      >
        Book Now
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className='w-10 h-10 animate-spin text-indigo-600' />
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

                  <motion.div
                    variants={fadeUp}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    {renderActionButtons()}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

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