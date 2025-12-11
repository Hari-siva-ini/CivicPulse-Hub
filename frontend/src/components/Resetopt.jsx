import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetOTP() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:8080/api/users/verify-otp?email=${email}&otp=${otp}`,
        { method: "POST" }
      );

      const text = await res.text();
      setMsg(text);

      if (res.ok) {
        navigate("/change-password");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-6 text-blue-600">OTP Verification</h2>

        <form onSubmit={handleVerify}>
          <label className="block text-gray-700 mb-1">Enter OTP</label>
          <input
            className="w-full border border-gray-300 p-2 rounded-lg"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Verify OTP
          </button>
        </form>

        <p className="mt-3 text-center text-red-600">{msg}</p>
      </div>
    </div>
  );
}

export default ResetOTP;
