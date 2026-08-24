import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import ActivityCard from "../components/ActivityCard";
import WeatherWidget from "../components/WeatherWidget";
import MapView from "../components/MapView";

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState(1);

  // Fields for the add/edit activity form
  const [editingActivity, setEditingActivity] = useState(null); // { dayIndex, activityId } or null for new
  const [formTime, setFormTime] = useState("");
  const [formPlace, setFormPlace] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/trips/${id}`);
      setTrip(data);
    } catch (err) {
      setError("Could not load this trip.");
    } finally {
      setLoading(false);
    }
  };

  const saveItinerary = async (updatedItinerary) => {
    try {
      const { data } = await api.put(`/trips/${id}`, { itinerary: updatedItinerary });
      setTrip(data);
    } catch (err) {
      setError("Could not save your changes. Please try again.");
    }
  };

  const openAddForm = () => {
    setEditingActivity(null);
    setFormTime("");
    setFormPlace("");
    setFormDescription("");
    setShowForm(true);
  };

  const openEditForm = (dayIndex, activity) => {
    setEditingActivity({ dayIndex, activityId: activity._id });
    setFormTime(activity.time || "");
    setFormPlace(activity.place);
    setFormDescription(activity.description || "");
    setShowForm(true);
  };

  const handleDeleteActivity = (dayIndex, activityId) => {
    const updatedItinerary = trip.itinerary.map((day, idx) => {
      if (idx !== dayIndex) return day;
      return {
        ...day,
        activities: day.activities.filter((a) => a._id !== activityId),
      };
    });
    saveItinerary(updatedItinerary);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formPlace) return;

    const dayIndex = trip.itinerary.findIndex((d) => d.day === activeDay);
    let updatedItinerary;

    if (editingActivity) {
      // Editing an existing activity
      updatedItinerary = trip.itinerary.map((day, idx) => {
        if (idx !== editingActivity.dayIndex) return day;
        return {
          ...day,
          activities: day.activities.map((a) =>
            a._id === editingActivity.activityId
              ? { ...a, time: formTime, place: formPlace, description: formDescription }
              : a
          ),
        };
      });
    } else {
      // Adding a new activity to the active day
      updatedItinerary = trip.itinerary.map((day, idx) => {
        if (idx !== dayIndex) return day;
        return {
          ...day,
          activities: [
            ...day.activities,
            { time: formTime, place: formPlace, description: formDescription },
          ],
        };
      });
    }

    saveItinerary(updatedItinerary);
    setShowForm(false);
  };

  if (loading) return <Loader label="Loading trip details..." />;
  if (error) return <p className="max-w-4xl mx-auto px-4 py-12 font-body text-rust">{error}</p>;
  if (!trip) return null;

  const currentDay = trip.itinerary.find((d) => d.day === activeDay);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="section-heading">{trip.destination}</h1>
          <p className="font-body text-taupe mt-1">
            {new Date(trip.startDate).toLocaleDateString("en-IN")} -{" "}
            {new Date(trip.endDate).toLocaleDateString("en-IN")} &middot; {trip.travelers}{" "}
            traveler{trip.travelers > 1 ? "s" : ""}
          </p>
        </div>
        <Link to={`/trips/${trip._id}/expenses`} className="btn-secondary w-fit">
          Track Expenses
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Day tabs */}
          <div className="flex flex-wrap gap-2">
            {trip.itinerary.map((day) => (
              <button
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                className={`px-4 py-2 rounded-md font-body text-sm border transition-colors ${
                  activeDay === day.day
                    ? "bg-clay text-cream border-clay"
                    : "bg-transparent text-ink border-sand hover:border-clay"
                }`}
              >
                Day {day.day}
              </button>
            ))}
          </div>

          {/* Activities for the selected day */}
          <div className="space-y-3">
            {currentDay?.activities?.length ? (
              currentDay.activities.map((activity) => (
                <ActivityCard
                  key={activity._id}
                  activity={activity}
                  onEdit={() => openEditForm(trip.itinerary.findIndex((d) => d.day === activeDay), activity)}
                  onDelete={() =>
                    handleDeleteActivity(
                      trip.itinerary.findIndex((d) => d.day === activeDay),
                      activity._id
                    )
                  }
                />
              ))
            ) : (
              <p className="font-body text-sm text-taupe">No activities added for this day yet.</p>
            )}

            <button onClick={openAddForm} className="btn-secondary w-full">
              + Add Activity
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <WeatherWidget city={trip.destination} />

          {/* Budget breakdown */}
          <div className="card">
            <h4 className="font-display text-lg text-ink mb-3">Budget Plan</h4>
            <div className="space-y-2 font-body text-sm">
              {Object.entries(trip.budgetBreakdown || {}).map(([category, amount]) => (
                <div key={category} className="flex justify-between">
                  <span className="capitalize text-taupe">{category}</span>
                  <span className="text-ink font-semibold">₹{amount.toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-sand pt-2 mt-2">
                <span className="text-ink font-semibold">Total Budget</span>
                <span className="text-clay font-semibold">
                  ₹{trip.budget.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mb-8">
        <h2 className="font-display text-xl text-ink mb-4">Trip Map</h2>
        <MapView destination={trip.destination} itinerary={trip.itinerary} />
      </div>

      {/* Add/Edit Activity Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-30">
          <div className="card bg-cream w-full max-w-md">
            <h3 className="font-display text-xl text-ink mb-4">
              {editingActivity ? "Edit Activity" : "Add Activity"}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="font-body text-sm text-ink mb-1 block">Time</label>
                <input
                  type="text"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Morning, 9:00 AM"
                />
              </div>
              <div>
                <label className="font-body text-sm text-ink mb-1 block">Place</label>
                <input
                  type="text"
                  value={formPlace}
                  onChange={(e) => setFormPlace(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Baga Beach"
                />
              </div>
              <div>
                <label className="font-body text-sm text-ink mb-1 block">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="input-field"
                  rows="3"
                  placeholder="What will you do here?"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
