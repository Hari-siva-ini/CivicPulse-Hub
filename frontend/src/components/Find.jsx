import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell,
  BarChart,Bar, CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer,
  Label,Line,LineChart
} from 'recharts';
import { useNavigate } from "react-router-dom";

const COLORS = ['#008000', '#0000FF', '#FF0000', '#ffbf00e4']; 

const userEmail = localStorage.getItem("userEmail");
function UserDashboard()
 {


  const navigate = useNavigate();
  const [com, setCom] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartDataBYTypes, setChartDataBYTypes] = useState([]);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [lineChartData, setLineChartData] = useState([]);
  const [viewType, setViewType] = useState("month"); 
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [users, setUsers] = useState([]);
  const [Admins, setAdmins] = useState(0);
  const [Off, setOff] = useState(0);
  const [Citizen, setCitizen] = useState(0);
     const handleGet=async()=>{
      if(localStorage.getItem("role")=="Admin"){
         navigate('/feedbackOff');
      }
      else{
        navigate('/feedback');
      }
    }
     const submitFeedback = async (complaintId) => {
            try {
              await fetch(`http://localhost:8080/api/complaints/${complaintId}/feedback`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  rating
                }),
              });
              alert("Thanks for your feedback!");
              setRating(0);
              setFeedback("");
              window.location.reload();
            } catch (err) {
              console.error("Feedback Error:", err);
            }
          };

    useEffect(() => {
        fetch("http://localhost:8080/api/complaints/all")
    .then((res) => res.json())
    .then((data) => {
          setCom(data);
        processChartData(data);
          console.log("Grouped Data:", data);
      });
  
  }, []);
    useEffect(() => {
        fetch("http://localhost:8080/api/users/all")
    .then((res) => res.json())
    .then((data) => {
          setUsers(data);
          // console.log("Grouped Data:", data);
          setAdmins(data.filter((c) => c.role === 'Admin').length)
          setOff(data.filter((c) => c.role === 'off').length)
          setCitizen(data.filter((c) => c.role === 'Citizen').length)
      });
  
  }, []);



  const processChartData = (complaints) => {
    const newChartData = [
      { name: 'Resolved', value: complaints.filter((c) => c.status === 'Resolved').length },
      { name: 'InProgress', value: complaints.filter((c) => c.status === 'In Progress').length},
      { name: 'Pending', value: complaints.filter((c) => c.status === 'Pending').length },
      { name: 'Cancelled', value: complaints.filter((c) => c.status === 'Cancelled').length},].filter(item => item.value > 0); 
    setChartData(newChartData);

     const newChartData1 = [
      { name: 'Sanitation', value: complaints.filter((c) => c.category === 'Sanitation').length },
      { name: 'Public Transport', value: complaints.filter((c) => c.category === 'Public Transport').length },
      { name: 'Water Related', value: complaints.filter((c) => c.category === 'Water Related').length },
      { name: 'Public Health/Medical Emergency', value: complaints.filter((c) => c.category === 'Public Health/Medical Emergency').length },
      { name: 'Electricity Related', value: complaints.filter((c) => c.category === 'Electricity Related').length },
      { name: 'Road Related', value: complaints.filter((c) => c.category === 'Road Related').length },].filter(item => item.value > 0); 
      setChartDataBYTypes(newChartData1);
  }

  const formatDailyKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const processLineChartData = (complaints) => {
  const formatDate = (dateStr) => new Date(dateStr);

  let grouped = {};
    if (viewType === "day") {
    complaints.forEach(c => {
      const d = formatDate(c.submitDate);
      const key = formatDailyKey(d);
      grouped[key] = (grouped[key] || 0) + 1;
    });
  }
  if (viewType === "month") {
    complaints.forEach(c => {
      const d = formatDate(c.submitDate);
      const key = `${d.getMonth() + 1}-${d.getFullYear()}`; 
      grouped[key] = (grouped[key] || 0) + 1;
    });
  }

  if (viewType === "week") {
    complaints.forEach(c => {
      const d = formatDate(c.submitDate);
      const onejan = new Date(d.getFullYear(), 0, 1);
      const week = Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
      const key = `W${week}-${d.getFullYear()}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });
  }

  if (viewType === "year") {
    complaints.forEach(c => {
      const d = formatDate(c.submitDate);
      const key = d.getFullYear().toString();
      grouped[key] = (grouped[key] || 0) + 1;
    });
  }

  const result = Object.keys(grouped).map(key => ({
    date: key,
    count: grouped[key],
  }));

  setLineChartData(result);
};

useEffect(() => {
  if (com.length > 0) {
    processLineChartData(com);
  }
}, [viewType, com]);


    const getStatusCount = (statusName) => {
    const item = chartData.find(item => item.name === statusName);
    return item ? item.value : 0;
  }

  const renderCustomLabel = ({ name, percent,x,y }) => (
   ` ${name}: ${(percent * 100).toFixed(0)}% `
 
);
const handleFeedback = () => navigate("/feedbackOff");
const handleFind = () => navigate("/find");
  return (
    <>
            <div className=" gap-1  bg-white rounded-lg p-2 m-3 mt-32 shadow-md">
        <h1 className="text-xl text-bold">Users Details</h1>
           
                <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> 
           
    </div>
      </>
  );
}

export default UserDashboard;