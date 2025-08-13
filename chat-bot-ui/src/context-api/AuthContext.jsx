import { jwtDecode }from "jwt-decode";
import { useEffect, useReducer } from "react";
import { createContext } from "react";

export const AuthContext = createContext();

const initialState = {
    accessToken: localStorage.getItem('token') || null,
    isAuthenticated: false,
    authReady: false
}

const authReducer = (state, action) => {
    switch (action.type) {
        case "auth/login":
        case "auth/authenticated":
            return { ...state, isAuthenticated: true, accessToken: action.payload };
        case "auth/logout":
        case "auth/unauthenticated":
            localStorage.removeItem('token')
            return { ...state, isAuthenticated: false, accessToken: null, refreshToken: null };
        case "auth/authReady":
            return { ...state, authReady: true };
        default:
            return state;
    }
}

const AuthContextProvider = ({children}) => {

    const [{ accessToken, isAuthenticated, authReady }, dispatch] = useReducer(authReducer, initialState);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
    const validateToken = () => {
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                const expTime = decoded.exp;
                const currentTime = Math.floor(Date.now() / 1000);
                if (expTime > currentTime) {
                    dispatch({ type: "auth/authenticated", payload: accessToken });
                    console.log(`Token is valid, expires in ${Math.floor((expTime - currentTime)/60)} minutes`);
                } else {
                    dispatch({ type: "auth/unauthenticated" });
                    console.warn("Access token expired, logging out...");
                }
            } catch (err) {
                console.error("Invalid token:", err);
                dispatch({ type: "auth/unauthenticated" });
            }
        } else {
            console.log('No Access Token Found');
            dispatch({ type: 'auth/unauthenticated' });
        }
        dispatch({ type: 'auth/authReady' });
    }

    validateToken();
}, [accessToken]);


    const value = {
        accessToken,isAuthenticated,authReady,dispatch,backendUrl
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;