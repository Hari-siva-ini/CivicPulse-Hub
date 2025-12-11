import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedName) {
      setUsername(storedName);
    } else if (storedEmail) {
      setUsername(storedEmail); 
    } else {
      // navigate("/signin"); 
    }
  }, [navigate]);

  const handleLogout = () => 
  {
    localStorage.clear(); 
    navigate("/");
  };
  const handleRegister = () => {navigate("/signup")};
  const handleComplaints = () => navigate("/complaints");
  const handleTracking = () => navigate("/complaintList");
  const handleAssign = () => navigate("/work");
  const handleWork = () => navigate("/officerwork");
  const handleFeedback = () => navigate("/feedbackOff");
  const handleBack = () => navigate("/dashboard");
  return (
    <div>
      <header className="w-full bg-blue-600 text-white py-5 px-8  flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Smart City Dashboard -  {localStorage.getItem("role")}</h1>

        <div className="flex gap-2">
          {localStorage.length>1 && <button 
            onClick={handleLogout}
            className="bg-white text-blue-600 font-semibold px-2 py-2 rounded-lg hover:bg-gray-100 transition"
            >
            Logout
          </button>}
          <button
            onClick={handleRegister}
            className="bg-white text-blue-600 font-semibold px-2 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Register
          </button>
          <button
            onClick={handleBack}
            className="bg-white text-blue-600 font-semibold px-2 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Dashboard
          </button>
          {localStorage.getItem('role')=='Citizen'&&<button
            onClick={handleComplaints}
            className="bg-white text-blue-600 font-semibold px-2 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Complaints
          </button>}
          {localStorage.getItem('role')=='Citizen'&&<button
            onClick={handleTracking}
            className="bg-white text-blue-600 font-semibold px-2 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Track Issues
          </button>}
          {localStorage.getItem('role')=='Admin'&&<button
            onClick={handleAssign}
            className="bg-white text-blue-600 font-semibold px-2 py-2 rounded-lg hover:bg-gray-100 transition"
          >
             Assign Work
          </button>}
          {localStorage.getItem('role')=='off'&&<button
            onClick={handleWork}
            className="bg-white text-blue-600 font-semibold px-2 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Check Work
          </button>}
          {localStorage.getItem('role')=='off'&&<button
            onClick={handleFeedback}
            className="bg-white text-blue-600 font-semibold px-2 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Feedback
          </button>}
        </div>
      </header>
    </div>
  );
}

export default Dashboard;
