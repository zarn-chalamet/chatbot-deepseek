import React from 'react'
import Welcome from "../../components/Welcome"

const WelcomePage = () => {


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 text-white px-6">
      <div className="flex flex-col items-center space-y-6 max-w-2xl text-center">
        <Welcome/>
      </div>
    </div>
  )
}

export default WelcomePage