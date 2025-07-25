import React, { useState, useEffect } from "react";
import { useAppContext } from "../AppContext/AppContext";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const AdminNav = () => {
    const navLinks = [
        { name: 'Details', path: '/adminhome' },
        { name: 'Reports', path: '/adminreports' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { user, setUser, navigate, logout } = useAppContext();

    // Fetch user profile image from backend
    useEffect(() => {
        const fetchUser = async () => {
            const username = localStorage.getItem("username");
            if (!user && username) {
                try {
                    const res = await fetch("http://localhost:8087/user/all");
                    const data = await res.json();
                    const currentUser = data.find(u => u.username === username);
                    if (currentUser) {
                        setUser(currentUser);
                    }
                } catch (err) {
                    console.error("Failed to fetch user:", err);
                }
            }
        };
        fetchUser();
    }, [user, setUser]);
    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
            const email = storedUser?.email;

            if (!user && email) {
                try {
                    const res = await fetch(`http://localhost:8087/user/profile?email=${email}`);
                    const data = await res.json();
                    setUser(data);
                } catch (err) {
                    console.error("Failed to fetch user profile:", err);
                }
            }
        };
        fetchUser();
    }, [user, setUser]);


    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0  w-full flex items-center bg-cover justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

            {/* Logo */}
            <NavLink to="/adminhome" className="hover:scale-110 transition-transform duration-200 p-2 rounded-2xl">
                <img className="h-15 rounded w-22" src={assets.mrulogo} alt="logo" />
            </NavLink>

            {/* <h1 onClick={() => navigate("/")} className="text-2xl cursor-pointer sm:text-2xl md:text-2xl md:gap-6 font-bold max-w-2xl text-white">
                MallaReddy University
            </h1> */}

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <NavLink key={i} to={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-black"}`}>
                        {link.name}
                        <div className={`${isScrolled ? "bg-gray-700" : "bg-black"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </NavLink>
                ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                <button
                    onClick={() => navigate("/")}
                    className="cursor-pointer px-6 py-1.5 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-full text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label="Admin dashboard"
                >
                    Home
                </button>
                <div className="relative group">
                    <img
                        src={user?.profileimage || assets.profile_icon}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover "
                    />
                    <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
                        <li onClick={logout} className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer">
                            Logout
                        </li>
                    </ul>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                <svg onClick={() => setIsMenuOpen(!isMenuOpen)} className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-7 right-4" onClick={() => setIsMenuOpen(false)}>
                    <svg className="h-8 w-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <NavLink to="/adminhome" className="hover:scale-110 transition-transform duration-200 p-2 rounded-2xl">
                    <img className="h-15 rounded w-22" src={assets.mrulogo} alt="logo" />
                </NavLink>

                {navLinks.map((link, i) => (
                    <NavLink key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                    </NavLink>
                ))}
                <button
                    onClick={() => navigate("/")}
                    className="cursor-pointer px-6 py-1.5 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-full text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label="Admin dashboard"
                >
                    Home
                </button>

                <button onClick={() => navigate("/profile")} className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
                    Profile
                </button>

                <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-400 transition text-white rounded-full text-sm">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default AdminNav;
