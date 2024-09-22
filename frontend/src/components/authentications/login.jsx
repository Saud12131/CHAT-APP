import React, { useState } from 'react';
import Toast from '../../../toast'; // Ensure that this is a valid path and component
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [toast, settoast] = useState({
    type: '',
    message: '',
    visible: false,
  });

  const navigate = useNavigate();
  const [loading, setloding] = useState(false);
  const [passwordVisib, setpasswordVisib] = useState(false);

  const togglePassword = () => {
    setpasswordVisib(!passwordVisib);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloding(true);  // Set loading to true

    if (!formData.email || !formData.password) {
      settoast({
        type: 'error',
        message: 'Please enter all the fields',
        visible: true,
      });
      setloding(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        formData,
        config
      );

      if (data.success) {
        // Successful login
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/');
      } else {
        // Failed login
        settoast({
          type: 'error',
          message: 'Invalid email or password',
          visible: true,
        });
        setloding(false);
      }

    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : 'An error occurred. Please try again.';

      settoast({
        type: 'error',
        message: errorMessage,
        visible: true,
      });
      setloding(false);
      console.log(error);
    }

  };

  return (
    <div className="container mx-auto min-auto">
      <div className="
        h-[85px] 
        w-[400px]
        ml-[388px] 
        mt-5
        flex
        content-center 
        items-center
        justify-center
        rounded-lg
        text-xl
        Work sans
        bg-slate-50">
        <h3 className="text-center">Login</h3>
      </div>

      <div className="component container w-[400px] ml-[390px] rounded-lg pb-10 mt-2 mb-7 bg-slate-50">
        <div className="flex items-center justify-center pb-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type={passwordVisib ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="password"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="bg-cyan-500 p-1 m-1 rounded-sm text-slate-50"
              >
                {passwordVisib ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

      {/* Display Toast if visible */}
      {toast.visible && (
        <Toast type={toast.type} message={toast.message} />
      )}
    </div>
  );
};
