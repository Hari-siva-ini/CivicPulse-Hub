import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";

const COLORS = ["#008000", "#0000FF", "#FF0000", "#72ff35"];

function OfficerDashboard() {
  const navigate = useNavigate();
  const [com, setCom] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartDataBYTypes, setChartDataBYTypes] = useState([]);
  const [zoneChartData, setZoneChartData] = useState([]);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) return;

    fetch(`http://localhost:8080/api/complaints/user/off/${userEmail}`)
      .then((res) => {
        if (!res.ok) throw new Error("No complaints found");
        return res.json();
      })
      .then((data) => {
        setCom(data);
        processChartData(data);
      })
      .catch((err) => console.error("Error fetching complaints:", err));
  }, [userEmail]);

  const processChartData = (complaints) => {
    const statusCounts = [
      { name: "Resolved", value: complaints.filter((c) => c.status === "Resolved").length },
      { name: "In Progress", value: complaints.filter((c) => c.status === "In Progress").length },
      { name: "Pending", value: complaints.filter((c) => c.status === "Pending").length },
      { name: "Cancelled", value: complaints.filter((c) => c.status === "Cancelled").length }
    ].filter((item) => item.value > 0);

    const typeCounts = [
      { name: "Sanitation", value: complaints.filter((c) => c.category === "Sanitation").length },
      { name: "Public Transport", value: complaints.filter((c) => c.category === "Public Transport").length },
      { name: "Water Related", value: complaints.filter((c) => c.category === "Water Related").length },
      { name: "Public Health/Medical Emergency", value: complaints.filter((c) => c.category === "Public Health/Medical Emergency").length },
      { name: "Electricity Related", value: complaints.filter((c) => c.category === "Electricity Related").length },
      { name: "Road Related", value: complaints.filter((c) => c.category === "Road Related").length }
    ].filter((item) => item.value > 0);
    const zones = {};

  complaints.forEach(c => {
    if (!c.zone) return;              
    zones[c.zone] = (zones[c.zone] || 0) + 1;
  });
  console.log(complaints);
  const zoneData = Object.keys(zones).map(zone => ({
    name: zone,
    value: zones[zone],
  }));

    setZoneChartData(zoneData);
    setChartData(statusCounts);
    setChartDataBYTypes(typeCounts);
  };

  const renderLabel = ({ name, percent }) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  const handleFeedback = () => navigate("/feedbackOff");

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">

      {/* Top grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Complaint Types Pie Chart */}
        <div className="bg-white border rounded-xl p-5 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Complaint Types Overview
          </h2>
          <div className="w-full h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartDataBYTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  dataKey="value"
                  label={renderLabel}
                  labelLine={false}
                >
                  {chartDataBYTypes.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint Status Bar Chart */}
        <div className="bg-white border rounded-xl p-5 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Complaint Status Chart
          </h2>
          <div className="w-full h-56">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" barSize={50}>
                  {chartData.map((e, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Complaints */}
        <div className="grid grid-cols-2 bg-white border rounded-xl p-5 shadow-lg flex flex-col justify-center items-center">
            <div className="border p-4 rounded text-center">
            <h1 className="text-xl font-semibold">Complaints</h1>
            <p className="text-3xl text-red-600 font-bold">{com.length}</p>
          </div>

          <div className="border p-4 rounded text-center">
            <h1 className="text-xl font-semibold">This Week</h1>
            <p className="text-3xl text-red-600 font-bold">{com.length}</p>
          </div>

          <div
            className="border p-4 rounded text-center cursor-pointer"
          ><button
            onClick={handleFeedback}
            className="text-xl font-semibold"
          >
            Check Resolved Grievances
          </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-12">
        {/* Placeholder clean card */}
        <div className="bg-white border rounded-xl p-5 shadow-lg">
              <h1 className="text-2xl font-bold mb-2 font-sans text-gray-800">Zone-wise Complaints</h1>

              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={zoneChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={70}
                    labelLine={false}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      ` ${name}: ${(percent * 100).toFixed(0)}% `
                    }
                  >
                    {zoneChartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
        </div>

        {/* Feedback Section */}
        <div className="bg-white border rounded-xl p-5 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            View Feedback
          </h2>
          
        </div>
      </div>
    </div>
  );
}

export default OfficerDashboard;
