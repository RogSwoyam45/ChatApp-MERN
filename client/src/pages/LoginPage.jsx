import React, { useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../Context/AuthContext'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (e) =>{
    e.preventDefault();
    
    if(currState === "Sign up" && !isDataSubmitted) {
      // Handle sign up logic
      console.log("Signing up with", { fullName, email, password, bio });
      setIsDataSubmitted(true);
    } else {
      // Handle login logic
      console.log("Logging in with", { email, password });
      // Here you would typically send a request to your backend to log the user in
    }

    login(currState === "Sign up" ? 'signup' : 'login ', {fullName, email , password, bio})
    
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* leftside*/}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]'/>

      {/* right side*/}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-600 p-6 flex flex-col gap-6 rounded-lg
      shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)}
           src={assets.arrow_icon} alt='' className='w-5 cursor-pointer' />}
        </h2> 

        {currState ==="Sign up" && !isDataSubmitted && (
          <input type='text' className='p-2 border border-gray-500 rounded-md focus:outline-none' 
          placeholder='Full Name' required/>

        )}

        {!isDataSubmitted && (
          <>
          <input onChange={(e)=>setEmail(e.target.value)} value={email}
           type="email" placeholder='Email Address' required 
          className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />

          <input onChange={(e)=>setPassword(e.target.value)} value={password}
           type="password" placeholder='password' required 
          className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea onChange={(e) => setBio(e.target.value)} value={bio}
          rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          placeholder='bio' required></textarea>
        )

        }

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-500-to-pink-600 text-white rounded-md cursor-pointer'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" name='' id='' />
          <p>Agree to the terms of use and privacy policy.</p>
        </div>

        <div>
          {currState === "Sign up" ? (
            <p className='text-sm text-gray-600'>Already have an account. 
            <span onClick={() => {setCurrState("Login"); setIsDataSubmitted(false)}}
            className='font-medium text-violet-500 cursor-pointer'>Login here</span>
            </p>
          ):(
            <p className='text-sm text-gray-600'>Create an account 
            <span onClick={() => {setCurrState("Sign up")}}
             className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
          )}
        </div>

      </form>
      
    </div>
  )
}

export default LoginPage
