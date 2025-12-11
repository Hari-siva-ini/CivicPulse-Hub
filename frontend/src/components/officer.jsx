import React, { useEffect, useState } from "react";

function Officer() {
  const userEmail = localStorage.getItem("userEmail");
  const [complaints, setComplaints] = useState([]);
  const [proofFile, setProofFile] = useState({}); // store files separately for each complaint

  // Fetch complaints assigned to officer
  useEffect(() => {
    fetch(`http://localhost:8080/api/complaints/user/off/${userEmail}`)
      .then((res) => res.json())
      .then((data) => setComplaints(data))
      .catch((err) => console.error(err));
  }, [userEmail]);

  // Track proof file change
  const handleProofUpload = (id, file) => {
    setProofFile((prev) => ({ ...prev, [id]: file }));
  };

  // Resolve complaint
  const handleResolve = async (id) => {
    if (!proofFile[id]) {
      alert("⚠ Please upload proof before resolving.");
      return;
    }

    const form = new FormData();
    form.append("status", "Resolved");
    form.append("proof", proofFile[id]);

    try {
      const res = await fetch(
        `http://localhost:8080/api/complaints/${id}/status/resolved`,
        {
          method: "POST",
          body: form,
        }
      );

      if (res.ok) {
        alert("Complaint Resolved Successfully!");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to resolve complaint");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 pt-28">
      <h1 className="text-3xl font-bold mb-6">Officer Dashboard</h1>

      {complaints.length === 0 ? (
        <p className="text-center text-gray-600">No complaints assigned.</p>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {complaints.map((c) =>
            c.status === "Resolved" ? null : (
              <div
                key={c.id}
                className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition w-72"
              >
                {c.imageUrl ? (
                  <img
                    src={`data:image/jpeg;base64,${c.imageUrl}`}
                    alt="Uploaded"
                    className="h-36 w-full object-cover rounded-md"
                  />
                ) : (
                  <div className="h-36 bg-gray-300 flex justify-center items-center rounded-md">
                    No Image
                  </div>
                )}

                <h3 className="font-bold text-lg mt-3">{c.title}</h3>
                <p className="text-gray-600 text-sm">{c.category}</p>
                <p className="text-gray-600 text-sm">{c.location}</p>
                <p className="text-gray-700 mt-2 text-sm">{c.description}</p>

                <span className="mt-3 inline-block bg-orange-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {c.status}
                </span>

                {/* Upload Proof */}
                <label className="block mt-3 font-semibold text-gray-700 text-sm">
                  Upload Proof:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full mt-1 border border-gray-300 rounded-md px-2 py-1"
                  onChange={(e) => handleProofUpload(c.id, e.target.files[0])}
                />

                <button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                  onClick={() => handleResolve(c.id)}
                >
                  Resolve Complaint
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Officer;
