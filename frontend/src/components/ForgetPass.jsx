import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPasst, setNewPasst] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  // -------------------------
  // STEP 1 → SEND OTP
  // -------------------------
  const handleSendOtp = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/users/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const text = await res.text();
    setMessage(text);

    if (res.ok) setStep(2); // Go to OTP page
  };

  // -------------------------
  // STEP 2 → VERIFY OTP
  // -------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:8080/api/users/verify-otp?email=${email}&otp=${otp}`,
      { method: "POST" }
    );

    const text = await res.text();
    setMessage(text);

    if (res.ok) setStep(3); 
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
 
    if(newPass!=newPasst){console.log("Error");}
    const res = await fetch("http://localhost:8080/api/users/change-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pass: newPass }),
    });

    const text = await res.text();
    setMessage(text);

    if (res.ok) {
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPass("");
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 transition-all">

        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Forgot Password
        </h2>

       
          <form onSubmit={handleSendOtp}>
            <label className="block text-gray-700 mb-2">Enter Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Send OTP
            </button>
          </form>

          <br></br>
        {step >1 && (
          <form onSubmit={handleVerifyOtp}>
            <label className="block text-gray-700 mb-2">Enter OTP</label>
            <input
              type="text"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter the OTP sent to your email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Verify OTP
            </button>

            {step==2 &&(<button
              type="button"
              className="mt-2 w-full text-blue-600 underline"
              onClick={handleSendOtp}
            >
              Resend OTP
            </button>)}
          </form>
        )}
        <br></br>

        {step === 3 && (
          <form onSubmit={handleChangePassword}>
            <label className="block text-gray-700 mb-2">Enter New Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="New password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              />
              <br></br>
              <br></br>
            <input
              type="password"
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm password"
              value={newPasst}
              onChange={(e) => setNewPasst(e.target.value)}
              required
            />

            <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
              Change Password
            </button>
          </form>
        )}

        {/* Message Output */}
        <p className="text-center mt-4 text-gray-700">{message}</p>
      </div>
    </div>
  );
}

export default ForgetPassword;
