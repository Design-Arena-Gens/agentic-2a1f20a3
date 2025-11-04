'use client';

import { useState, useEffect } from 'react';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  vendor: string;
  project: string;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'materials',
    description: '',
    amount: '',
    vendor: '',
    project: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('construction-expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('construction-expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newExpense: Expense = {
      id: Date.now().toString(),
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      vendor: formData.vendor,
      project: formData.project,
    };

    setExpenses([newExpense, ...expenses]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: 'materials',
      description: '',
      amount: '',
      vendor: '',
      project: '',
    });
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container">
      <div className="header">
        <h1>🏗️ Construction Expense Manager</h1>
        <p>Track and manage all your construction project expenses</p>
      </div>

      <div className="content">
        <div className="form-section">
          <h2>Add New Expense</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="materials">Materials</option>
                  <option value="labor">Labor</option>
                  <option value="equipment">Equipment</option>
                  <option value="permits">Permits</option>
                  <option value="subcontractors">Subcontractors</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Vendor</label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  placeholder="Vendor name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Project</label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  placeholder="Project name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Expense description"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Add Expense
            </button>
          </form>
        </div>

        <div className="expenses-section">
          <h2>Expense Summary</h2>

          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Expenses</h3>
              <p>${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="summary-card alt">
              <h3>Total Entries</h3>
              <p>{expenses.length}</p>
            </div>
          </div>

          {expenses.length === 0 ? (
            <div className="empty-state">
              <p>No expenses recorded yet. Add your first expense above!</p>
            </div>
          ) : (
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>{expense.project}</td>
                    <td>
                      <span className={`category-badge category-${expense.category}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td>{expense.description}</td>
                    <td>{expense.vendor}</td>
                    <td><strong>${expense.amount.toFixed(2)}</strong></td>
                    <td>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
