import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router';
import { RouterProvider } from 'react-router-dom';
import AuthContextProvider from './context-api/AuthContext';
import { ChatContextProvider } from './context-api/ChatContext';

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <ChatContextProvider>
    <RouterProvider router={router} /> 
    </ChatContextProvider>  
  </AuthContextProvider>
);