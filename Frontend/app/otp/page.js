'use client'
import { useState, useEffect } from 'react';

const page = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timeoutSeconds, setTimeoutSeconds] = useState(90);

  const handleSendOtp = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsOtpSent(true);
        startTimer();
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setIsLoading(false);
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
    // Perform OTP verification logic
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">OTP Verification</h1>

        {!isOtpSent ? (
          <div>
            <input
              type="email"
              placeholder="Enter email"
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
      </div>
    </div>
  );
};

export default page;
