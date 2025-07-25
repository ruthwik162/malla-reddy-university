import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Loading Spinner
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

// Error Message
const ErrorMessage = ({ message, onRetry }) => (
    <div className="text-center py-10">
        <div className="text-red-500 text-lg font-medium mb-4">{message}</div>
        <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
            Try Again
        </button>
    </div>
);

// Empty State
const EmptyState = ({ email }) => (
    <div className="text-center py-10">
        <div className="text-gray-600 text-lg mb-4">
            No orders found for <span className="font-semibold text-blue-600">{email}</span>
        </div>
        <button
            onClick={() => window.location.href = '/booking'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
            Book a Room Now
        </button>
    </div>
);

// Order Card
const OrderCard = ({ order }) => {
    const status = order.room?.number && order.block?.name ? 'Confirmed' : 'Processing';

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">
                            Booking #{order.orderId ? order.orderId.slice(-6).toUpperCase() : 'UNKNOWN'}
                        </h3>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${status === 'Confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {status}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{order.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{order.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Mobile</p>
                            <p className="font-medium">{order.mobile}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Amount Paid</p>
                            <p className="font-medium">₹{order.totalAmount}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Room</p>
                            <p className="font-medium">
                                {order.room?.number || 'Not assigned yet'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Block</p>
                            <p className="font-medium">
                                {order.block?.name || 'Not assigned yet'}
                            </p>
                        </div>
                    </div>
                </div>

                {order.planId && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Selected Plan</p>
                        <span className="inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-800 text-sm">
                            {order.planId}
                        </span>
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
            const { data } = await axios.get(`http://localhost:8087/user/save-order/${email}`);
            setOrderData(data.orders || []);
            setError(null);
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to fetch orders';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

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
        <div className="  min-h-screen">
            {/* Decorative banner with gradient */}
            <div className="absolute top-0 left-0 w-full h-120 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-b-2xl z-0"></div>
            
            <div className="relative z-10 pt-10 md:pt-35 pb-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Your Booking History</h1>
                    <p className="text-blue-100">View and manage all your hostel bookings</p>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8">
                    {orderData.map((order, index) => (
                        <OrderCard key={order.orderId || index} order={order} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;