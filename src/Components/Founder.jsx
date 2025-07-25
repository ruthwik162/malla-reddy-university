import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const Founder = () => {
  const leaders = [
    {
      name: 'Sri. Ch. Malla Reddy',
      title: 'Founder Chairman',
      image: assets.mallareddy,
      bio: 'Shri. Ch Malla Reddy, the most humble dynamic and charismatic founder chairman is a visionary who brought about a revolution in the field of education. He is the avant-garde in creating numerous avenues which made Professional and Technical education accessible to young aspirants. Under his esteemed leadership, the campus has grown by leaps and bounds to become a major learning center. He has established an education hub with 32 Institutions including Malla Reddy Tech City and Malla Reddy Health City offering all the Medical, Dental, Engineering, Management, Information Technology, Pharmacy and Nursing  courses.',
      achievements: [
        'Education revolutionary',
        'Technical education pioneer',
        'Established multiple institutions'
      ]
    },
    {
      name: 'Dr. VSK Reddy',
      title: 'Vice Chancellor - MRUH',
      image: assets.vsk,
      bio: 'Dr.VSK Reddy, Vice-Chancellor, Malla Reddy University has an experience of more than 29 years in Teaching and Industry put together. He is an alumni of Indian Institute of Technology, (IIT) obtained his Ph.D and he is versatile in Multidisciplinary Specializations in Communications and Computer Science Engineering. His laurels include more than 150 Publications in reputed International and National  Journals and conference Proceedings with more than 500 Google Scholar citations. He is an editor for more than 10 Scopus indexed Springer Proceedings. He is a fellow of IETE, Life Member of ISTE, Member of IEEE and member of CSI. He was awarded as “Best Teacher” in three consecutive Academic years with citation and cash award.',
      achievements: [
        'IIT alumnus',
        'Ph.D. holder',
        'Industry-academia bridge'
      ]
    }
  ];

  return (
    <section className="w-full pt-5 bg-white md:px-10 px-3 sm:px-8 relative overflow-hidden">
      {/* Decorative elements */}

      <div className="max-w-9xl bg-green-200 md:p-10 p-3 rounded-2xl mx-auto relative">
        <div className="absolute top-20 -right-20 w-64 h-64 rounded-full bg-indigo-500 opacity-40"></div>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase">
            Our Leadership
          </span>
          <h2 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            Guiding Visionaries
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the exceptional minds shaping our institution's future
          </p>
        </motion.div>

        {/* Leadership cards */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 px-3 md:px-10 gap-6 sm:gap-8" // Reduced gap for mobile
        >
          {leaders.map((leader, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>

              <div className="relative h-full p bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Flex column on mobile, row on md+ */}
                <div className="flex flex-col md:gap-10 md:flex-row h-full">
                  {/* Image section - full width on mobile */}
                  <div className="w-full h-68 md:h-96 md:w-56 relative"> {/* Fixed height for mobile */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
                    <img
                      className="w-full h-full object-cover object-top"
                      src={leader.image}
                      alt={leader.name}
                      loading="lazy" 
                    />
                    <div className="absolute bottom-4 left-4 z-20">
                      <h3 className="text-lg sm:text-xl font-bold text-white">{leader.name}</h3>
                      <p className="text-xs sm:text-sm text-blue-100">{leader.title}</p>
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="p-4 sm:p-6 flex-1"> {/* Reduced padding on mobile */}
                    <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 line-clamp-7"> {/* Limited lines for mobile */}
                      {leader.bio}
                    </p>

                    <div className="mb-4 sm:mb-6">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Key Contributions
                      </h4>
                      <ul className="space-y-1 sm:space-y-2">
                        {leader.achievements.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                              fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-xs sm:text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3"> {/* Stack buttons on mobile */}
                      <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                        View Profile
                      </button>
                      <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button className="px-8 py-3 font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            View Full Leadership Team
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Founder;