import {
  FiMenu,
  FiPlus,
  FiSearch,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ChatItem from "./ChatItem";
import { useContext, useEffect } from 'react';
import { ChatContext } from '../context-api/ChatContext';

const Sidebar = ({isOpen,setIsOpen}) => {
  // const [isOpen, setIsOpen] = useState(true);
  const {chatList,getChatList,createChat} = useContext(ChatContext);

  const createNewChat = () => {
    createChat();
  }

  useEffect(()=>{
    getChatList();
  },[])

  return (
    <div>
      {
        isOpen && 

        <div className={`flex flex-col h-screen bg-white ${isOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r-2`}>
          {/* Top bar */}
          <div className="flex items-center justify-between p-4 border-gray-700 mt-3">
            <button onClick={() => setIsOpen(!isOpen)} className=" hover:text-blue">
              <FiMenu />
            </button>
            {
              isOpen && 
              <button>
              <FiSearch className="text-black" />
            </button>
            }
          </div>

          {/* New Chat Button */}
          <div className="px-4 py-3">
            <button onClick={createNewChat} className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-sm rounded-md transition w-full">
              <FiPlus className='text-white' />
              <span className='text-white'>New Chat</span>
            </button>
          </div>

          {/* Chat list (sample items) */}
          <div className="flex-1 overflow-y-auto px-4 space-y-2 text-sm">
            {/* right now only string. when dev put the chat object */}
              {chatList.length > 0 && chatList.map((chat,index) => (
                 <ChatItem key={index} chat={chat}/>
              ))}
          </div>
        </div>
      }
    </div>
  );
};

export default Sidebar;
