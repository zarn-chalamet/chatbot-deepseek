import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEllipsisH } from 'react-icons/fa';
import { ChatContext } from '../context-api/ChatContext';

const ChatItem = ({ chat }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const { deleteChatById, updateChatTitle } = useContext(ChatContext);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (isRenaming) {
          setIsRenaming(false);
        }
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isRenaming, newTitle, chat.id,]);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenaming]);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleRenameSubmit = (e) => {
    if (e.key === 'Enter' && newTitle.trim() !== '') {
      updateChatTitle(chat.id, newTitle);
      setIsRenaming(false);
    }
  };

  const deleteChat = (id) => {
    setShowMenu(false);
    deleteChatById(id);
  };

  return (
    <div ref={containerRef} className="relative text-sm">
      <div
        className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl cursor-pointer text-white group transition duration-200"
        onClick={() => !isRenaming && navigate("/chat/" + chat.id)}
      >
        <div className="flex items-center justify-between">
          {
            isRenaming ? (
              <input
                ref={inputRef}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleRenameSubmit}
                placeholder={chat.title}
                className="bg-gray-700 text-white w-full mr-2 px-2 py-1 rounded outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="font-medium truncate">{chat.title}</span>
            )
          }
          <span
            onClick={handleMenuClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-gray-300 ml-2"
          >
            <FaEllipsisH className="w-4 h-4" />
          </span>
        </div>
      </div>

      {showMenu && (
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute -right-3 top-12 bg-white text-gray-800 shadow-xl rounded-xl z-50 w-28 border border-gray-200 animate-fade-in"
        >
          <button
            onClick={() => {
              setShowMenu(false);
              setIsRenaming(true);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-t-xl transition"
          >
            Rename
          </button>
          <button
            onClick={() => deleteChat(chat.id)}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 transition"
          >
            Delete
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
  );
};

export default ChatItem;
