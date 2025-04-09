import React, { useContext, useEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ChatContext } from '../context-api/ChatContext';

const Dashboard = () => {

  const {createdChatId,createChat} = useContext(ChatContext);

  const navigate = useNavigate();

  const createNewChat = () => {
    createChat();
  }

  useEffect(() => {
    if (createdChatId) {
      navigate("/chat/" + createdChatId);
    }
  }, [createdChatId, navigate]);

  return ( 
    <div className=" bg-gray-50 py-10 px-5 md:px-10">
      {/* Dashboard Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to ChatWise Dashboard</h1>
        <p className="text-lg text-gray-700 mt-2">Your personal assistant powered by AI</p>
      </div>

      {/* Chatbot Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
          <FaRobot className="text-blue-600 text-6xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">AI-Powered Conversations</h3>
          <p className="text-gray-600 mt-2">Our chatbot leverages AI to engage in smart, meaningful conversations.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
          <FaRobot className="text-blue-600 text-6xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">Instant Responses</h3>
          <p className="text-gray-600 mt-2">Receive fast and accurate answers to your questions, 24/7.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
          <FaRobot className="text-blue-600 text-6xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">Seamless Integration</h3>
          <p className="text-gray-600 mt-2">Easily integrates with your existing platforms and tools.</p>
        </div>
      </div>

      {/* Create New Chat Button */}
      <div className="mt-10 text-center">
        <Link>
          <button onClick={()=> createNewChat()} className="bg-blue-600 text-white text-lg py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300">
            Create New Chat
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
