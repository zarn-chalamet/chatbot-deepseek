import React from 'react'

const ChatItem = ({chat}) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-2 text-sm">
        <div className="bg-gray-800 hover:bg-gray-700 p-2 rounded-md cursor-pointer text-white">
            {chat}
        </div>
    </div>
  )
}

export default ChatItem