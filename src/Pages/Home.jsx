import React from 'react'
import Hero from '../Components/Hero'
import PriceOffer from '../Components/PriceOffer'
import PricingPlans from '../Components/PricingPlans '
import Founder from '../Components/Founder'
import PriceCategory from '../Components/PriceCategory'
import Hostel from '../Components/Hostel'
import Intro from '../Components/Intro'

const Home = () => {
  return (
    <div className=''>
      <Hero />
      <Intro/>
      <PriceCategory />
      <Founder />
    </div>
  )
}

export default Home