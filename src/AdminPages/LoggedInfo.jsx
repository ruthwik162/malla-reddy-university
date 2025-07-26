import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { useAppContext } from '../AppContext/AppContext';
import { FiLoader } from 'react-icons/fi';

const COLORS = ['#6366f1', '#c7d2fe'];
const COLORS_SECONDARY = ['#10b981', '#a7f3d0'];
const TOTAL_ROOM_CAPACITY = 400;
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const EditUserForm = ({ userData, setUserData, updateUser, setEditingUser }) => (
  <motion.div
    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    variants={fadeIn}
    initial="hidden"
    animate="visible"
  >
    <motion.div
      className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
      variants={fadeInUp}
    >
      <div className="bg-indigo-600 p-4 text-white">
        <h2 className="text-xl font-semibold">Edit User</h2>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateUser();
        }}
        className="p-6"
      >
        {['username', 'email', 'mobile'].map((field) => (
          <div className="mb-4" key={field}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize mb-1">
              {field}
            </label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              id={field}
              required
              value={userData[field]}
              onChange={(e) => setUserData({ ...userData, [field]: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <div className="flex space-x-4">
            {['male', 'female', 'other'].map((genderOption) => (
              <label key={genderOption} className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={genderOption}
                  checked={userData.gender === genderOption}
                  onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{genderOption}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setEditingUser(null)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update User
          </button>
        </div>
      </form>
    </motion.div>
  </motion.div>
);

const LoggedInfo = () => {
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userData, setUserData] = useState({ username: '', email: '', mobile: '', gender: '' });
  const [isLoading, setIsLoading] = useState({
    students: true,
    messages: true
  });
  const { url } = useAppContext();


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${url}/user/all`);
        const filteredStudents = res.data.filter((user) => user.role !== 'admin' && user.roomId);
        setStudents(filteredStudents);
      } catch (error) {
        toast.error('Failed to fetch users');
      } finally {
        setIsLoading(prev => ({ ...prev, students: false }));
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${url}/user/contactus`);
        setMessages(res.data);
      } catch (error) {
        toast.error('Failed to fetch messages');
      } finally {
        setIsLoading(prev => ({ ...prev, messages: false }));
      }
    };
    fetchMessages();
  }, []);

  const remainingSlots = TOTAL_ROOM_CAPACITY - students.length;
  const occupancyData = [
    { name: 'Occupied', value: students.length },
    { name: 'Available', value: remainingSlots },
  ];

  const genderData = students.reduce((acc, student) => {
    const gender = student.gender || 'other';
    const existing = acc.find(item => item.name === gender);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: gender, value: 1 });
    }
    return acc;
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${url}/user/register/${id}`);
      setStudents((prev) => prev.filter((student) => student.id !== id));
      toast.success('User deleted successfully');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const updateUser = async () => {
    try {
      await axios.put(`${url}/user/register/${editingUser.id}`, userData);
      setStudents((prev) =>
        prev.map((user) => (user.id === editingUser.id ? { ...user, ...userData } : user))
      );
      setEditingUser(null);
      setUserData({ username: '', email: '', mobile: '', gender: '' });
      toast.success('User updated successfully');
    } catch {
      toast.error('Failed to update user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUserData({
      username: user.username || '',
      email: user.email || '',
      mobile: user.mobile || '',
      gender: user.gender || '',
    });
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`${url}/user/contactus/${id}`,);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      toast.success('Message deleted successfully');
    } catch {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="min-h-screen py-8  sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Admin Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Occupancy Card */}
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Rooms Occupancy</h2>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={occupancyData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {occupancyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} beds`, value === 1 ? 'Bed' : 'Beds']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Capacity:</span>
                      <span className="font-medium">{TOTAL_ROOM_CAPACITY}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Occupied:</span>
                      <span className="font-medium text-indigo-600">{students.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Available:</span>
                      <span className="font-medium text-indigo-300">{remainingSlots}</span>
                    </div>
                    <div className="pt-2">
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600"
                          style={{ width: `${(students.length / TOTAL_ROOM_CAPACITY) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gender Distribution Card */}
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Gender Distribution</h2>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_SECONDARY[index % COLORS_SECONDARY.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} student${value !== 1 ? 's' : ''}`, 'Count']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0">
                  <div className="space-y-3">
                    {genderData.map((gender) => (
                      <div key={gender.name} className="flex items-center justify-between">
                        <span className="text-gray-600 capitalize">{gender.name}:</span>
                        <span className="font-medium text-emerald-600">{gender.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Blocks Navigation */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Hostel Blocks</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['mruhG1', 'mruhG2', 'mruhB1', 'mruhB2'].map((block) => (
                <Link to={`/adminhome/${block}`} key={block}>
                  <motion.div
                    className="p-4 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-center"
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700">{block}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Students Table */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Student Management</h2>
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{students.length}</span> students
              </div>
            </div>

            {isLoading.students ? (
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center space-y-4">
                  {/* Animated spinner with gradient */}
                  
                  <FiLoader className='w-10 h-10 animate-spin text-indigo-600' />

                  {/* Loading text with animated dots */}
                  <div className="flex flex-col items-center space-y-2">
                    <h3 className="text-xl font-semibold text-gray-700">Loading Hostel Reports...</h3>
                    <p className="text-gray-500">Please wait while we fetch the best reports for you</p>          <div className="flex space-x-1">
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
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {user.username?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.username || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.mobile || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${user.gender === 'male'
                            ? 'bg-blue-100 text-blue-800'
                            : user.gender === 'female'
                              ? 'bg-pink-100 text-pink-800'
                              : 'bg-purple-100 text-purple-800'
                            }`}>
                            {user.gender || 'other'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        {/* Messages Table */}
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">User Messages</h2>
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{messages.length}</span> messages
              </div>
            </div>

            {isLoading.messages ? (
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center space-y-4">
                  {/* Animated spinner with gradient */}
                  
                  <FiLoader className='w-10 h-10 animate-spin text-indigo-600' />

                  {/* Loading text with animated dots */}
                  <div className="flex flex-col items-center space-y-2">
                    <h3 className="text-xl font-semibold text-gray-700">Loading Hostel Reports...</h3>
                    <p className="text-gray-500">Please wait while we fetch the best reports for you</p>          <div className="flex space-x-1">
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
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
                <p className="mt-1 text-sm text-gray-500">There are currently no messages from users.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {messages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{msg.fullname || 'Anonymous'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {msg.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {msg.message}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {editingUser && (
        <EditUserForm
          userData={userData}
          setUserData={setUserData}
          updateUser={updateUser}
          setEditingUser={setEditingUser}
        />
      )}
    </div>
  );
};

export default LoggedInfo;