import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const [complaints, setComplaints] = useState([]);
  const userEmail = localStorage.getItem("userEmail");
    useEffect(() => {
       if (!userEmail) return;
   
       fetch(`http://localhost:8080/api/complaints/all`)
         .then((res) => {
           if (!res.ok) throw new Error("No complaints found");
           return res.json();
         })
         .then((data) => setComplaints(data))
         .catch((err) => console.error("Error fetching complaints:", err));
     }, [userEmail]);
   
     console.log(complaints);
  return (
    <div className="w-[100%] mt-16 bg-white  p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Feedback for Resolved Complaints
      </h2>
      <div className="grid grid-cols-5 gap-1">
          {complaints
            .filter(
              (c) => c.rate !=0
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
                  <p className="text-gray-700 mt-2 font-bold text-blue-900">Feedback : "{c.feedback}"</p>
                  <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span
                      className={`text-4xl cursor-pointer transition ${
                        num <= (c.rate || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

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
    </div>
  );
};

export default Feedback;
