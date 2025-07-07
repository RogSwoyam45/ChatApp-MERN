import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../Context/AuthContext'


const App = () => {
  const {authUser} = useContext(AuthContext)
  return (
    <div className="bg-[url('./src/assets/bgImage,svg')] bg-contain">
      <Toaster />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ?  <LoginPage /> : <Navigate to="/login" />} />
        <Route path="/Profile" element={authUser ? <ProfilePage /> :<Navigate to="/login" /> } />
      </Routes>
    </div>
  )
}

export default App
