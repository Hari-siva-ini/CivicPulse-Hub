import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ComplaintForm = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    email: userEmail,
    submitDate: "",
    image: null,
    zone: "",
  });
  const handleChange = (e) => {
    
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    const updatedData = { ...formData, submitDate: today };
    const form = new FormData();
    for (const key in updatedData) {
      form.append(key, updatedData[key]);
    }
    try {
      const res = await fetch("http://localhost:8080/api/complaints/add", {
        method: "POST",
        body: form,
      });
      
      const msg = await res.text();
      alert(msg);
    } catch (err) {
      console.error("⚠️ Error:", err);
      alert("Server not responding");
    }
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: "500px", padding: "20px", border: "1px solid #110f0fff", borderRadius: "10px" }}
    className="bg-white ml-[35%] mt-[7%] rounded-2xl shadow-lg ">
      <h1 className="text-2xl font-bold text-center mb-5 text-blue-600">Submit a Grievance</h1>
      <br></br>
      <form onSubmit={handleSubmit} className="rounded-lg space-y-5" >
       <div className="grid grid-cols-2 gap-4 rounded-lg">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Complaint Title:</label>
              <input
                type="text"
                name="title"
                placeholder="Complaint Title"
                className="h-10 w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                required
              />
            </div>

            <div>
                  <label className="block mb-1 font-semibold text-gray-700">Category:</label>
                  <select 
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={formData.category}
                        onChange={handleChange}
                        name = "category"
                        required>
                        <option value="">Select the Problem</option>
                        <option value="Water Related"  >Water Related</option>
                        <option value="Electricity Related">Electricity Related</option>
                        <option value="Road Related" >Road Related</option>
                        <option value="Sanitation" >Sanitation</option>
                        <option value="Public Transport" >Public Transport</option>
                        <option value="Public Health/Medical Emergency" >Public Health/Medical Emergency</option>
                </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Location:</label>
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="h-10 w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                required
              />
            </div>
            <div>
                  <label className="block mb-1 font-semibold text-gray-700">Zone:</label>
                  <select 
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={formData.zone}
                        onChange={handleChange}
                        name = "zone"
                        required>
                        <option value="">Select a Zone</option>
                        <option value="North"  >North</option>
                        <option value="South">South</option>
                        <option value="West" >West</option>
                        <option value="East" >East</option>
                </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">Upload Image:</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 font-semibold text-gray-700">Description:</label>
              <textarea
                name="description"
                placeholder="Description"
                className="w-full h-32 border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-2">
               {formData.image && (
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Proof Preview"
                          className="w-[70%] h-30 object-cover rounded-lg border border-gray-300"
                          onLoad={(e) => URL.revokeObjectURL(e.target.src)} 
                        />
              )}
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Submit Complaint
              </button>
            </div>
        </div>
       
      </form>
      <br />
      <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-blue-700 transition" onClick={() => navigate('/')}>
      Go Back</button>
    </div>
  );
};

export default ComplaintForm;
