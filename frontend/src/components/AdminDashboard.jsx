import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineChartIcon,
} from "lucide-react";

const COLORS = ["#008000", "#0000FF", "#FF0000", "#ffbf00e4"];
const userEmail = localStorage.getItem("userEmail");

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [com, setCom] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartDataBYTypes, setChartDataBYTypes] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [viewType, setViewType] = useState("week");
  const [week, setWeek] = useState(0);
  const [month, setMonth] = useState(0);
  const [users, setUsers] = useState([]);

  const [Admins, setAdmins] = useState(0);
  const [Off, setOff] = useState(0);
  const [Citizen, setCitizen] = useState(0);

  const handleFind = () => navigate("/find");

  // Fetch complaints
  useEffect(() => {
    fetch("http://localhost:8080/api/complaints/all")
      .then((res) => res.json())
      .then((data) => {
        setCom(data);
        processChartData(data);
      });
  }, []);

  // Fetch users
  useEffect(() => {
    fetch("http://localhost:8080/api/users/all")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setAdmins(data.filter((c) => c.role === "Admin").length);
        setOff(data.filter((c) => c.role === "off").length);
        setCitizen(data.filter((c) => c.role === "Citizen").length);
      });
  }, []);

  const processChartData = (complaints) => {
    const newChartData = [
      {
        name: "Resolved",
        value: complaints.filter((c) => c.status === "Resolved").length,
      },
      {
        name: "InProgress",
        value: complaints.filter((c) => c.status === "In Progress").length,
      },
      {
        name: "Pending",
        value: complaints.filter((c) => c.status === "Pending").length,
      },
      {
        name: "Cancelled",
        value: complaints.filter((c) => c.status === "Cancelled").length,
      },
    ].filter((item) => item.value > 0);

    setChartData(newChartData);

    const newChartData1 = [
      {
        name: "Sanitation",
        value: complaints.filter((c) => c.category === "Sanitation").length,
      },
      {
        name: "Public Transport",
        value: complaints.filter((c) => c.category === "Public Transport").length,
      },
      {
        name: "Water Related",
        value: complaints.filter((c) => c.category === "Water Related").length,
      },
      {
        name: "Public Health/Medical Emergency",
        value: complaints.filter(
          (c) => c.category === "Public Health/Medical Emergency"
        ).length,
      },
      {
        name: "Electricity Related",
        value: complaints.filter((c) => c.category === "Electricity Related")
          .length,
      },
      {
        name: "Road Related",
        value: complaints.filter((c) => c.category === "Road Related").length,
      },
    ].filter((item) => item.value > 0);

    setChartDataBYTypes(newChartData1);
  };

  const processLineChartData = (complaints) => {
    const grouped = {};
    const formatDate = (d) => new Date(d);

    complaints.forEach((c) => {
      const d = formatDate(c.submitDate);
      let key = "";

      if (viewType === "day") key = d.toISOString().split("T")[0];
      if (viewType === "month") key = `${d.getMonth() + 1}-${d.getFullYear()}`;
      if (viewType === "year") key = d.getFullYear().toString();

      if (viewType === "week") {
        const onejan = new Date(d.getFullYear(), 0, 1);
        const week = Math.ceil(
          ((d - onejan) / 86400000 + onejan.getDay() + 1) / 7
        );
        key = `W${week}-${d.getFullYear()}`;
      }

      grouped[key] = (grouped[key] || 0) + 1;
    });

    const result = Object.keys(grouped).map((key) => ({
      date: key,
      count: grouped[key],
    }));

    setLineChartData(result);
  };

  useEffect(() => {
    if (com.length > 0) processLineChartData(com);
  }, [viewType, com]);

  const renderCustomLabel = ({ name, percent }) =>
    ` ${name}: ${(percent * 100).toFixed(0)}% `;

  useEffect(() => {
  const last = lineChartData?.[lineChartData.length - 1];
  if (last && viewType === "week") {
    setWeek(last.count);
  }
}, [lineChartData]);
  useEffect(() => {
  const last = lineChartData?.[lineChartData.length - 1];
  if (last && viewType === "month") {
    setMonth(last.count);
  }
}, [lineChartData]);

  return (
    <div className="p-6 bg-gradient-to-br from-violet-100 mt-16 to-indigo-200 min-h-screen">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <motion.div whileHover={{ scale: 1.02 }}>
          <div className="bg-white rounded-2xl shadow-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <PieIcon />
              <h2 className="text-xl font-bold">Complaint Types</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartDataBYTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                  label={renderCustomLabel}
                >
                  {chartDataBYTypes.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <div className="bg-white rounded-2xl shadow-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 />
              <h2 className="text-xl font-bold">Complaint Status</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
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
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">Complaints Overview</h2>

            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-gray-100 rounded-xl">
                <span className="font-semibold">Total Complaints</span>
                <span className="text-red-600 font-bold text-xl">{com.length}</span>
              </div>

              <div className="flex justify-between p-3 bg-gray-100 rounded-xl">
                <span className="font-semibold">This Week</span>
                <span className="text-blue-600 font-bold text-xl">{week}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-100 rounded-xl">
                <span className="font-semibold">This Month</span>
                <span className="text-blue-600 font-bold text-xl">{month}</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        <motion.div whileHover={{ scale: 1.02 }}>
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <LineChartIcon />
                <h2 className="text-xl font-bold">Complaint Trends</h2>
              </div>

              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="border p-2 rounded-lg"
              >
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
                <option value="day">Daily</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4b0082"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <div className="bg-white rounded-2xl shadow-xl p-6 pb-16" >
            <div className="flex items-center gap-2">
              <Users />
              <h2 className="text-xl font-bold">User Statistics</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Users", value: Admins + Off + Citizen, action: handleFind },
                { label: "Total Admins", value: Admins },
                { label: "Total Officers", value: Off },
                { label: "Total Citizens", value: Citizen },
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={item.action}
                  className="p-4 bg-gray-100 rounded-xl shadow-inner cursor-pointer hover:bg-gray-200 transition"
                >
                  <h3 className="font-semibold text-lg">{item.label}</h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
