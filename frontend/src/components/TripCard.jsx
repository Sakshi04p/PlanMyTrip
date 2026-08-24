import { Link } from "react-router-dom";

// Formats a date range like "12 Jan - 18 Jan 2025"
const formatRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const options = { day: "numeric", month: "short" };
  return `${startDate.toLocaleDateString("en-IN", options)} - ${endDate.toLocaleDateString(
    "en-IN",
    { ...options, year: "numeric" }
  )}`;
};

const TripCard = ({ trip }) => {
  return (
    <Link to={`/trips/${trip._id}`} className="card block hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold text-ink">{trip.destination}</h3>
          <p className="font-body text-sm text-taupe mt-1">
            {formatRange(trip.startDate, trip.endDate)}
          </p>
        </div>
        <span className="bg-clay/10 text-clay text-xs font-body font-semibold px-2.5 py-1 rounded-full">
          {trip.travelers} {trip.travelers > 1 ? "travelers" : "traveler"}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm font-body">
        <span className="text-taupe">Budget</span>
        <span className="text-ink font-semibold">₹{trip.budget?.toLocaleString("en-IN")}</span>
      </div>
    </Link>
  );
};

export default TripCard;
