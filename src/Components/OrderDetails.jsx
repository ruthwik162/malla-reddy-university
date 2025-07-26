import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../AppContext/AppContext';
import {
    FiAlertTriangle,
    FiLoader,
    FiRefreshCw,
    FiCheckCircle,
    FiClock,
    FiUser,
    FiMail,
    FiPhone,
    FiHome,
    FiDollarSign,
    FiCreditCard,
    FiMapPin,
    FiCalendar,
    FiHash,
    FiShield,
    FiBookmark,
    FiClock as FiExpiry,
    FiLayers,
    
    FiNavigation,
    FiAlertCircle
} from 'react-icons/fi';
import { BsFillBuildingFill } from 'react-icons/bs';

// Loading Spinner
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

// Error Message
const ErrorMessage = ({ message, onRetry }) => (
    <div className='flex items-center py-28 justify-center'>
        <div className="text-center py-10 px-4 max-w-md mx-auto">
            <div className="flex flex-col items-center">
                <FiAlertTriangle
                    className="text-red-500 text-4xl mb-3"
                    aria-hidden="true"
                />
                <h2 className="text-red-500 text-xl font-semibold mb-2">
                    Something went wrong
                </h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <button
                    onClick={onRetry}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label="Retry"
                >
                    <FiRefreshCw className="text-lg" />
                    Try Again
                </button>
            </div>
        </div>
    </div>
);

// Empty State
const EmptyState = ({ email }) => (
    <div className="text-center py-10">
        <div className="text-gray-600 text-lg mb-4">
            No orders found for <span className="font-semibold text-indigo-600">{email}</span>
        </div>
        <button
            onClick={() => window.location.href = '/booking'}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
            Book a Room Now
        </button>
    </div>
);

// Order Card
const OrderCard = ({ order }) => {
    const status = order.room?.number ? 'Confirmed' : 'Processing';
    const createdAt = new Date(order.createdAt);
    const expiresAt = new Date(createdAt);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Add 1 year to createdAt

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const DetailItem = ({ icon: Icon, label, value, className = '', isLink = false }) => (
        <div className={`flex items-start gap-3 ${className}`}>
            <div className="p-2 bg-indigo-50 rounded-full text-indigo-600">
                <Icon size={16} />
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-500">{label}</p>
                {isLink ? (
                    <a 
                        href={`tel:${value}`} 
                        className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                        {value || 'Not provided'}
                    </a>
                ) : (
                    <p className="font-medium text-gray-800">{value || 'Not provided'}</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow border border-gray-100 relative">
            {/* Decorative stripe */}

            <div className="p-6 pl-8">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {status === 'Confirmed' ? <FiCheckCircle size={20} /> : <FiClock size={20} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Booking #{order.orderId?.slice(-6).toUpperCase() || 'N/A'}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Booked on {formatDate(createdAt)}</p>
                        </div>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status === 'Confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {status}
                    </span> 
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                            <FiUser className="text-indigo-600" />
                            Personal Information
                        </h4>
                        <DetailItem icon={FiUser} label="Student Name" value={order.name} />
                        <DetailItem icon={FiMail} label="Email" value={order.email} />
                        <DetailItem icon={FiPhone} label="Mobile" value={order.mobile} isLink />
                        <DetailItem icon={FiShield} label="Gender" value={order.gender ? `${order.gender.charAt(0).toUpperCase() + order.gender.slice(1)}` : 'N/A'} />
                    </div>

                    {/* Accommodation Details */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                            <FiHome className="text-indigo-600" />
                            Accommodation Details
                        </h4>
                        <DetailItem icon={BsFillBuildingFill} label="Block" value={order.block?.name} />
                        <DetailItem icon={FiNavigation} label="Room Number" value={order.room?.number} />
                        <DetailItem icon={FiLayers} label="Bed Number" value={`Bed ${order.bedId}`} />
                        <DetailItem icon={FiMapPin} label="Address" value={order.address} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Payment Information */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                            <FiDollarSign className="text-indigo-600" />
                            Payment Information
                        </h4>
                        <DetailItem
                            icon={FiDollarSign}
                            label="Total Amount"
                            value={`₹${order.totalAmount?.toLocaleString('en-IN')}`}
                        />
                        <DetailItem
                            icon={FiCreditCard}
                            label="Payment ID"
                            value={order.paymentId}
                        />
                        <DetailItem
                            icon={FiBookmark}
                            label="Plan ID"
                            value={order.planId}
                        />
                    </div>

                    {/* Dates */}
                    <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
                            <FiCalendar className="text-indigo-600" />
                            Important Dates
                        </h4>
                        <DetailItem
                            icon={FiCalendar}
                            label="Booking Date"
                            value={formatDate(createdAt)}
                        />
                        <DetailItem
                            icon={FiExpiry}
                            label="Expires On"
                            value={formatDate(expiresAt)}
                            className={new Date() > expiresAt ? 'text-red-600' : ''}
                        />
                    </div>
                </div>

                {status === 'Confirmed' && (
                    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg w-full sm:w-auto">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> Your room is confirmed at {order.block?.name}, {order.room?.number}. 
                                Please check in at the hostel reception with your ID proof.
                            </p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => toast.success('Download functionality will be added soon')}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm flex items-center gap-2 w-full justify-center sm:w-auto"
                            >
                                Download Receipt
                            </button>
                            <button
                                onClick={() => toast.success('Contact support functionality will be added soon')}
                                className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition text-sm flex items-center gap-2 w-full justify-center sm:w-auto"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Component
const OrderDetails = () => {
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const { url } = useAppContext();

    useEffect(() => {
        const fetchUserAndOrders = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    throw new Error('You must be logged in to view your orders');
                }

                const parsedUser = JSON.parse(storedUser);
                if (!parsedUser?.email) {
                    throw new Error('Invalid user data');
                }

                setEmail(parsedUser.email);
                await fetchOrders(parsedUser.email);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserAndOrders();
    }, []);

    const fetchOrders = async (email) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${url}/user/save-order/${email}`);
            if (data.message && data.orders) {
                setOrderData(data.orders);
            } else {
                setOrderData([]);
            }
            setError(null);
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to fetch orders';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
                <div className="flex flex-col items-center space-y-4">
                    <FiLoader className='w-10 h-10 animate-spin text-indigo-600' />
                    <div className="flex flex-col items-center space-y-2">
                        <h3 className="text-xl font-semibold text-gray-700">Loading Your Orders...</h3>
                        <p className="text-gray-500">Please wait while we fetch your booking details</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <ErrorMessage
                message={error}
                onRetry={() => {
                    if (email) fetchOrders(email);
                    else window.location.href = '/login';
                }}
            />
        );
    }

    if (!email) {
        return (
            <ErrorMessage
                message="You must be logged in to view your orders"
                onRetry={() => window.location.href = '/login'}
            />
        );
    }

    if (orderData.length === 0) {
        return <EmptyState email={email} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute top-0 left-0 w-full h-120 rounded-b-xl bg-gradient-to-b from-indigo-600 to-indigo-500"></div>
            <div className="max-w-4xl mt-20 mx-auto relative">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white mb-2 relative">
                        Your Hostel Bookings
                    </h1>
                    <p className="text-indigo-100">Review and manage your accommodation details</p>
                </div>

                <div className="space-y-6">
                    {orderData.map((order, index) => (
                        <OrderCard key={order.orderId || index} order={order} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;