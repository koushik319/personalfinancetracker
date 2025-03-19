import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

const DashBoard = () => {
  const UserId = localStorage.getItem("UserId");
  const accessToken = localStorage.getItem("accessToken");
  const [user, setUser] = useState({
    UserId: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailId: "",
    password: "",
  });
  const { firstName, lastName, phoneNumber, emailId } = user;

  const loadUserDetails = async () => {
    const result = await axios.get(`http://localhost:5122/api/Users/${UserId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    setUser(result.data);

  }; 

  useEffect(() => {
    loadUserDetails();
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg p-4 rounded-3">
            <div className="card-body text-center">
              <h1 className="display-5 mb-3 text-primary">Dashboard</h1>
              <h4 className="mb-3">Welcome, {firstName} {lastName}!</h4>
              <p className="mb-1"><strong>Phone:</strong> {phoneNumber}</p>
              <p className="mb-3"><strong>Email:</strong> {emailId}</p>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <NavLink className="btn btn-primary" to="/expenses">
                  Add Expense
                </NavLink>
                <NavLink className="btn btn-success" to="/expenselist">
                  Expenses List
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
