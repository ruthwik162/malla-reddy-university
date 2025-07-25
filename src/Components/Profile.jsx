import React, { useEffect, useState, useCallback } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiEdit, FiSave, FiUpload, FiUser, FiMail, FiPhone,
  FiUsers, FiLock, FiGlobe, FiTwitter, FiLinkedin, FiGithub,
  FiEye, FiEyeOff, FiX, FiCheck, FiCamera
} from 'react-icons/fi';
import { debounce } from 'lodash';
import { useAppContext } from '../AppContext/AppContext';

const Profile = () => {
  const [user, setUser] = useState({
    id: '',
    username: '',
    email: '',
    mobile: '',
    gender: '',
    bio: '',
    socialLinks: { twitter: '', linkedin: '', github: '' },
    profileimage: '',
    isTwoFactorEnabled: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const {url} = useAppContext();


  const [userData, setUserData] = useState({
    username: '',
    email: '',
    mobile: '',
    gender: '',
    bio: '',
    socialLinks: { twitter: '', linkedin: '', github: '' },
  });



  const fetchUserData = useCallback(async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setUserData({
      username: parsedUser.username || '',
      email: parsedUser.email || '',
      mobile: parsedUser.mobile || '',
      gender: parsedUser.gender || '',
      bio: parsedUser.bio || '',
      socialLinks: parsedUser.socialLinks || { twitter: '', linkedin: '', github: '' },
    });

    

    try {
      const { data } = await axios.get(`${url}/user/${parsedUser.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch user data');
    }
  }, []);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  const checkUsernameAvailability = debounce(async (username) => {
    if (!username || username === user.username) return;
    try {
      const { data } = await axios.get(`${url}/user/check-username?username=${username}`);
      if (!data.available) toast.error('Username already taken!');
    } catch (err) {
      console.error("Username check failed:", err);
    }
  }, 500);

  const handleUpdate = async () => {
    if (!user.id) return toast.error('User ID missing!');
    setIsLoading(true);
    try {
      const { data } = await axios.put(
        `${url}/user/register/${user.id}`,
        userData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in userData.socialLinks) {
      setUserData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value }
      }));
    } else {
      setUserData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await axios.post(
        `${url}/user/${user.id}/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUser(prev => ({ ...prev, profileimage: data.imageUrl }));
      localStorage.setItem('user', JSON.stringify({ ...user, profileimage: data.imageUrl }));
      toast.success('Profile image updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setIsImageUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 h-32">
          <div className="absolute -bottom-16 left-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg">
                {user.profileimage ? (
                  <img src={user.profileimage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                    <FiUser size={48} />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  {isImageUploading ? (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiCamera className="text-blue-600" size={20} />
                  )}
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 px-6 pb-6">
          {/* User Info Section */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
              <p className="text-gray-600 flex items-center">
                <FiMail className="mr-2" size={14} />
                {user.email}
              </p>
              {user.mobile && (
                <p className="text-gray-600 flex items-center mt-1">
                  <FiPhone className="mr-2" size={14} />
                  {user.mobile}
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiEdit className="mr-2" size={16} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <FiX className="mr-2" size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <div className="relative">
                  <input
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    onBlur={() => checkUsernameAvailability(userData.username)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
                    placeholder="Username"
                  />
                  {isEditing && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <input
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
                    placeholder="Email"
                  />
                  {isEditing && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <div className="relative">
                  <input
                    name="mobile"
                    value={userData.mobile}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
                    placeholder="Mobile"
                  />
                  {isEditing && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <div className="relative">
                  <select
                    name="gender"
                    value={userData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {isEditing && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiUsers className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={userData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <FiGlobe className="mr-2" />
                Social Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Twitter</label>
                  <div className="relative">
                    <input
                      name="twitter"
                      value={userData.socialLinks.twitter}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
                      placeholder="https://twitter.com/username"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiTwitter className="text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                  <div className="relative">
                    <input
                      name="linkedin"
                      value={userData.socialLinks.linkedin}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
                      placeholder="https://linkedin.com/in/username"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiLinkedin className="text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">GitHub</label>
                  <div className="relative">
                    <input
                      name="github"
                      value={userData.socialLinks.github}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
                      placeholder="https://github.com/username"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiGithub className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Your Profile QR Code</h3>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <QRCode
                  value={JSON.stringify(user)}
                  size={128}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Scan this code to quickly share your profile
              </p>
              <button className="mt-3 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;