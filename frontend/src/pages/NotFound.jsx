import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="font-display text-6xl text-clay mb-4">404</p>
      <h1 className="font-display text-2xl text-ink mb-2">Page not found</h1>
      <p className="font-body text-taupe mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
