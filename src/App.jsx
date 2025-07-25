import React from 'react'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Login from './Components/Login'
import { useAppContext } from './AppContext/AppContext'
import { Toaster } from 'react-hot-toast'
import Footer from './Components/Footer'
import AboutUs from './Pages/AboutUs'
import ContactUs from './Pages/ContactUs'
import Plan from './Pages/Plan'
import AdminNav from './Admin/AdminNav'
import AdminHome from './Admin/AdminHome'
import Reports from './AdminPages/Reports'
import AdminReports from './Admin/AdminReports'
import Profile from './Components/Profile'
import PlanDetails from './Components/PlanDetails'
import BookingPage from './AdminPages/BookingPage'
import OrderDetails from './Components/OrderDetails'

const App = () => {
  const {showUserLogin} = useAppContext();
  const isAdmin = useLocation().pathname.includes("admin")
  return (
    <div>
      {!isAdmin ? (<Navbar/>) : <AdminNav/> }
      {showUserLogin? <Login/> : null}
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/about' element={<AboutUs/>}/>
        <Route path='/orderdetails' element={<OrderDetails/>}/>
        <Route path='/reports' element={<Reports/>}/>
        <Route path='/plan' element={<Plan/>}/>
        <Route path='/plan/:id' element={<PlanDetails/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/contactus' element={<ContactUs/>} />
        <Route path='/adminhome' element={<AdminHome/>}/>
        <Route path='/adminreports' element={<AdminReports/>}/>
        <Route path='/adminhome/:blockId' element={<BookingPage/>}/>
        
      </Routes>
      {!isAdmin ? (<Footer/>) : null }
    </div>
    
    
  )
}

export default App