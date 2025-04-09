import React, { useContext, useRef, useState, useEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { AuthContext } from '../context-api/AuthContext';
import { ChatContext } from '../context-api/ChatContext';
import ProfileModal from './ProfileModal';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const [showProfileModal, setShowProfileModal] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowMenu(false);
    dispatch({ type: 'auth/logout' });
    navigate("/auth/login");
  };

  const handleProfileButton = () => {
    setShowMenu(false);
    setShowProfileModal(true);
  }

  return (
    <nav className="relative w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo + Menu */}
      <div className="flex items-center gap-5">
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-700 hover:text-blue-500">
            <FiMenu className="text-xl" />
          </button>
        )}
        <Link to="/" className="text-xl font-bold text-blue-600 tracking-wide flex items-center gap-2">
          <FaRobot className="text-2xl" />
          ChatWise
        </Link>
      </div>

      {/* Profile Avatar */}
      <div className="flex items-center space-x-4 relative">
        <button onClick={(e) => {
          e.stopPropagation()
          setShowMenu(!showMenu)
        }}>
          <img
            src="https://i.pravatar.cc/300"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-blue-500 hover:scale-105 transition duration-200"
          />
        </button>

        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-0 top-12 bg-white text-gray-800 shadow-xl rounded-xl z-[999] w-32 border border-gray-200 animate-fade-in"
          >
            <button
              onClick={() => handleProfileButton()}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-t-xl transition"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition"
            >
              Logout
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                console.log("Archive clicked");
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-b-xl transition"
            >
              Archive
            </button>
          </div>
        )}

        
      </div>
      {
          showProfileModal && 
          <ProfileModal setShowProfileModal={setShowProfileModal} handleLogOut={handleLogout}/>
        }
    </nav>
  );
};

export default Navbar;
