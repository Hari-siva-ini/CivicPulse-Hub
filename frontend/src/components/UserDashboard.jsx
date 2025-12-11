import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer,
  Line, LineChart
} from "recharts";
import { useNavigate } from "react-router-dom";

const COLORS = ["#008000", "#0000FF", "#ffbf00e4", "#FF0000"];

const UserDashboard = () => {
  const navigate = useNavigate();

  // State
  const [complaints, setComplaints] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartTypeData, setChartTypeData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [viewType, setViewType] = useState("week");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [week, setWeek] = useState(0);

  const userEmail = localStorage.getItem("userEmail");

  // ⭐ FETCH COMPLAINTS
  useEffect(() => {
    if (!userEmail) {
      console.error("User email not found in localStorage.");
      return;
    }

    fetch(`http://localhost:8080/api/complaints/user/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data);
        processChartData(data);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  // ⭐ PROCESS PIE + BAR CHART DATA
  const processChartData = (data) => {
    const statusData = [
      { name: "Resolved", value: data.filter((c) => c.status === "Resolved").length },
      { name: "In Progress", value: data.filter((c) => c.status === "In Progress").length },
      { name: "Pending", value: data.filter((c) => c.status === "Pending").length },
      { name: "Cancelled", value: data.filter((c) => c.status === "Cancelled").length },
    ].filter((item) => item.value > 0);

    const typeData = [
      "Sanitation",
      "Public Transport",
      "Water Related",
      "Public Health/Medical Emergency",
      "Electricity Related",
      "Road Related"
    ].map((cat) => ({
      name: cat,
      value: data.filter((c) => c.category === cat).length
    })).filter((item) => item.value > 0);

    setChartData(statusData);
    setChartTypeData(typeData);
  };

  // ⭐ PROCESS LINE CHART DATA
  const processLineChartData = () => {
    let grouped = {};
    
    const format = (dateStr) => new Date(dateStr);

    complaints.forEach((c) => {
      const date = format(c.submitDate);

      let key = "";

      if (viewType === "month") {
        key = `${date.getMonth() + 1}-${date.getFullYear()}`;
      } else if (viewType === "week") {
        const onejan = new Date(date.getFullYear(), 0, 1);
        const week = Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
        key = `W${week}-${date.getFullYear()}`;
      } else {
        key = `${date.getFullYear()}`;
      }
      grouped[key] = (grouped[key] || 0) + 1;
    });

    const result = Object.keys(grouped).map((key) => ({
      date: key,
      count: grouped[key]
    }));

    setLineChartData(result);
  };

  useEffect(() => {
    if (complaints.length > 0) processLineChartData();
  }, [viewType, complaints]);

   useEffect(() => {
  const last = lineChartData?.[lineChartData.length - 1];
  if (last && viewType === "week") {
    setWeek(last.count);
  }
}, [lineChartData]);

  const sendMessage = async () => {
    if (!input.trim()) return alert("Type something...");

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { from: "user", text: input },
        { from: "ai", text: data.response }
      ]);

      setInput("");
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  // ⭐ LABEL FOR PIE CHART
  const renderPieLabel = ({ name, percent }) =>
    `${name}: ${(percent * 100).toFixed(0)}%`;

  return (
    <>
      {/* ---------- TOP GRID ---------- */}
      <div className="grid grid-cols-3 pt-20 px-5 gap-4 bg-violet-200">
        {/* Complaint Types Pie Chart */}
        <div className="border bg-white rounded-lg p-4 m-3 shadow">
          <h1 className="text-2xl font-bold mb-3">Complaint Types</h1>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={chartTypeData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={75}
                dataKey="value"
                label={renderPieLabel}
                labelLine={false}
              >
                {chartTypeData.map((e, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Complaint Status Bar Chart */}
        <div className="border bg-white rounded-lg p-4 m-3 shadow">
          <h1 className="text-2xl font-bold mb-3">Complaint Status</h1>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" barSize={45}>
                {chartData.map((e, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Small Cards */}
        <div className="grid grid-cols-2 gap-3 border bg-white rounded-lg p-4 m-3 shadow">
          <div className="border p-4 rounded text-center">
            <h1 className="text-xl font-semibold">Complaints</h1>
            <p className="text-3xl text-red-600 font-bold">{complaints.length}</p>
          </div>

          <div
            className="border p-4 rounded text-center cursor-pointer"
            onClick={() =>
              localStorage.getItem("role") === "Admin"
                ? navigate("/feedbackOff")
                : navigate("/feedback")
            }
          >
            <h1 className="text-xl font-semibold">Feedback</h1>
          </div>

          <div className="border p-4 rounded text-center">
            <h1 className="text-xl font-semibold">This Week</h1>
            <p className="text-3xl text-red-600 font-bold">{week}</p>
          </div>

          <div
            className="border p-4 rounded text-center cursor-pointer"
            onClick={() => navigate("/feedbackOff")}
          >
            <h1 className="text-xl font-semibold">Ratings</h1>
          </div>
        </div>
      </div>

      {/* ---------- BOTTOM GRID ---------- */}
      <div className="grid grid-cols-2 px-5 pb-10 bg-violet-200 gap-4">
        {/* Line Chart */}
        <div className="border bg-white rounded-lg p-5 m-5 shadow">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Complaints Trend</h1>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="month">Monthly</option>
              <option value="week">Weekly</option>
              <option value="year">Yearly</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#0074D9" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CHATBOT */}
        <div className="border bg-white rounded-lg p-4 m-5 shadow">
          <h2 className="text-xl font-bold mb-3">AI Chatbot</h2>

          <div className="h-64 overflow-y-auto border rounded p-3">
            {messages.map((msg, i) => (
              <div key={i} className={`my-2 ${msg.from === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg text-sm ${
                    msg.from === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg p-2"
              placeholder="Ask something..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
