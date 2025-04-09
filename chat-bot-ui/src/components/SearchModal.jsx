import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SearchModal = ({ setShowSearchModal, chatList }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredChatList, setFilteredChatList] = useState(chatList);

  const navigate = useNavigate();

  useEffect(() => {
    const filteredChats = chatList.filter(chat =>
      chat.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredChatList(filteredChats);
  }, [searchKeyword, chatList]);

  const handleClickOutside = (e) => {
    if (e.target.id === 'searchModalOverlay') {
      setShowSearchModal(false);
    }
  };

  const handleClickChat = (chatId) => {
    setShowSearchModal(false);
    navigate("/chat/"+chatId);
  }

  return (
    <div
      id="searchModalOverlay"
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
        {/* Close button */}
        <button
          onClick={() => setShowSearchModal(false)}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-2xl"
        >
          &times;
        </button>

        {/* Search Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Search Chats
        </h2>

        {/* Search Input */}
        <div className="relative mb-8">
          <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search by name or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Chats List */}
        <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {filteredChatList.length > 0 ? (
            filteredChatList.map((chat, index) => (
              <div
                key={index}
                onClick={()=>handleClickChat(chat.id)}
                className="p-2 rounded-md hover:bg-blue-50 transition border border-gray-300 cursor-pointer mb-1"
              >
                <p className="text-gray-800 font-medium">{chat.title}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No chats found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
