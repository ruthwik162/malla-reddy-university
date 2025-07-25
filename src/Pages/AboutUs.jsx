import React from 'react'
import AboutCard from '../Components/AboutCard'
import HostelImages from '../Components/HostelImages';

const AboutUs = () => {
  return (
    <div className='relative min-h-screen py-5 overflow-hidden'>
      <HostelImages/>
        <AboutCard/>
    </div>
  )
}

export default AboutUs;