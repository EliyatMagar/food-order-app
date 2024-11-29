import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import {Routes,Route,Navigate} from 'react-router-dom'
import Cart from './pages/Cart/Cart';
import Home from './pages/Home/Home'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopUp from './components/LoginPopUp/LoginPopUp';
import Verify from './pages/Verify/Verify';

const App = () => {
  const [showLogin,setShowLogin]=useState(false);
  const [isAuthenticated,setIsAuthenticated]=useState(false);

  //check if user is logged in on component mount

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(token){
      setIsAuthenticated(true);//user is logged in
    }
  },[]);

  return (
    <>
     {showLogin?<LoginPopUp setShowLogin={setShowLogin}/> : <></>}
      <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>

      <Routes>
        <Route path="/" element={<Home/>}/>
        {/* Proteced routes:show login popup if not authenticated*/}
        <Route path="/cart" element={isAuthenticated?<Cart/>:<Navigate to="/"/>}/>
        <Route path="/order" element={isAuthenticated?<PlaceOrder/>:<Navigate to="/"/>}/>
        <Route path='/verify' element={<Verify/>} />
      </Routes>
       
    </div>
    <Footer />
    </>
  
  )
}

export default App
