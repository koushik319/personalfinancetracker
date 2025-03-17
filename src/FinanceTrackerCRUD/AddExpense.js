import React, { useState, useEffect } from "react";
import "../LoginAndSignUp/LoginAndSignUp.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  const accessToken = localStorage.getItem("accessToken");
  const [expense, setExpense] = useState({
    UserId: 0,
    CategoryId: 0,
    Description: "",
    Amount: 0,
    // experienceYears: 0,
  });
  const navigate = useNavigate();
  const { UserId, CategoryId, Description, Amount } = expense;
//   const onInputChange = (e) => {
//     e.preventDefault();
//     console.log(e.target.value);
//     setExpense({ ...expense, [e.target.name]: e.target.value });
//   };

const onInputChange = (e) => {
    const { name, value } = e.target;
  
    console.log(`Field: ${name}, Value: ${value}`);
  
    setExpense((prevExpense) => ({
      ...prevExpense,
      [name]: name === "Amount" ? parseFloat(value) || 0 : value, // Ensure Amount is a number
    }));
  };
  

  //   const loadCategories = async () => {
  //     const response = await axios.get("http://localhost:5122/api/Categories",
  //         {
  //             headers :{
  //              'Authorization' :`Bearer ${accessToken}`
  //             }
  //       });
  //     setOptions(response.data);
  //   };

  const loadCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5122/api/Categories", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Fetched Categories: ", response.data); // Debugging log
      setOptions(response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    const UserId = localStorage.getItem("UserId");
    expense.UserId = UserId;
    expense.CategoryId = selectedValue;
    //expense.CategoryId = selectedValue;
    try {
      const response = await axios.post(
        "http://localhost:5122/api/Expenses",
        expense,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      alert("expense added successfully!!");
      setExpense({
        UserId: 0,
        CategoryId: 0,
        // expenseName: "",
        // experienceYears: 0,
        Description: "",
        Amount: 0,
      });
      navigate("/dashboard");
    } catch (error) {
      alert("added failed!!");
    }
  };

  return (
    <div>
      {" "}
      <div className="container">
        <div className="w-75 mx-auto shadow p-5">
          <h2 className="text-center mb-4">Add expense</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <label>Select Category: </label>
            <div className="text-center">
              {/* <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
              >
                <option value="">-- Select --</option>
                {options.map((item) => (
                  <option key={item.CategoryId} value={item.CategoryId}>
                    {item.CategoryName}
                  </option>
                ))}
              </select> */}
              <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
              >
                <option value="">-- Select --</option>
                {options.map((item) => (
                  <option key={item.categoryId} value={item.categoryId}>
                    {item.categoryName}
                  </option>
                ))}
              </select>

              <p>Selected CategoryId : {selectedValue}</p>
            </div>
            <input
              type="text"
              name="Description"
              placeholder="Enter Description"
              required
              value={Description}
              onChange={(e) => onInputChange(e)}
            />
            <input
              type="text"
              name="Amount"
              placeholder="Enter experience in Years"
              required
              value={Amount}
              onChange={(e) => onInputChange(e)}
            />

            <button>Add expense</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
