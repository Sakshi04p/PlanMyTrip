import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import ExpenseChart from "../components/ExpenseChart";

const CATEGORIES = ["Hotel", "Food", "Transport", "Activities", "Shopping", "Other"];

const ExpenseTracker = () => {
  const { id: tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripRes, expensesRes] = await Promise.all([
        api.get(`/trips/${tripId}`),
        api.get(`/expenses/${tripId}`),
      ]);
      setTrip(tripRes.data);
      setExpenses(expensesRes.data);
    } catch (err) {
      setError("Could not load expense data.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategory("Food");
    setAmount("");
    setDescription("");
    setDate("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;

    try {
      if (editingId) {
        const { data } = await api.put(`/expenses/${editingId}`, {
          category,
          amount: Number(amount),
          description,
          date: date || undefined,
        });
        setExpenses((prev) => prev.map((exp) => (exp._id === editingId ? data : exp)));
      } else {
        const { data } = await api.post("/expenses", {
          trip: tripId,
          category,
          amount: Number(amount),
          description,
          date: date || undefined,
        });
        setExpenses((prev) => [data, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError("Could not save this expense.");
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setCategory(expense.category);
    setAmount(expense.amount);
    setDescription(expense.description || "");
    setDate(expense.date ? expense.date.slice(0, 10) : "");
  };

  const handleDelete = async (expenseId) => {
    try {
      await api.delete(`/expenses/${expenseId}`);
      setExpenses((prev) => prev.filter((exp) => exp._id !== expenseId));
    } catch (err) {
      setError("Could not delete this expense.");
    }
  };

  if (loading) return <Loader label="Loading expenses..." />;
  if (!trip) return null;

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = trip.budget - totalSpent;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-heading">Expense Tracker</h1>
          <p className="font-body text-taupe mt-1">{trip.destination}</p>
        </div>
        <Link to={`/trips/${tripId}`} className="btn-secondary w-fit">
          Back to Trip
        </Link>
      </div>

      {error && (
        <p className="font-body text-sm text-rust bg-rust/10 rounded-md px-3 py-2 mb-6">{error}</p>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <p className="font-display text-2xl text-ink">₹{trip.budget.toLocaleString("en-IN")}</p>
          <p className="font-body text-sm text-taupe mt-1">Total Budget</p>
        </div>
        <div className="card text-center">
          <p className="font-display text-2xl text-clay">₹{totalSpent.toLocaleString("en-IN")}</p>
          <p className="font-body text-sm text-taupe mt-1">Total Spent</p>
        </div>
        <div className="card text-center">
          <p className={`font-display text-2xl ${remaining < 0 ? "text-rust" : "text-sage"}`}>
            ₹{remaining.toLocaleString("en-IN")}
          </p>
          <p className="font-body text-sm text-taupe mt-1">Remaining Budget</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Add / edit expense form */}
          <form onSubmit={handleSubmit} className="card space-y-4">
            <h3 className="font-display text-lg text-ink">
              {editingId ? "Edit Expense" : "Add an Expense"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm text-ink mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-body text-sm text-ink mb-1 block">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="font-body text-sm text-ink mb-1 block">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                placeholder="e.g. Hotel check-in payment"
              />
            </div>
            <div>
              <label className="font-body text-sm text-ink mb-1 block">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                {editingId ? "Update Expense" : "Add Expense"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn-secondary flex-1">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Expense list */}
          <div className="space-y-3">
            {expenses.length === 0 ? (
              <p className="font-body text-sm text-taupe">No expenses logged yet.</p>
            ) : (
              expenses.map((expense) => (
                <div key={expense._id} className="card flex items-center justify-between">
                  <div>
                    <span className="inline-block text-xs font-body font-semibold text-clay bg-clay/10 px-2 py-0.5 rounded-full mb-1">
                      {expense.category}
                    </span>
                    <p className="font-body text-ink">{expense.description || "No description"}</p>
                    <p className="font-body text-xs text-taupe mt-0.5">
                      {new Date(expense.date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display text-lg text-ink">
                      ₹{expense.amount.toLocaleString("en-IN")}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-sm font-body text-clay hover:text-rust transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-sm font-body text-rust/70 hover:text-rust transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <ExpenseChart expenses={expenses} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
