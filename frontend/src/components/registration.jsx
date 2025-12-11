import React,{useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register(){
  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    email:"",
    pass:"",
    username:"",
    mobileNo:"",
    role:""
});
const user = {
    username: formData.username,
    pass: formData.pass,
    email: formData.email,
    mobileNo: formData.mobileNo,
    role:formData.role
};
const handleChange = (e) => {
  const { name,value } = e.target;
  setFormData({
    ...formData,
    [name]:value, 
  });
};      

const handleSubmit = async(e) =>{
    e.preventDefault();
    try{
        const response = await fetch("http://localhost:8080/api/users/reg", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        });
        const result = await response.text();
        if(result == "Already Existing User"){
          document.getElementById('already').innerHTML = result;
          navigate('/signup');
        } else if (response.ok ) {
          navigate('/');
        } else {
          const errorText = await response.text();
          console.error("❌ Server error:", response.status, errorText);
        }
    }
    catch(error){
        console.log("err");
    }
};
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Registration Form
        </h2>

        <form  onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div id="already" className="text-red-500 text-sm"></div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="pass"
              placeholder="Enter your password"
              value={formData.pass}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mobile No</label>
            <input
              type="text"
              name="mobileNo"
              placeholder="Enter your mobile number"
              value={formData.mobileNo}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Role of The Person</label>
            <select 
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.role}
               onChange={handleChange}
               name = "role"
              placeholder="Enter your Role"
              required>
              <option value=""></option>
              <option value="Citizen"  >Citizen</option>
              <option value="Admin"  >Admin</option>
              <option value="off" >Officer</option>
            </select>

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
          <br></br>
          <br></br>
         Already Registered? <a href="/signin" className="text-blue-600 hover:underline">Login Here</a>
        </form>
      </div>
    </div>
  );
}

export default Register;