import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./ExpenseTracker.css"; 

const ExpenseTracker = () => {
  const navigate = useNavigate();
  const UserId = localStorage.getItem("UserId");
  const accessToken = localStorage.getItem("accessToken");

  const [expense, setExpense] = useState({
    CategoryId: "",
    Description: "",
    Amount: "",
    Date: new Date().toISOString(),
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    axios
      .get("http://localhost:5122/api/Categories", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, [accessToken]);

  
  const onInputChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  
  const addExpense = async (e) => {
    e.preventDefault();

    if (!UserId || !accessToken) {
      alert("User not authenticated. Please log in.");
      return;
    }

    if (!expense.CategoryId) {
      alert("Please select a category.");
      return;
    }

    const newExpense = {
      ...expense,
      UserId,
      Amount: parseFloat(expense.Amount), 
      Date: new Date().toISOString(),
    };

    try {
      const response = await axios.post("http://localhost:5122/api/Expenses", newExpense, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Expense added successfully:", response.data);
      alert("Expense added successfully!");

      
      setExpense({
        CategoryId: "",
        Description: "",
        Amount: "",
        Date: new Date().toISOString(),
      });
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        alert(error.response.data.message || "Failed to add expense.");
      } else {
        console.error("Request Error:", error.message);
        alert("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="expense-card-container1">
      <div className="expense-card1">
        <h2>Add Expense</h2>

        {loading && <p>Loading categories...</p>}

        {!loading && (
          <form onSubmit={addExpense} className="expense-form1">
          
            <div className="expense-group1">
              <label htmlFor="CategoryId">Select Category</label>
              <select
                name="CategoryId"
                value={expense.CategoryId}
                onChange={onInputChange}
                required
                className="expense-select1"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            
            <div className="expense-group1">
              <label htmlFor="Description">Description</label>
              <input
                type="text"
                name="Description"
                placeholder="Enter description"
                value={expense.Description}
                onChange={onInputChange}
                required
                className="expense-input1"
              />
            </div>

          
            <div className="expense-group1">
              <label htmlFor="Amount">Amount</label>
              <input
                type="number"
                name="Amount"
                placeholder="Enter amount"
                value={expense.Amount}
                onChange={onInputChange}
                required
                className="expense-input1"
              />
            </div>

            
            <button type="submit" className="expense-btn1">
              Add Expense
            </button>

            <button
              type="button"
              className="expense-btn1 expense-list-btn"
              onClick={() => navigate("/expenselist")}
            >
              View Expense List
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;