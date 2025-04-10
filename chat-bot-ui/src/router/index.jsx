import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Dashboard from "../pages/Dashboard";
import WelcomePage from "../pages/auth/WelcomePage";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import AuthLayout from "../pages/auth/AuthLayout";
import ChatPage from "../pages/ChatPage";
import RequestForgotPassword from "../pages/auth/RequestForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <Dashboard/>
            },
            {
                path: "/chat/:id",
                element: <ChatPage/>
            }         
        ]
    },
    {
        path: "/welcome",
        element: <WelcomePage/>
    },
    {
        path: "/auth/",
        element: <AuthLayout/>,
        children: [
            {
                path: "register",
                element: <SignUp/>
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "request-password",
                element: <RequestForgotPassword/>
            },
            {
                path: "reset-password",
                element: <ResetPassword/>
            }
        ]
    }

])

export default router;