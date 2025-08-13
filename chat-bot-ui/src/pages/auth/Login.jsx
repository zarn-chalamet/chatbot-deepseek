import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/PasswordInput';
import {AuthContext} from "../../context-api/AuthContext"
import axios from 'axios';

const Login = () => {

  const {dispatch} = useContext(AuthContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!email || !password){
      return;
    }
    try {
      const response = await axios.post(backendUrl + "/api/v1/auth/login",{
        email,
        password
      });

      console.log(response);
      if(response.status == 200){
        localStorage.setItem('token',response.data.token);
        dispatch({type: 'auth/login', payload: response.data.token})
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      // Check if server returned 401 or 404
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError("Wrong email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border-spacing-1">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {/* Display error message */}
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/auth/request-password"
              className="text-sm text-blue-500 hover:underline focus:outline-none"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/auth/register">
            <span className="text-blue-500 hover:underline focus:outline-none">
              Sign Up
            </span>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login