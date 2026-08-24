import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import TripCard from "../components/TripCard";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await api.get("/trips");
        setTrips(data);
      } catch (err) {
        setError("Could not load your trips. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const today = new Date();
  const upcomingTrips = trips.filter((trip) => new Date(trip.startDate) >= today);
  const recentTrips = trips.filter((trip) => new Date(trip.startDate) < today);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="section-heading">Welcome back, {user?.name?.split(" ")[0]}</h1>
          <p className="font-body text-taupe mt-1">Here's what your travel plans look like.</p>
        </div>
        <Link to="/trips/create" className="btn-primary w-fit">
          + Create New Trip
        </Link>
      </div>

      {loading ? (
        <Loader label="Loading your trips..." />
      ) : error ? (
        <p className="font-body text-rust">{error}</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="card text-center">
              <p className="font-display text-3xl text-clay">{trips.length}</p>
              <p className="font-body text-sm text-taupe mt-1">Total Trips</p>
            </div>
            <div className="card text-center">
              <p className="font-display text-3xl text-clay">{upcomingTrips.length}</p>
              <p className="font-body text-sm text-taupe mt-1">Upcoming Trips</p>
            </div>
            <div className="card text-center">
              <p className="font-display text-3xl text-clay">{recentTrips.length}</p>
              <p className="font-body text-sm text-taupe mt-1">Recent Trips</p>
            </div>
          </div>

          {trips.length === 0 ? (
            <div className="card text-center py-12">
              <p className="font-body text-taupe mb-4">You haven't planned any trips yet.</p>
              <Link to="/trips/create" className="btn-primary">
                Plan Your First Trip
              </Link>
            </div>
          ) : (
            <>
              {upcomingTrips.length > 0 && (
                <div className="mb-10">
                  <h2 className="font-display text-xl text-ink mb-4">Upcoming Trips</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {upcomingTrips.map((trip) => (
                      <TripCard key={trip._id} trip={trip} />
                    ))}
                  </div>
                </div>
              )}

              {recentTrips.length > 0 && (
                <div>
                  <h2 className="font-display text-xl text-ink mb-4">Recent Trips</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recentTrips.map((trip) => (
                      <TripCard key={trip._id} trip={trip} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
