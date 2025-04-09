import React, { useContext, useEffect } from 'react'
import { ChatContext } from '../context-api/ChatContext';

const ProfileModal = ({setShowProfileModal,handleLogOut}) => {

    const {currentUser,getCurrentUserData} = useContext(ChatContext);

    useEffect(()=>{
      getCurrentUserData();
    },[])

    const handleClickOutside = (e) => {
        if (e.target.id === 'profileModalOverlay') {
          setShowProfileModal(false);
        }
      };

  return (
    <div
          id="profileModalOverlay"
          onClick={handleClickOutside}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg shadow-lg w-80 p-6 relative animate-fade-in">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <div className="text-center">
              <img
                src="https://i.pravatar.cc/300"
                alt="Profile"
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-400"
              />
              <h2 className="text-lg font-semibold mb-1">
                {currentUser && currentUser.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {currentUser && currentUser.email}
              </p>
              <button
                onClick={(e)=>{
                  e.stopPropagation();
                  setShowProfileModal(false);
                  handleLogOut();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition w-full"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
  )
}

export default ProfileModal