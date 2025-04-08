import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PasswordInput from '../../components/PasswordInput';

const ResetPassword = () => {

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        console.log("token");
        console.log(token)

        try {
        const response = await axios.post(
            `${backendUrl}/api/v1/auth/reset-password`,
            {
                newPassword,
                token
            }
        );
        
        console.log(response);
        if (response.status === 200) {
            setMessage('New password updated. Login again!');
            setNewPassword('');
        }
        } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || 'Something went wrong.');
        }
    };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div> */}
          <div className='mb-4'>
            <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={"Enter your new password"}/>
          </div>

          {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Reset Password
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          <Link to="/auth/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
