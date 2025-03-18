import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpenseList.css";

const ExpenseList = () => {
  const UserId = localStorage.getItem("UserId");
  const accessToken = localStorage.getItem("accessToken");

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({ description: "", amount: "" });

  const [filters, setFilters] = useState({
    CategoryId: "",
    Date: "",
    page: 1,
  });

  useEffect(() => {
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

    fetchCategories();
    fetchExpenses();
  }, [filters, accessToken]);

  const fetchExpenses = async () => {
    try {
      const formattedDate = filters.Date
        ? new Date(filters.Date).toISOString().split("T")[0]
        : "";
      const res = await axios.get("http://localhost:5122/api/Expenses", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          UserId,
          CategoryId: filters.CategoryId,
          Date: formattedDate,
          page: filters.page,
        },
      });
      setExpenses(res.data);
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
                        <>
                          <button onClick={() => startEditing(expense)}>Edit</button>
                          <button onClick={() => deleteExpense(expense.expenseId)}>
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
