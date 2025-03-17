import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpenseTracker.css"; // Import CSS for styling

const ExpenseTracker = () => {
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

  // Fetch Categories from API
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

  // Handle Input Changes
  const onInputChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  // Submit New Expense
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
      Amount: parseFloat(expense.Amount), // Ensure amount is stored as a number
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

      // Reset Form Fields
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
    <div className="expense-card-container">
      <div className="expense-card">
        <h2>Add Expense</h2>

        {loading && <p>Loading categories...</p>}

        {!loading && (
          <form onSubmit={addExpense} className="expense-form">
            {/* Category Dropdown */}
            <div className="expense-group">
              <label htmlFor="CategoryId">Select Category</label>
              <select
                name="CategoryId"
                value={expense.CategoryId}
                onChange={onInputChange}
                required
                className="expense-select"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Input */}
            <div className="expense-group">
              <label htmlFor="Description">Description</label>
              <input
                type="text"
                name="Description"
                placeholder="Enter description"
                value={expense.Description}
                onChange={onInputChange}
                required
                className="expense-input"
              />
            </div>

            {/* Amount Input */}
            <div className="expense-group">
              <label htmlFor="Amount">Amount</label>
              <input
                type="number"
                name="Amount"
                placeholder="Enter amount"
                value={expense.Amount}
                onChange={onInputChange}
                required
                className="expense-input"
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="expense-btn">
              Add Expense
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;