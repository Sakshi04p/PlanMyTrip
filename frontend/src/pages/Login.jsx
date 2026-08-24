import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="section-heading text-center mb-8">Welcome back</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && (
          <p className="font-body text-sm text-rust bg-rust/10 rounded-md px-3 py-2">{error}</p>
        )}

        <div>
          <label className="font-body text-sm text-ink mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="email"
          />
        </div>

        <div>
          <label className="font-body text-sm text-ink mb-1 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="font-body text-sm text-taupe text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-clay font-semibold hover:text-rust">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
