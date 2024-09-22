import React from 'react'
import { useState } from 'react';
import Toast from '../../../toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    pic: '',
  });
  const [loading, setloding] = useState(false);
  const [passwordVisib, setpasswordVisib] = useState(false);
  const [toast, settoast] = useState({
    type: '',
    message: '',
    visible: false,
  });
  const navigate = useNavigate();
  const postDetails = (pic) => {
    setloding(true);
    if (formData.pic == undefined) {
      //toast
      settoast({
        type: 'error',
        message: 'unable to picture',
        visible: true,
      });
      // toast end
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "mern-chat-app");
      data.append("cloud_name", "dwnpdeokn");
      fetch("https://api.cloudinary.com/v1_1/dwnpdeokn/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            pic: data.url.toString(),
          }));
          setloding(false);
        });
    } else {
      //toast
      settoast({
        type: 'error',
        message: 'unable to add this type of file',
        visible: true,
      });
      //toast end
      setloding(false);
    }

  }

  const togelpass = () => {
    setpasswordVisib(!passwordVisib);
  }
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setloding(true);
      settoast({
        type: 'error',
        message: 'please and all the feilds',
        visible: true,
      });
      setloding(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      settoast({
        type: 'error',
        message: 'password donot match',
        visible: true,
      });
      return;
    }
    try {
     
        setloding(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
        const { data } = await axios.post("http://localhost:5000/api/users/signup",
          formData,
          config
        );
        if (data.success) {
          //success signup
        settoast({
          type: 'success',
          message: 'register successful',
          visible: true,
        });
        localStorage.setItem("userInfo", JSON.stringify(data))
        setloding(false);
        navigate("/chats");
      } else {
        // failed singup
        settoast({
          type: 'error',
          message:" email already exist",
          visible: true,
        });
      }

    } catch (error) {
      settoast({
        type: 'error',
        message: "error!! email id already exist",
        visible: true,
      });
      console.log(error);
      
    }

  };
  return (

    <div className="container mx-auto min-auto ">

      <div className="
    h-[85px] 
    w-[400px]
     ml-[388px] 
     mt-5
     flex
    container 
    content-center 
    items-center
     justify-center
    rounded-lg
    text-xl
    Work sans
    mx-auto
    min-auto
    bg-slate-50">
        <h3 className="text-center">Signup</h3>
      </div>
      <div className="component
    container 
    w-[400px] 
    ml-[390px]
    rounded-lg
      content-center    
      pt-4
      mt-2
      mb-7
    bg-slate-50">
        <div className="min-h-screen flex items-center justify-center  pb-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete='name'
                required
              />
            </div>
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
                autoComplete='password'
                required
              />
              <button onClick={togelpass} className='bg-cyan-500 p-1 m-1 rounded-sm color-sky text-slate-50 ' >{passwordVisib ? 'hide' : 'show'}</button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete='confirmpassword'
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="pic">
                Picture
              </label>
              <input
                type="file"
                name="pic"
                id="pic"
                // value={formData.pic[0]}
                accept='image/*'
                onChange={(e) => postDetails(e.target.files[0])}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              className={`relative inline-flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              type='submit'

            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 border-t-2 border-r-2 border-white rounded-full"
                    viewBox="0 0 24 24"
                  ></svg>
                  Loading...
                </>
              ) : (
                'Click Me'
              )}
            </button>
            <br /><br />
            {/* Conditionally show the Toast */}
            {toast.visible && (
              <Toast
                type={toast.type}
                message={toast.message}
                onClose={() => settoast({ ...toast, visible: false })}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
