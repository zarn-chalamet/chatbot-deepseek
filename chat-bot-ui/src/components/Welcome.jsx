import React from 'react'
import { FaRobot } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Modal = () => {
  return (
    <div>
      {/* Left side - Welcome Section */}
      <div className="  text-white flex flex-col justify-center items-center px-10">
        <FaRobot className="text-6xl mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-center drop-shadow-lg">Welcome to ChatWise</h1>
        <p className="text-center text-lg text-gray-200 max-w-md">
          Your smart AI assistant, ready to help you chat, learn, and connect anytime.
        </p>
        <Link to="/auth/register">
          <button className="mt-6 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-indigo-100 transition duration-300">
            Register Now
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Modal