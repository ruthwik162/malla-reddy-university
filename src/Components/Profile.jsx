import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiEdit, FiSave, FiX, FiCamera, FiUser, FiMail, FiPhone, FiUsers, FiTrash2, FiLoader } from 'react-icons/fi';
import { useAppContext } from '../AppContext/AppContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user: contextUser, setUser: setContextUser, url } = useAppContext();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ ...contextUser });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${url}/user/register/${contextUser.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserData(response.data.user);
        setImagePreview(response.data.user.image || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      }
    };

    if (contextUser?.id) {
      fetchUserData();
    }
  }, [contextUser, url]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('mobile', userData.mobile);
      formData.append('gender', userData.gender);

      if (profileImage) {
        formData.append('image', profileImage);
      }

      const response = await axios.put(
        `${url}/user/register/${contextUser.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedUser = response.data.user;
      setContextUser(updatedUser);
      setUserData(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setIsEditing(false);
      setProfileImage(null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error.response || error);
      toast.error(error.response?.data?.message || 'Failed to update profile');

      if (profileImage) {
        setImagePreview(contextUser.image || '');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account? All your data will be lost.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(
        `${url}/user/register/${contextUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setContextUser(null);

      toast.success('Account deleted successfully');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Delete error:', error.response || error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!contextUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4"
      >
        <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Profile Not Available</h2>
          <p className="text-gray-600 mb-5">
            Please login to view your profile.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="px-5 py-1.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition text-sm"
          >
            Go to Login
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 w-full px-4 sm:px-6 lg:px-8"
    >
      <div className="absolute top-0 left-0 w-full h-120 rounded-b-xl bg-gradient-to-b from-indigo-600 to-indigo-500"></div>

      <div className="max-w-3xl md:max-w-5xl mx-auto z-10 relative">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl mt-25   shadow-sm  border-gray-100 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white">
            <div className="flex flex-col sm:flex-row items-center">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="relative mb-4 sm:mb-0 sm:mr-5"
              >
                <div className="w-24 h-24 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/10">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FiUser className="w-12 h-12 text-white/80" />
                  )}
                </div>
                {isEditing && (
                  <motion.label
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <FiCamera className="h-4 w-4 text-blue-600" />
                  </motion.label>
                )}
              </motion.div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-semibold">{userData.username || 'Not provided'}</h1>
                <p className="text-blue-100 text-sm">{userData.email}</p>
                {userData.role && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                    {userData.role}
                  </span>
                )}
                {!isEditing && (
                  <div className="flex gap-2 mt-3 justify-center sm:justify-start">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-1 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition text-sm flex items-center gap-1.5"
                    >
                      <FiEdit className="w-3.5 h-3.5" /> Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleDelete}
                      className="px-4 py-1 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition text-sm flex items-center gap-1.5"
                    >
                      {isDeleting ? (
                        <>
                          <FiLoader className="w-3.5 h-3.5 animate-spin" /> Deleting...
                        </>
                      ) : (
                        <>
                          <FiTrash2 className="w-3.5 h-3.5" /> Delete
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-5">
            {isEditing ? (
              <motion.form
                onSubmit={handleUpdate}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={userData.username || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email || ''}
                      disabled
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={userData.mobile || ''}
                      onChange={handleInputChange}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={userData.gender || ''}
                      onChange={handleInputChange}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setIsEditing(false);
                      setImagePreview(contextUser.image || '');
                      setProfileImage(null);
                      setUserData({ ...contextUser });
                    }}
                    className="px-4 py-1.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition text-sm flex items-center gap-1.5"
                  >
                    <FiX className="w-3.5 h-3.5" /> Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.03 }}
                    whileTap={{ scale: isLoading ? 1 : 0.97 }}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition text-sm flex items-center gap-1.5 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="w-3.5 h-3.5 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-3.5 h-3.5" /> Save
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiUser className="text-blue-500 text-sm" />
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</h3>
                    </div>
                    <p className="text-gray-800 pl-6 text-sm">{userData.username || 'Not provided'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMail className="text-blue-500 text-sm" />
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</h3>
                    </div>
                    <p className="text-gray-800 pl-6 text-sm">{userData.email}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiPhone className="text-blue-500 text-sm" />
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</h3>
                    </div>
                    <p className="text-gray-800 pl-6 text-sm">{userData.mobile || 'Not provided'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiUsers className="text-blue-500 text-sm" />
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</h3>
                    </div>
                    <p className="text-gray-800 pl-6 text-sm capitalize">{userData.gender || 'Not specified'}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;