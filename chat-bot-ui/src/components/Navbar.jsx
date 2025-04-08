import React, { useContext } from 'react'
import { FaRobot } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiMenu,
} from 'react-icons/fi';
import { AuthContext } from '../context-api/AuthContext';
import { ChatContext } from '../context-api/ChatContext';

const Navbar = ({isSidebarOpen,setIsSidebarOpen}) => {

  const {dispatch} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({type: 'auth/logout'})
    navigate("/auth/login");
  }
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex flex-row gap-5 items-center">
        {
          !isSidebarOpen && 
          <button onClick={() => setIsSidebarOpen(true)} className=" hover:text-blue">
            <FiMenu />
          </button>
        }
        <Link to="/" className="text-xl font-bold text-blue-600 tracking-wide">
          <div className='flex flex-row gap-2 justify-center items-center'>
            <FaRobot className="text-2xl" />
            ChatWise
          </div>
        </Link>
      </div>

      {/* Profile Avatar */}
      <div className="flex items-center space-x-4">
        {/* Optional: Add a notification or settings icon here */}
        <button onClick={handleLogout}>
          <img
              src="https://i.pravatar.cc/300"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-blue-500 hover:scale-105 transition duration-200"
            />
        </button>
      </div>
    </nav>
  )
}

export default Navbar