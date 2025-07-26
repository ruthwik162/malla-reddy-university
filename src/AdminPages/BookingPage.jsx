import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiArrowLeft, 
  FiRefreshCw, 
  FiUser, 
  FiHome, 
  FiInfo, 
  FiCalendar,
  FiPlus,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiUsers,
  FiPhone,
  FiMail,
  FiStar,
  FiMapPin
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../AppContext/AppContext';

const BlockDetailsPage = () => {
  const { blockId } = useParams();
  const navigate = useNavigate();
  const [blockData, setBlockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPlans, setExpandedPlans] = useState({});
  const [expandedRooms, setExpandedRooms] = useState({});
  const [filter, setFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [userDetails, setUserDetails] = useState({});
  const {url} = useAppContext();

  const fetchUserDetails = async (userId) => {
    try {
      if (!userDetails[userId]) {
        const response = await axios.get(`${url}/user/register/${userId}`);
        if (response.data?.success && response.data.user) {
          setUserDetails(prev => ({
            ...prev,
            [userId]: response.data.user
          }));
        } else {
          throw new Error('User data not found');
        }
      }
    } catch (err) {
      console.error(`Error fetching user ${userId}:`, err);
      setUserDetails(prev => ({
        ...prev,
        [userId]: { 
          username: 'Unknown User',
          email: 'N/A',
          mobile: 'N/A',
          error: true
        }
      }));
    }
  };

  const fetchBlockData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${url}/user/blocks/${blockId}`);
      
      if (!response.data?.block) {
        throw new Error('Block data not found');
      }

      const block = response.data.block;
      const rooms = Array.isArray(block.rooms) ? block.rooms : [];

      // Group rooms by plan
      const roomsByPlan = rooms.reduce((acc, room) => {
        const planId = room.plan;
        if (!acc[planId]) {
          acc[planId] = {
            planId,
            rooms: [],
            totalBeds: 0,
            occupiedBeds: 0
          };
        }
        
        acc[planId].rooms.push(room);
        acc[planId].totalBeds += room.capacity || 1;
        acc[planId].occupiedBeds += room.users?.length || 0;
        
        return acc;
      }, {});

      // Get plan details
      const planDetails = response.data.plans || {};

      const completeData = {
        ...block,
        roomsByPlan: Object.entries(roomsByPlan).map(([planId, planData]) => ({
          ...planData,
          planDetails: planDetails[planId] || {
            name: `Plan ${planId.slice(-3)}`,
            description: 'Standard plan'
          }
        }))
      };

      setBlockData(completeData);

      // Pre-fetch user details for all users in the block
      const allUserIds = rooms.flatMap(room => room.users || []);
      await Promise.all(allUserIds.map(fetchUserDetails));

    } catch (err) {
      console.error("Error fetching block data:", err);
      setError(err.message || "Failed to fetch block details");
      toast.error(err.message || "Failed to fetch block details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomDetails = async (roomNumber) => {
    try {
      const response = await axios.get(
        `${url}/user/blocks/${blockId}/${roomNumber}`
      );
      
      await Promise.all(response.data.users?.map(fetchUserDetails) || []);
      
      return response.data;
    } catch (err) {
      console.error(`Error fetching room ${roomNumber}:`, err);
      toast.error(`Failed to fetch room ${roomNumber}`);
      return null;
    }
  };

  useEffect(() => {
    fetchBlockData();
  }, [blockId]);

  const togglePlanExpansion = (planId) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const toggleRoomExpansion = async (roomNumber) => {
    if (!expandedRooms[roomNumber]) {
      const roomDetails = await fetchRoomDetails(roomNumber);
      if (roomDetails) {
        setBlockData(prev => ({
          ...prev,
          rooms: prev.rooms.map(room => 
            room.roomNumber === roomNumber ? roomDetails : room
          ),
          roomsByPlan: prev.roomsByPlan.map(plan => ({
            ...plan,
            rooms: plan.rooms.map(room =>
              room.roomNumber === roomNumber ? roomDetails : room
            )
          }))
        }));
      }
    }

    setExpandedRooms(prev => ({
      ...prev,
      [roomNumber]: !prev[roomNumber]
    }));
  };

  const filterRooms = (rooms) => {
    return rooms.filter(room => {
      // Search term matching
      const matchesSearch = searchTerm === '' || 
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.users?.some(userId => {
          const user = userDetails[userId];
          return user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        });
      
      // Filter matching
      const matchesFilter = filter === 'all' || 
        (filter === 'occupied' && (room.users?.length || 0) > 0) || 
        (filter === 'available' && (room.users?.length || 0) < (room.capacity || 1));
      
      // Plan filter matching
      const matchesPlan = planFilter === 'all' || room.plan === planFilter;
      
      return matchesSearch && matchesFilter && matchesPlan;
    });
  };

  const calculateStats = () => {
    if (!blockData) return {
      totalPlans: 0,
      totalRooms: 0,
      totalBeds: 0,
      occupiedBeds: 0,
      occupancyRate: 0
    };

    return {
      totalPlans: blockData.roomsByPlan.length,
      totalRooms: blockData.rooms.length,
      totalBeds: blockData.rooms.reduce((sum, room) => sum + (room.capacity || 1), 0),
      occupiedBeds: blockData.rooms.reduce((sum, room) => sum + (room.users?.length || 0), 0),
      occupancyRate: blockData.rooms.reduce((sum, room) => sum + (room.users?.length || 0), 0) / 
                   blockData.rooms.reduce((sum, room) => sum + (room.capacity || 1), 0) * 100 || 0
    };
  };

  const stats = calculateStats();

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center p-6 max-w-md bg-white rounded-xl shadow-md">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Block</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4  md:p-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl mt-25 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-colors border border-gray-200 shadow-sm"
            >
              <FiArrowLeft className="text-indigo-600" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                <FiHome size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{blockData?.name || blockId}</h1>
                <p className="text-sm text-gray-500 capitalize">{blockData?.gender} Block</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-indigo-50 p-3 rounded-lg flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <FiInfo className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Occupancy</p>
                <p className="font-bold">
                  {stats.occupiedBeds}/{stats.totalBeds} ({Math.round(stats.occupancyRate)}%)
                </p>
              </div>
            </div>

            <button
              onClick={fetchBlockData}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors shadow-sm"
            >
              <FiRefreshCw />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Plans</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.totalPlans}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Total Rooms</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalRooms}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Available Beds</h3>
          <p className="text-2xl font-bold text-green-600">{stats.totalBeds - stats.occupiedBeds}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Occupied Beds</h3>
          <p className="text-2xl font-bold text-red-600">{stats.occupiedBeds}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiSearch />
          </div>
          <input
            type="text"
            placeholder="Search by room or occupant..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiFilter />
          </div>
          <select
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white w-full"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Beds</option>
            <option value="occupied">Occupied Only</option>
            <option value="available">Available Only</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
            <FiChevronDown />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiCalendar />
          </div>
          <select
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white w-full"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="all">All Plans</option>
            {blockData?.roomsByPlan?.map((plan) => (
              <option key={plan.planId} value={plan.planId}>
                {plan.planDetails.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
            <FiChevronDown />
          </div>
        </div>
      </div>

      {/* Plans and Rooms Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiCalendar className="text-indigo-600" />
          Hostel Plans
        </h2>

        {blockData?.roomsByPlan?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <FiHome size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Rooms Found</h3>
            <p className="text-gray-500 mb-6">This block doesn't have any rooms yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blockData?.roomsByPlan?.filter(plan => planFilter === 'all' || plan.planId === planFilter)
              .map((plan) => {
              const isPlanExpanded = expandedPlans[plan.planId] !== false;
              const filteredRooms = filterRooms(plan.rooms);

              return (
                <div key={plan.planId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Plan Header */}
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => togglePlanExpansion(plan.planId)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                        <FiStar />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-700">{plan.planDetails.name}</h3>
                        <p className="text-sm text-gray-500">{plan.planDetails.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                        {filteredRooms.length} rooms
                      </span>
                      <div className="text-gray-500">
                        {isPlanExpanded ? <FiChevronUp /> : <FiChevronDown />}
                      </div>
                    </div>
                  </div>

                  {/* Rooms List */}
                  {isPlanExpanded && filteredRooms.length > 0 && (
                    <div className="border-t border-gray-200 divide-y divide-gray-200">
                      {filteredRooms.map((room) => {
                        const isRoomExpanded = expandedRooms[room.roomNumber] !== false;
                        const occupiedBeds = room.users?.length || 0;
                        const availableBeds = (room.capacity || 1) - occupiedBeds;

                        return (
                          <div key={room.roomNumber} className="p-3 hover:bg-gray-50">
                            {/* Room Header */}
                            <div 
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() => toggleRoomExpansion(room.roomNumber)}
                            >
                              <div>
                                <h4 className="font-medium text-gray-800">{room.roomNumber}</h4>
                                <p className="text-xs text-gray-500">
                                  {room.capacity || 1} beds • {room.gender || 'Mixed'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  occupiedBeds > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {occupiedBeds}/{room.capacity || 1}
                                </span>
                                <div className="text-gray-400">
                                  {isRoomExpanded ? <FiChevronUp /> : <FiChevronDown />}
                                </div>
                              </div>
                            </div>

                            {/* Room Details */}
                            {isRoomExpanded && (
                              <div className="mt-3 pl-2">
                                <div className="space-y-3">
                                  {/* Occupied Beds */}
                                  {occupiedBeds > 0 && (
                                    <div>
                                      <h5 className="text-xs font-medium text-gray-700 mb-1">Occupants</h5>
                                      <div className="space-y-2">
                                        {room.users?.map((userId, index) => {
                                          const user = userDetails[userId] || {
                                            username: 'Loading...',
                                            email: '',
                                            mobile: '',
                                            error: false
                                          };
                                          
                                          return (
                                            <div key={`${room.roomNumber}-user-${index}`} 
                                              className={`rounded-lg p-2 ${user.error ? 'bg-yellow-50' : 'bg-red-50'}`}>
                                              <div className="flex items-start gap-2">
                                                <div className={`p-1 rounded-full ${user.error ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                                                  <FiUser size={14} />
                                                </div>
                                                <div className="flex-1">
                                                  <p className="text-sm font-medium text-gray-800">
                                                    {user.username}
                                                    {user.error && <span className="text-xs text-yellow-600 ml-1">(Error)</span>}
                                                  </p>
                                                  <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                                                    <FiMail size={12} />
                                                    <span className="truncate">{user.email || 'N/A'}</span>
                                                  </div>
                                                  <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                                                    <FiPhone size={12} />
                                                    <span>{user.mobile || 'N/A'}</span>
                                                  </div>
                                                </div>
                                                <span className="text-xs bg-white px-1.5 py-0.5 rounded-full text-gray-700">
                                                  Bed {index + 1}
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {/* Available Beds */}
                                  {availableBeds > 0 && (
                                    <div>
                                      <h5 className="text-xs font-medium text-gray-700 mb-1">Available</h5>
                                      <div className="grid grid-cols-2 gap-2">
                                        {Array.from({ length: availableBeds }).map((_, index) => (
                                          <div key={`${room.roomNumber}-available-${index}`} 
                                            className="bg-green-50 rounded-lg p-2 text-center">
                                            <div className="flex flex-col items-center">
                                              <div className="p-1 bg-green-100 rounded-full text-green-600 mb-1">
                                                <FiUser size={14} />
                                              </div>
                                              <span className="text-xs font-medium">Bed {occupiedBeds + index + 1}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockDetailsPage;