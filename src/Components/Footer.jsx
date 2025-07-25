import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { FiHeart, FiMail, FiPhone } from 'react-icons/fi';
import { FaLinkedin } from 'react-icons/fa';


const Footer = () => {
    return (
        <div className="w-full p-2 overflow-x-hidden">
            <footer className="p-5 rounded-2xl md:px-10 lg:px-16 w-full text-gray-900 bg-gray-100 dark:bg-gray-600 dark:text-gray-100">
                <div className="flex flex-col md:flex-row justify-between w-full gap-5 md:gap-10 border-b border-gray-800 pb-10">
                    {/* Left Section */}
                    <div className="max-w-sm md:max-w-md w-full">
                        {/* Logo and Description */}
                        <div className="flex flex-row sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                            <img
                                className="w-24 h-auto rounded-2xl"
                                src={assets.mrulogo}
                                alt="logo"
                            />
                            <p className="text-sm text-black text-center sm:text-left px-2 sm:px-0">
                                We believe every student deserves a stress-free living experience that supports both academic success and personal growth. That’s why we provide not just rooms — but a complete ecosystem of modern amenities, responsive service, and a supportive community environment.
                            </p>
                        </div>

                        {/* Store Buttons */}
                        <div className="flex justify-center sm:justify-start items-center gap-3 mt-4">
                            <img
                                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg"
                                alt="Google Play"
                                className="h-10 w-auto border border-white rounded"
                            />
                            <img
                                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/appleStoreBtnBlack.svg"
                                alt="App Store"
                                className="h-10 w-auto border border-white rounded"
                            />
                        </div>
                    </div>


                    {/* Right Section */}
                    <div className="flex-1 flex flex-col sm:flex-row md:justify-end gap-2 md:gap-20">
                        <div className='flex flex-row'>
                            <div className='md:block hidden'>
                                <h2 className="font-semibold mb-5">Company</h2>
                                <ul className="text-sm flex-col items-center justify-center space-y-2">
                                    <li><Link to="#">Home</Link></li>
                                    <li><Link to="#">About us</Link></li>
                                    <li><Link to="#">Contact us</Link></li>
                                    <li><Link to="#">Privacy policy</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="font-semibold mb-1">Get in touch</h2>
                                <div className="flex text-black items-center gap-2">
                                    <FiPhone className="text-[#06d6a0] text-lg" />
                                    <p>+1-234-567-890</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FiMail className="text-[#06d6a0] text-lg" />
                                    <p className='text-black'>contact@example.com</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className='md:block hidden'>
                                <p className='text-lg text-gray-600 dark:text-gray-300'>STAY UPDATED</p>
                                <p className='mt-3  text-sm'>
                                    Subscribe to our newsletter for inspiration and special offers.
                                </p>
                                <div className=' flex items-center  mt-4 max-w-full sm:max-w-xs'>
                                    <input
                                        type="text"
                                        className='flex-grow bg-gray-200 rounded-l border border-gray-300 h-9 px-3 outline-none'
                                        placeholder='Your email'
                                    />
                                    <button className='bg-black h-9 w-9 rounded-r flex items-center justify-center'>
                                        <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-10 px-4 py-4 text-black text-center">
                    <p className="text-sm sm:text-[3.5vw] md:text-sm leading-snug">
                        © {new Date().getFullYear()} Malla Reddy University. All Rights Reserved.
                    </p>

                    <div className="flex items-center shadow-2xl gap-2 text-sm sm:text-[3.5vw] md:text-sm">
                        <p>Made with</p>
                        <FiHeart className="text-green-500" />
                        <p>By Nagaruthwik</p>
                    </div>
                    <div className="flex items-center shadow-2xl gap-2 text-sm sm:text-[3.5vw] md:text-sm">
                        <FaLinkedin className="text-blue-600" />
                        <a
                            href="https://www.linkedin.com/in/nagaruthwikmerugu/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-300"
                        >
                            linkedin.com/in/nagaruthwikmerugu
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer
