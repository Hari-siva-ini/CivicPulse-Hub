import React, { useEffect, useState } from "react";

const ComplaintList = ({ userEmail }) => {
  const [complaints, setComplaints] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const COLORS = ['#008000', '#0000FF', '#ffbf00e4','#FF0000']; 


  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    fetch(`http://localhost:8080/api/complaints/user/${userEmail}`)
      .then((res) => {
        if (!res.ok) throw new Error("No complaints found");
        return res.json();
      })
      .then((data) => setComplaints(data))
      .catch((err) => console.error("Error fetching complaints:", err));
  }, [userEmail]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
        🏙️ Your Complaints
      </h2>

      {/* Filter Dropdown */}
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="mb-6 p-2 border border-gray-300 rounded-md"
      >
        <option value="All">All</option>
        <option value="In Progress">In Progress</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Pending">Pending</option>
        <option value="Resolved">Resolved</option>
      </select>

      {complaints.length === 0 ? (
        <p className="text-center text-gray-600">No complaints found.</p>
      ) : (
        <div className="grid grid-cols-5 gap-5">
          {complaints
            .filter(
              (c) => categoryFilter === "All" || c.status === categoryFilter
            )
            .map((c) => (
              <div
                key={c.id}
                className="flex flex-col items-center bg-white w-[10] p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Grievance Status
                </h3>

                {c.imageUrl ? (
                  <img
                    src={`data:image/jpeg;base64,${c.imageUrl}`}
                    alt="Proof"
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-600">
                    No Image
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {c.title}
                  </h3>
                  <p className="text-gray-600 mb-1">{c.category}</p>
                  <p className="text-gray-600 mb-1">{c.location}</p>
                  <p className="text-gray-700 mt-2">{c.description}</p>
                </div>

                {/* Status Tracker */}
               
                <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                c.status === "In Progress"
                  ? "bg-green-100 text-blue-800"
                  : c.status === "Resolved"
                  ? "bg-green-400 text-green-800"
                  : c.status === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : c.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  :"bg-black"
              }`}
            >
              {c.status}
            </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
