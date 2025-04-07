import React from 'react'
import { Outlet } from 'react-router-dom'
import Welcome from "../../components/Welcome"

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700">
      {/* Left side - Welcome Section */}
      <div className='w-1/2 flex flex-col justify-center items-center'>
        <Welcome/>
      </div>

      {/* Right side - Login/Register Outlet */}
      <div className="w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

    </div>
  )
}

export default AuthLayout