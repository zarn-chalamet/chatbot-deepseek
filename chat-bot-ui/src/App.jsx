import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import { useState } from "react";

function App() {
  
  const [isOpen, setIsOpen] = useState(false);


  return (
    <>
      <div className="flex flex-row min-h-screen bg-gray-100">
        {/* Sidebar - fixed on the left */}
        <div className="">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <div className="bg-white shadow-md z-10">
            <Navbar isSidebarOpen={isOpen} setIsSidebarOpen={setIsOpen}/>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 bg-gray-50">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
