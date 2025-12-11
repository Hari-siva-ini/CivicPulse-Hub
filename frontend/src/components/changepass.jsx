import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/users/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass }),
      });

      const text = await res.text();
      setMsg(text);

      if (res.ok) {
        localStorage.removeItem("resetEmail");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setMsg("Server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-6 text-blue-600">Change Password</h2>

        <form onSubmit={handleChange}>
          <label className="block text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded-lg"
            placeholder="Enter new password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>

        <p className="mt-3 text-center text-green-600">{msg}</p>
      </div>
    </div>
  );
}

export default ChangePassword;
