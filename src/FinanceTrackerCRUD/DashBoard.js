import React, { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const DashBoard = () => {
  const UserId = localStorage.getItem("UserId");
  const accessToken = localStorage.getItem("accessToken");
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState({
    UserId: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailId: "",
    password: "",
  });
  const { id, firstName, lastName, phoneNumber, emailId, password } =
    user;

  const loadUserDetails = async () => {
    
    const result = await axios.get(`http://localhost:5122/api/Users/${UserId}`,
      {
          headers :{
           ' Authorization' :`Bearer ${accessToken}`
          }
    });
    setUser(result.data);
    const response = await axios.get(`http://localhost:5122/api/Expenses/GetSkillByUserId/${UserId}`,{
      headers :{
       ' Authorization' :`Bearer ${accessToken}`
      }
});
    setExpenses(response.data);
  };
  const deleteExpense = async (id) => {
    try {
      console.log(id);
      const response = await axios.delete(`http://localhost:5122/api/Expenses/${id}`,{
        headers :{
         ' Authorization' :`Bearer ${accessToken}`
        }
  });
      alert("deleted successfully!!");
    } catch (error) {
      alert("delete failed!!");
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, []);

  return (
    <div>
      <div className="mt-4 p-5   rounded">
        <h1>DashBoard</h1>
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Welcome user</h4>
            <p className="card-text">{firstName}</p>
            <p className="card-text">{lastName}</p>
            <p className="card-text">{phoneNumber}</p>
            <p className="card-text">{emailId}</p>
            {/* <NavLink className="card-link" to={`/update/${id}`}>
              Update Details
            </NavLink> */}
            <NavLink className="card-link" to={`/expenses`}>
              Add Expense
            </NavLink>
            <NavLink className="card-link" to={`/expenselist`}>
              Expenses List
            </NavLink>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default DashBoard;
