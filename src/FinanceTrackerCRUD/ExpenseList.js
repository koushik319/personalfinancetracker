import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpenseList.css";

const ExpenseList = () => {
  const UserId = localStorage.getItem("UserId");
  const accessToken = localStorage.getItem("accessToken");

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    CategoryId: "",
    Date: "",
    page: 1,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5122/api/Categories", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));

    fetchExpenses();
  }, [filters, accessToken]);

  const fetchExpenses = () => {
    const formattedDate = filters.Date
      ? new Date(filters.Date).toISOString().split("T")[0]
      : "";

    console.log("Fetching Expenses with:", {
      UserId,
      CategoryId: filters.CategoryId,
      Date: formattedDate,
      page: filters.page,
    });

    axios
      .get("http://localhost:5122/api/Expenses", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          UserId,
          CategoryId: filters.CategoryId,
          Date: formattedDate,
          page: filters.page,
        },
      })
      .then((res) => {
        console.log("API Response Data:", res.data);
        setExpenses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching expenses:", err);
        setLoading(false);
      });
  };

  const onFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const nextPage = () => setFilters({ ...filters, page: filters.page + 1 });
  const prevPage = () =>
    setFilters({ ...filters, page: Math.max(1, filters.page - 1) });

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );

  return (
    <div className="expense-container">
      <div className="expense-card">
        <h2>Expense List</h2>

        {loading && <p>Loading expenses...</p>}

        {!loading && expenses.length === 0 && (
          <div className="no-expenses-container">
            <p>No expenses found.</p>
            <button
              className="go-back-btn"
              onClick={() => setFilters({ CategoryId: "", Date: "", page: 1 })}
            >
              Go Back to Expense List
            </button>
          </div>
        )}

        {!loading && expenses.length > 0 && (
          <>
            <div className="expense-filter">
              <label htmlFor="CategoryId">Filter by Category:</label>
              <select
                name="CategoryId"
                value={filters.CategoryId}
                onChange={onFilterChange}
                className="expense-select"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>

              <label htmlFor="Date">Filter by Date:</label>
              <input
                type="date"
                name="Date"
                value={filters.Date}
                onChange={onFilterChange}
                className="expense-input"
              />
            </div>

            <table className="expense-table">
              <thead>
                <tr>
                  <th>ExpenseId</th>
                  <th>UserId</th>
                  <th>CategoryId</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.expenseId}>
                    <td>{expense.expenseId}</td>
                    <td>{expense.userId}</td>
                    <td>{expense.categoryId || "N/A"}</td>
                    <td>{expense.description}</td>
                    <td>{expense.amount}</td>
                    <td>{new Date(expense.date).toLocaleString()}</td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Total Amount:
                  </td>
                  <td style={{ fontWeight: "bold" }}>{totalAmount}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <div className="pagination-controls">
              <button onClick={prevPage} disabled={filters.page === 1}>
                Previous
              </button>
              <span>Page {filters.page}</span>
              <button onClick={nextPage}>Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
