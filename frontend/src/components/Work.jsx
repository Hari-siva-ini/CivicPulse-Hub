import React, { useState, useEffect } from "react";

function Work() {
  const [complaint, setComplaint] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [deadline, setDeadline] = useState("");

  // Fetch complaints
  useEffect(() => {
    fetch("http://localhost:8080/api/complaints/all")
      .then((res) => res.json())
      .then((data) => setComplaint(data))
      .catch((err) => console.error("❌ Error fetching complaints:", err));
  }, []);

  // Fetch officers
  useEffect(() => {
    fetch("http://localhost:8080/api/user/off")
      .then((res) => res.json())
      .then((data) => setOfficers(data))
      .catch((err) => console.error("❌ Error fetching officers:", err));
  }, []);

  const handleCancel = async (id) => {
    await fetch(`http://localhost:8080/api/complaints/${id}/cancel`, {
      method: "PUT",
    });
  };

  const handleSubmit = async (id) => {
    const res = await fetch(`http://localhost:8080/api/complaints/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deadline, officer: selectedOfficer }),
    });

    if (!res.ok) {
      console.error("❌ Error assigning complaint:", res.statusText);
    }
  };

  // Badge color logic
  const getStatusClasses = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-10 pt-32">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
         Complaint Assignment Panel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {complaint.map((c) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200"
          >
            {/* Heading */}
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                {c.title}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(
                  c.status
                )}`}
              >
                {c.status}
              </span>
            </div>

            {/* Info Section */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-gray-700 text-sm">
              <p>
                <span className="font-semibold text-gray-900">Email:</span>{" "}
                {c.email}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Location:</span>{" "}
                {c.location}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Category:</span>{" "}
                {c.category}
              </p>
              <p className="col-span-2">
                <span className="font-semibold text-gray-900">Description:</span>{" "}
                {c.description}
              </p>
            </div>

            {/* Assignment Options */}
            <div className="mt-6 flex flex-col gap-4">
              <select
                className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSelectedOfficer(e.target.value)}
              >
                <option value="">Assign Officer</option>
                {officers.map((off) => (
                  <option key={off.email} value={off.email}>
                    {off.username}
                  </option>
                ))}
              </select>

              <input
                type="date"
                onChange={(e) => setDeadline(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Buttons */}
            {c.rate === 0 && (
              <div className="flex justify-end mt-6 gap-4">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
                  onClick={() => handleCancel(c.id)}
                >
                  Cancel
                </button>

                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
                  onClick={() => handleSubmit(c.id)}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Work;
