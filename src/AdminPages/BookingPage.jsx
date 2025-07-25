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
  FiChevronUp
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const AdminBlockPage = () => {
  const { blockId } = useParams();
  const navigate = useNavigate();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPlans, setExpandedPlans] = useState({});
  const [filterOccupied, setFilterOccupied] = useState('all');

  const blockRooms = block?.rooms?.filter(b => b.occupied).length || 0;
  const totalRooms = block?.rooms?.length || 0;
  const occupancyRate = totalRooms > 0 ? Math.round((blockRooms / totalRooms) * 100) : 0;

const fetchBlock = async () => {
  try {
    setLoading(true);
    const res = await axios.get(`http://localhost:8087/user/blocks/room-details/${blockId}`);
    
    if (res.data && res.data.blockId === blockId) {
      setBlock(res.data);
      setError('');
    } else {
      setError("Block not found");
      toast.error("Block not found");
    }
  } catch (err) {
    console.error(err);
    setError("Server error while fetching block details.");
    toast.error("Failed to fetch block details");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchBlock();
  }, [blockId]);

  const togglePlanExpansion = (plan) => {
    setExpandedPlans(prev => ({
      ...prev,
      [plan]: !prev[plan]
    }));
  };

  const roomsByPlan = block?.rooms?.reduce((acc, room) => {
    const plan = room.planName || "Standard Plan";
    if (!acc[plan]) acc[plan] = [];
    acc[plan].push(room);
    return acc;
  }, {});

  // Filter and search functionality
  const filteredRoomsByPlan = roomsByPlan ? Object.entries(roomsByPlan).reduce((acc, [plan, rooms]) => {
    const filteredRooms = rooms.filter(room => {
      const matchesSearch = searchTerm === '' || 
        room.roomNumber.toString().includes(searchTerm) ||
        (room.occupantName && room.occupantName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (room.occupantEmail && room.occupantEmail.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterOccupied === 'all' || 
        (filterOccupied === 'occupied' && room.occupied) || 
        (filterOccupied === 'available' && !room.occupied);
      
      return matchesSearch && matchesFilter;
    });

    if (filteredRooms.length > 0) {
      acc[plan] = filteredRooms;
    }
    return acc;
  }, {}) : {};

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
    <div className="w-full min-h-screen  bg-white  p-4 md:p-6">
      {/* Header Section */}
      <div className="  p-6 mb-8 pt-30 w-full">
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
                <h1 className="text-xl font-bold text-gray-800">{block.blockId} Block</h1>
                <p className="text-sm text-gray-500">Hostel Management System</p>
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
                <p className="font-bold">{blockRooms}/{totalRooms} ({occupancyRate}%)</p>
              </div>
            </div>

            <button
              onClick={fetchBlock}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors shadow-sm"
            >
              <FiRefreshCw className="" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats and Filters */}
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Beds</h3>
            <p className="text-3xl font-bold text-gray-800">{totalRooms}</p>
            <p className="text-xs text-gray-500 mt-1">Across all rooms</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Available Beds</h3>
            <p className="text-3xl font-bold text-green-600">{totalRooms - blockRooms}</p>
            <p className="text-xs text-gray-500 mt-1">{100 - occupancyRate}% availability</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Occupied Beds</h3>
            <p className="text-3xl font-bold text-red-600">{blockRooms}</p>
            <p className="text-xs text-gray-500 mt-1">{occupancyRate}% occupancy</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiSearch />
            </div>
            <input
              type="text"
              placeholder="Search by bed number or occupant..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiFilter />
              </div>
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white"
                value={filterOccupied}
                onChange={(e) => setFilterOccupied(e.target.value)}
              >
                <option value="all">All Beds</option>
                <option value="occupied">Occupied Only</option>
                <option value="available">Available Only</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
                <FiChevronDown />
              </div>
            </div>
            
            <button 
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
              onClick={() => {
                // Add new bed functionality
                toast.success("Add new bed functionality would go here");
              }}
            >
              <FiPlus />
              <span>Add Bed</span>
            </button>
          </div>
        </div>

        {/* Room Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiCalendar className="text-indigo-600" />
            Beds Grouped by Plan
          </h2>

          {Object.keys(filteredRoomsByPlan).length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <FiHome size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Matching Beds Found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            Object.entries(filteredRoomsByPlan).map(([plan, rooms]) => {
              // Group beds into rooms of 5
              const groupedRooms = [];
              for (let i = 0; i < rooms.length; i += 5) {
                groupedRooms.push(rooms.slice(i, i + 5));
              }

              const isExpanded = expandedPlans[plan] !== false;

              return (
                <div key={plan} className="mb-6">
                  <div 
                    className="flex justify-between items-center bg-white p-4 rounded-t-lg cursor-pointer hover:bg-gray-50 border-b border-gray-200"
                    onClick={() => togglePlanExpansion(plan)}
                  >
                    <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                      {plan}
                      <span className="text-sm font-normal bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        {rooms.length} beds
                      </span>
                    </h3>
                    <div className="text-gray-500">
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-b-lg">
                      {groupedRooms.map((beds, index) => (
                        <div 
                          key={`${plan}-room-${index}`} 
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg border-t-4 border-indigo-500 transition-all"
                        >
                          <div className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50">
                            <h3 className="text-lg font-bold text-gray-800">Room {index + 1}</h3>
                            <p className="text-sm text-gray-500">{beds.length} beds</p>
                          </div>
                          <div className="p-5 space-y-4 border-t grid grid-cols-1 gap-4 border-gray-100">
                            {beds.map((bed) => (
                              <div
                                key={`${bed.roomNumber}`}
                                className={`flex items-start gap-4 p-3 rounded-lg shadow-sm transition-colors ${
                                  bed.occupied 
                                    ? 'bg-red-50 hover:bg-red-100' 
                                    : 'bg-green-50 hover:bg-green-100'
                                }`}
                              >
                                <div className={`p-2 rounded-full ${
                                  bed.occupied 
                                    ? 'bg-red-100 text-red-600' 
                                    : 'bg-green-100 text-green-600'
                                }`}>
                                  <FiUser />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-700 truncate">
                                    Bed {bed.roomNumber}
                                  </p>
                                  {bed.occupied ? (
                                    <>
                                      <p className="text-sm text-gray-600 truncate">
                                        {bed.occupantName}
                                      </p>
                                      <p className="text-xs text-gray-500 truncate">
                                        {bed.occupantEmail}
                                      </p>
                                    </>
                                  ) : (
                                    <p className="text-sm text-gray-600">Available</p>
                                  )}
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  bed.occupied 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {bed.occupied ? 'Occupied' : 'Available'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlockPage;