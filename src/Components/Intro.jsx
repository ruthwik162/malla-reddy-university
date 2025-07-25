import React from 'react';
import { motion } from 'framer-motion';

const Intro = () => {
    return (
        <section className="w-full px-3 md:px-12 pt-5 bg-white text-black">
            <div className="max-w-9xl bg-indigo-300 rounded-2xl p-5 mx-auto text-center space-y-8">
                <motion.h2
                    className="text-4xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 text-transparent bg-clip-text"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Introducing Our Hostel Booking Platform
                </motion.h2>

                <motion.p
                    className="text-sm md:text-xl  md:px-5 text-indigo-100 max-w-3xl md:max-w-7xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    Welcome to the future of student accommodation. Our platform is built to make hostel living simple, transparent, and comfortable for every student. Whether you're looking for budget-friendly shared rooms or premium private spaces, we offer a range of customizable plans designed to match your lifestyle and financial needs.
                    <br /><br />
                    We believe every student deserves a stress-free living experience that supports both academic success and personal growth. That’s why we provide not just rooms — but a complete ecosystem of modern amenities, responsive service, and a supportive community environment.
                    <br /><br />
                    With just a few clicks, students can browse plans, compare features, and choose the perfect fit — no paperwork, no confusion. Our system ensures clarity in pricing, quality in accommodation, and flexibility in selection.
                </motion.p>


            </div>
        </section>
    );
};

export default Intro;
