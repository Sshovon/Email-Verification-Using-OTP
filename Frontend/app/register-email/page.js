"use client";
import React, { useEffect, useState } from "react";
import Notification from "./Notification";
import { toast } from "react-toastify";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [clicked,setClick]=useState(false)
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timeoutSeconds, setTimeoutSeconds] = useState(90);


  const handleInputChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:4500/user/authentication",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      )

      const data = await response.json();
      
      if (data.isRegistered) {
        setAlert("Email Already Registered");
      } else {

        const response = await fetch(
          "http://localhost:4500/otp/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        )
        const data = await response.json()
        setClick(true)
        setIsOtpSent(true)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  
  

  const startTimer = () => {
    setTimeoutSeconds(90);
  };

  useEffect(() => {
    let timer;
    if (isOtpSent && timeoutSeconds > 0) {
      timer = setInterval(() => {
        setTimeoutSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isOtpSent, timeoutSeconds]);

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        "http://localhost:4500/otp/verify",
       {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email,otp }),
      });
      const data = await response.json();
      if (data.isVerified) {
        setAlert("OTP Verified")
        window.location.href = `/`;
      } else {
        setAlert('Invalid OTP')
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }

  };

  return (
    
    <div className="flex items-center justify-center h-screen bg-blue-200">
      {clicked && <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">OTP Verification</h1>

        {!isOtpSent ? (
          <div>
            <input
              type="email"
              placeholder="Enter OTP"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-4">An OTP has been sent to your email. Enter it below:</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Verify OTP
            </button>
            <p className="mt-4 text-gray-500">{`Timeout in ${timeoutSeconds} seconds`}</p>
          </div>
        )}
      </div> }

      {!clicked && <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Register Email</h1>
        {alert && <p className="text-red-500 mb-4">{alert}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email:
            </label>
            <input
              className="border border-gray-300 rounded px-4 py-2 w-full"
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password:
            </label>
            <input
              className="border border-gray-300 rounded px-4 py-2 w-full"
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Verify
          </button>
        </form>
      </div>}
      
    </div>
  );
};

export default page;
