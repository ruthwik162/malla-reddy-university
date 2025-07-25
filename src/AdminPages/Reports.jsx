import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { FaMale, FaFemale, FaUtensils, FaIceCream } from 'react-icons/fa';
import { FaBowlRice } from 'react-icons/fa6'; // ✅ Updated icon

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('daily');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8087/user/all');
        const filteredStudents = res.data.filter(user => user.role !== 'admin' && user.roomId);
        setStudents(filteredStudents);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const boys = students.filter(student => student.gender?.toLowerCase() === 'male');
  const girls = students.filter(student => student.gender?.toLowerCase() === 'female');

  const getMultiplier = () => {
    switch (timeRange) {
      case 'daily':
        return 1;
      case 'weekly':
        return 7;
      case 'monthly':
        return 30;
      default:
        return 1;
    }
  };

  const multiplier = getMultiplier();
  const riceForBoys = boys.length * 400 * multiplier;
  const curryForBoys = boys.length * 100 * multiplier;
  const riceForGirls = girls.length * 300 * multiplier;
  const curryForGirls = girls.length * 100 * multiplier;

  const totalRice = riceForBoys + riceForGirls;
  const totalCurry = curryForBoys + curryForGirls;
  const totalDesserts = students.length * multiplier;

  const toKg = grams => (grams / 1000).toFixed(2);

  const genderData = [
    { name: 'Boys', value: boys.length, icon: <FaMale />, color: '#3b82f6' },
    { name: 'Girls', value: girls.length, icon: <FaFemale />, color: '#ec4899' }
  ];

  const foodData = [
    { name: 'Rice', boys: toKg(riceForBoys), girls: toKg(riceForGirls), total: toKg(totalRice) },
    { name: 'Curry', boys: toKg(curryForBoys), girls: toKg(curryForGirls), total: toKg(totalCurry) },
    { name: 'Desserts', boys: boys.length * multiplier, girls: girls.length * multiplier, total: totalDesserts }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-30 px-4 max-w-full  min-h-screen bg-gradient-to-r from-pink-600 to-purple-700 ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-indigo-700">Cafeteria Requirement Report</h1>
        <p className="text-center text-gray-600 mb-6">Detailed analysis of food requirements based on student demographics</p>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-sm p-1">
            {['daily', 'weekly', 'monthly'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Gender Distribution</h2>
            <div className="flex space-x-2">
              <span className="flex items-center text-sm text-blue-500">
                <FaMale className="mr-1" /> Boys: {boys.length}
              </span>
              <span className="flex items-center text-sm text-pink-500">
                <FaFemale className="mr-1" /> Girls: {girls.length}
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={value => [`${value} students`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Total Food Requirements ({timeRange})
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="flex justify-center text-blue-500 mb-2">
                <FaBowlRice className="text-2xl" />
              </div>
              <h3 className="font-medium text-gray-700">Rice</h3>
              <p className="text-2xl font-bold">{toKg(totalRice)} kg</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="flex justify-center text-green-500 mb-2">
                <FaUtensils className="text-2xl" />
              </div>
              <h3 className="font-medium text-gray-700">Curry</h3>
              <p className="text-2xl font-bold">{toKg(totalCurry)} kg</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="flex justify-center text-purple-500 mb-2">
                <FaIceCream className="text-2xl" />
              </div>
              <h3 className="font-medium text-gray-700">Desserts</h3>
              <p className="text-2xl font-bold">{totalDesserts}</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={foodData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Total" fill="#8884d8" />
                <Bar dataKey="boys" name="Boys" fill="#3b82f6" />
                <Bar dataKey="girls" name="Girls" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaMale className="text-blue-500 mr-2" /> Boys Requirements ({timeRange})
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-blue-50 rounded-lg p-4">
              <span className="font-medium">Rice</span>
              <span className="font-bold">{toKg(riceForBoys)} kg</span>
            </div>
            <div className="flex justify-between items-center bg-green-50 rounded-lg p-4">
              <span className="font-medium">Curry</span>
              <span className="font-bold">{toKg(curryForBoys)} kg</span>
            </div>
            <div className="flex justify-between items-center bg-purple-50 rounded-lg p-4">
              <span className="font-medium">Desserts</span>
              <span className="font-bold">{boys.length * multiplier}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaFemale className="text-pink-500 mr-2" /> Girls Requirements ({timeRange})
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-pink-50 rounded-lg p-4">
              <span className="font-medium">Rice</span>
              <span className="font-bold">{toKg(riceForGirls)} kg</span>
            </div>
            <div className="flex justify-between items-center bg-green-50 rounded-lg p-4">
              <span className="font-medium">Curry</span>
              <span className="font-bold">{toKg(curryForGirls)} kg</span>
            </div>
            <div className="flex justify-between items-center bg-purple-50 rounded-lg p-4">
              <span className="font-medium">Desserts</span>
              <span className="font-bold">{girls.length * multiplier}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Reports;
