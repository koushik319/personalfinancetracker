import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ExpenseList.css";

const ExpenseList = () => {
  const navigate = useNavigate();
  const UserId = localStorage.getItem("UserId");
  const accessToken = localStorage.getItem("accessToken");

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({ description: "", amount: "" });
  
  const [totalPages, setTotalPages] = useState(1); 
  const [filters, setFilters] = useState({
    CategoryId: "",
    Date: "",
    page: 1,
  });

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, [filters]); 

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5122/api/Categories", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchExpenses = async () => {
    if (!UserId) {
      console.error("UserId is missing. Please log in.");
      return;
    }

    try {
      const formattedDate = filters.Date
        ? new Date(filters.Date).toISOString().split("T")[0]
        : "";

      const res = await axios.get("http://localhost:5122/api/Expenses", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          UserId,
          CategoryId: filters.CategoryId || undefined,
          Date: formattedDate || undefined,
          page: filters.page,
          limit: 5,
        },
      });

      setExpenses(res.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5122/api/Expenses/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const startEditing = (expense) => {
    setEditingExpense(expense);
    setEditForm({ description: expense.description, amount: expense.amount });
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveEdit = async () => {
    try {
      if (!accessToken || !editingExpense?.expenseId) return;

      const updatedExpense = {
        expenseId: editingExpense.expenseId,
        userId: editingExpense.userId,
        categoryId: editingExpense.categoryId,
        description: editForm.description,
        amount: parseFloat(editForm.amount),
        date: editingExpense.date,
      };

      await axios.put(
        `http://localhost:5122/api/Expenses/${editingExpense.expenseId}`,
        updatedExpense,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      console.error("Error updating expense:", err);
    }
  };

  const cancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <div className="expense-container">
      <div className="expense-card">
        <h2>Expense List</h2>

        {/* Filters Section */}
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="CategoryId" className="filter-label">
              Filter by Category:
            </label>
            <select
              name="CategoryId"
              value={filters.CategoryId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, CategoryId: e.target.value }))
              }
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="Date" className="filter-label">
              Filter by Date:
            </label>
            <input
              type="date"
              name="Date"
              value={filters.Date}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, Date: e.target.value }))
              }
              className="filter-input"
            />
          </div>
        </div>

        {loading && <p>Loading expenses...</p>}

        {!loading && expenses.length === 0 && (
          <div className="no-expenses-container">
            <p>No expenses found.</p>
            <button
              className="go-back-btn"
              onClick={() => setFilters({ CategoryId: "", Date: "", page: 1 })}
            >
              Reset Filters
            </button>
          </div>
        )}

        {!loading && expenses.length > 0 && (
          <table className="expense-table">
            <thead>
              <tr>
                <th>ExpenseId</th>
                <th>UserId</th>
                <th>CategoryId</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.expenseId}>
                  <td>{expense.expenseId}</td>
                  <td>{expense.userId}</td>
                  <td>{expense.categoryId || "N/A"}</td>
                  <td>
                    {editingExpense?.expenseId === expense.expenseId ? (
                      <input
                        type="text"
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                      />
                    ) : (
                      expense.description
                    )}
                  </td>
                  <td>
                    {editingExpense?.expenseId === expense.expenseId ? (
                      <input
                        type="number"
                        name="amount"
                        value={editForm.amount}
                        onChange={handleEditChange}
                      />
                    ) : (
                      expense.amount
                    )}
                  </td>
                  <td>{new Date(expense.date).toLocaleString()}</td>
                  <td>
                      {editingExpense?.expenseId === expense.expenseId ? (
                        <>
                          <button onClick={saveEdit}>Save</button>
                          <button onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => navigate("/expenses")}
                          >
                            Add
                          </button>
                          <button
                            className="btn btn-warning"
                            onClick={() => startEditing(expense)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this expense?"
                                )
                              ) {
                                deleteExpense(expense.expenseId);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        )}
        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button 
            disabled={filters.page === 1} 
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </button>
          <span>Page {filters.page} of {totalPages}</span>
          <button 
            disabled={filters.page === totalPages} 
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </button>
        </div>
      </div>
        
    </div>
    
  );
};

export default ExpenseList;
