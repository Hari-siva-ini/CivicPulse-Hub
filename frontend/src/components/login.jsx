import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    pass: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        pass: formData.pass,
      }),
    });
    if (response.ok) {
      const user = await response.json();
      localStorage.setItem("userEmail", user.email); 
      localStorage.setItem("username", user.username); 
      localStorage.setItem("role", user.role);
      navigate("/otpverification ");
    } else {
       const errorText = await response.text();
       document.getElementById("login-error").innerText = errorText;
    }
  } catch (error) {
    console.error("⚠️ Network error:", error);
    // alert("Server not responding");
    console.log(localStorage.getItem("userEmail"));
  }
};
const handlePass = () => {
  navigate("/change");
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <br></br>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="pass"
              placeholder="Enter your password"
              value={formData.pass}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <p className="text-sm text-right mt-2" >
            Forget Password : {" "}
            <a className="text-blue-600 hover:underline" onClick={handlePass}>
              Click here
            </a>
          </p>
          <br></br>
          <div id="login-error" className="text-red-500 text-sm"></div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

          <p className="mt-4 text-center">
            New user?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
