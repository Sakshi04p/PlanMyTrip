import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-cream border-b border-sand sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-semibold text-rust">
          PlanMyTrip
        </Link>

        <nav className="flex items-center gap-4 font-body text-sm">
          {user ? (
            <>
              <Link to="/dashboard" className="text-ink hover:text-clay transition-colors">
                Dashboard
              </Link>
              <Link to="/trips/create" className="text-ink hover:text-clay transition-colors">
                New Trip
              </Link>
              <Link to="/profile" className="text-ink hover:text-clay transition-colors">
                Profile
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-ink hover:text-clay transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
