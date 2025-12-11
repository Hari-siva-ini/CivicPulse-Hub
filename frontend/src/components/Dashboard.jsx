import React from "react";
import UserDashboard from "./UserDashboard";
import OfficerDashboard from "./OfficerDashboard";
import AdminDashboard from "./AdminDashboard"

function Dashboard() {
  const role = localStorage.getItem("role"); // Or props / API / context

  return (
    <>
      {role === "off" ? <OfficerDashboard/> : (role === "Admin" ? <AdminDashboard/> : <UserDashboard/> )}
    </>
  );
}

export default Dashboard;
