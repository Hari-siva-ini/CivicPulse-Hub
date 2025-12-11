import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const [complaints, setComplaints] = useState([]);
  const [rating, setRating] = useState({});
  const [comment, setComment] = useState({});
  // const [message, setMessage] = useState("");
  const [s,sets] = useState({
    rating: 1,
  });
  const userEmail = localStorage.getItem("userEmail");

  // Load complaints
  useEffect(() => {
    fetch(`http://localhost:8080/api/complaints/user/${userEmail}`)
      .then((res) => res.json())
      .then((data) => setComplaints(data))
      .catch((err) => console.error(err));
  }, []);

  // Feedback submit
  const handleSubmit = async (e, complaintId) => {
  e.preventDefault();

  try {
    const res = await fetch(`http://localhost:8080/api/complaints/${complaintId}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: rating[complaintId],
        comment: comment[complaintId]
      })
    });

    if (!res.ok) throw new Error("Submit failed");

    alert("Thank you! Your feedback has been submitted.");
    setRating((prev) => ({ ...prev, [complaintId]: 0 }));
    setComment((prev) => ({ ...prev, [complaintId]: "" }));
  } catch (error) {
    console.error(error);
    alert("Error submitting feedback.");
  }
};

  const handleResubmit = async (e,id) => {
    e.preventDefault();
     const res = await fetch(`http://localhost:8080/api/complaints/${id}/resubmit`, {
        method: "PUT",
     });
     console.log("Resubmitted:",res);
    // window.location.href = '/dashboard';
  };
  return (
    <div className="w-[100%] mt-16 bg-white  p-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Feedback for Resolved Complaints
      </h2>
    <div className="grid grid-cols-5 gap-1">
  

      {complaints.filter(c => c.status === "Resolved").length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No resolved complaints available for feedback.
        </p>
      ) : (
        complaints
          .filter((c) => c.status === "Resolved" && c.rate==0)
          .map((c) => (
            <div
              key={c.id}
              className="border rounded-lg p-5 mb-1 bg-gray-50 shadow-sm"
            >
               <div className="grid grid-cols-2 gap-1">
                <img
                    src={`data:image/jpeg;base64,${c.imageUrl}`}
                    alt="Proof"
                    className="w-[80%] h-[50%] object-cover"
                  />
                  
                <img
                    src={`data:image/jpeg;base64,${c.submitProff}`}
                    alt="Proof"
                    className="w-[80%] h-[50%] object-cover"
                  /></div>
              <h4 className="text-xl font-semibold text-gray-900 mb-1">
                {c.title}
              </h4>

              {/* Rating Stars */}
              <form onSubmit={(e) => handleSubmit(e, c.id)} className="space-y-4 mb-2">
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span
                      key={num}
                      onClick={() =>
                        setRating((prev) => ({ ...prev, [c.id]: num }))
                      }
                      className={`text-4xl cursor-pointer transition ${
                        num <= (rating[c.id] || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Feedback comment */}
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Write your feedback..."
                  value={comment[c.id] || ""}
                  onChange={(e) =>
                    setComment((prev) => ({ ...prev, [c.id]: e.target.value }))
                  }
                  required
                />

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
                >
                  Submit Feedback
                </button>
                
              </form>
              <button
                  type="submit"
                  className="w-full bg-red-400 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
                    onClick={(e) => handleResubmit(e, c.id)}
                >
                  
                  ReOpen Complaint
                </button>
            </div>
          ))
      )}
    </div>
    </div>
  );
};

export default Feedback;
