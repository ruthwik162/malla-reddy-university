import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../AppContext/AppContext";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contactus' },
        { name: 'Plan', path: '/plan' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const location = useLocation();

    const { user, setUser, navigate, logout, setShowUserLogin } = useAppContext();

    // Memoized fetchUser function
    const fetchUser = useCallback(async () => {
        const username = localStorage.getItem("username");
        if (!user && username) {
            try {
                const res = await fetch("http://localhost:8087/user/all");
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                const currentUser = data.find(u => u.username === username);
                if (currentUser) {
                    setUser(currentUser);
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        }
    }, [user, setUser]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileDropdownOpen]);

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full flex items-center bg-cover justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled
                ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
                : "py-4 md:py-6"
                }`}
            aria-label="Main navigation"
        >
            {/* Logo */}
            <NavLink
                to="/"
                className="hover:scale-110 transition-transform duration-200 p-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Home"
            >
                <img
                    className="h-15 rounded w-22"
                    src={assets.mrulogo}
                    alt="MallaReddy University Logo"
                    width="88"
                    height="60"
                />
            </NavLink>

            <h1
                onClick={() => navigate("/")}
                className="hidden md:block cursor-pointer sm:text-2xl md:text-2xl md:gap-6 font-bold max-w-2xl text-white hover:text-indigo-100 transition-colors"
                aria-label="MallaReddy University"
            >
                MallaReddy University
            </h1>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <NavLink
                        key={i}
                        to={link.path}
                        className={({ isActive }) => `group flex flex-col gap-0.5 ${isScrolled
                            ? isActive
                                ? "text-indigo-600 font-semibold"
                                : "text-gray-700 hover:text-indigo-600"
                            : isActive
                                ? "text-white font-semibold"
                                : "text-black hover:text-indigo-200"
                            } transition-colors duration-200`}
                    >
                        {link.name}
                        <div
                            className={`${isScrolled
                                ? "bg-indigo-600"
                                : "bg-white"
                                } h-0.5 w-0 group-hover:w-full transition-all duration-300 ${location.pathname === link.path ? "w-full" : ""
                                }`}
                        />
                    </NavLink>
                ))}

                {user ? (<Link to='/orderdetails'>Order Details</Link>) : (null)}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                {user?.role === "admin" && (
                    <button
                        onClick={() => navigate("/adminhome")}
                        className="cursor-pointer px-6 py-1.5 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-full text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        aria-label="Admin dashboard"
                    >
                        Admin
                    </button>
                )}

                {!user ? (
                    <button
                        onClick={() => setShowUserLogin(true)}
                        className="cursor-pointer px-6 py-1.5 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-full text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        aria-label="Login"
                    >
                        Login
                    </button>
                ) : (
                    <div className="relative profile-dropdown">
                        <button
                            onClick={handleProfileClick}
                            className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full"
                            aria-label="User profile"
                            aria-expanded={isProfileDropdownOpen}
                        >
                            <img
                                src={user?.profileimage || assets.profile_icon}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                width="40"
                                height="40"
                            />
                        </button>
                        {isProfileDropdownOpen && (
                            <ul
                                className="absolute top-12 right-0 bg-white shadow-lg border border-gray-200 py-2 w-40 rounded-md text-sm z-40"
                                role="menu"
                            >
                                <li
                                    onClick={() => {
                                        navigate("/profile");
                                        setIsProfileDropdownOpen(false);
                                    }}
                                    className="p-2 pl-3 flex gap-2 hover:bg-indigo-50 cursor-pointer text-gray-700"
                                    role="menuitem"
                                >
                                    <span>Edit</span>
                                    <img className="w-4 h-4" src={assets.edit} alt="" aria-hidden="true" />
                                </li>
                                <li
                                    onClick={() => {
                                        navigate("/orderdetails");
                                    }}
                                    className="p-2 pl-3 flex gap-2 hover:bg-indigo-50 cursor-pointer text-gray-700"
                                    role="menuitem"
                                >
                                    <span>Orders</span>
                                    <img className="w-4 h-4" src={assets.edit} alt="" aria-hidden="true" />
                                </li>
                                <li
                                    onClick={() => {
                                        logout();
                                        setIsProfileDropdownOpen(false);
                                    }}
                                    className="p-2 pl-3 hover:bg-indigo-50 cursor-pointer text-gray-700"
                                    role="menuitem"
                                >
                                    Logout
                                </li>
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                {!user ? (
                    <button
                        onClick={() => setShowUserLogin(true)}
                        className="cursor-pointer px-6 py-1.5  hover:bg-gray-100 transition text-Black rounded-xl text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        aria-label="Login"
                    >
                        Login
                    </button>
                ) : (
                    <button
                        onClick={() => logout()}
                        className="cursor-pointer px-6 py-1.5  hover:bg-gray-100 transition text-Black rounded-xl text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        aria-label="Login"
                    >
                        Logout
                    </button>
                )}

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="focus:outline-none"
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    <svg
                        className={`h-7 w-7 ${isScrolled ? "text-gray-800" : "text-white"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-300 ease-in-out transform ${isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                    }`}
                aria-hidden={!isMenuOpen}
            >


                <button
                    className="absolute top-6 right-6 focus:outline-none"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <NavLink to="/" className="hover:scale-110 transition-transform duration-200 p-2 rounded-2xl">
                    <img className="h-15 rounded w-22" src={assets.mrulogo} alt="logo" />
                </NavLink>

                {navLinks.map((link, i) => (
                    <NavLink
                        key={i}
                        to={link.path}
                        className={({ isActive }) => `text-lg ${isActive ? "text-indigo-600 font-semibold" : "text-gray-700 hover:text-indigo-600"
                            } transition-colors`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {link.name}
                    </NavLink>
                ))}
                {user?.role === "admin" && (
                    <button
                        onClick={() => navigate("/adminhome")}
                        className="cursor-pointer px-6 py-1.5 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-full text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        aria-label="Admin dashboard"
                    >
                        Admin
                    </button>
                )}
                {user ? (<Link to='/orderdetails'>Order Details</Link>) : (null)}



                {user ? (
                    <>
                        <button
                            onClick={() => navigate("/profile")}
                            className="border border-indigo-600 px-6 py-2 text-indigo-600 font-medium rounded-full cursor-pointer transition-all hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Profile
                        </button>
                        <button
                            onClick={logout}
                            className="cursor-pointer px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-full text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => {
                            setShowUserLogin(true);
                            setIsMenuOpen(false);
                        }}
                        className="cursor-pointer px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-full text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    setShowUserLogin: PropTypes.func.isRequired,
};

export default Navbar;