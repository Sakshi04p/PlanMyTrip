import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const INTEREST_OPTIONS = [
  "Sightseeing",
  "Food",
  "Adventure",
  "Culture",
  "Nature",
  "Relaxation",
  "Shopping",
  "Nightlife",
];

const TRAVEL_STYLES = ["Budget", "Balanced", "Luxury"];

// Splits the total budget into rough categories - simple percentages, nothing fancy
const calculateBudgetBreakdown = (budget) => {
  return {
    hotel: Math.round(budget * 0.35),
    food: Math.round(budget * 0.25),
    transport: Math.round(budget * 0.15),
    activities: Math.round(budget * 0.15),
    shopping: Math.round(budget * 0.1),
  };
};

// Works out the number of days between two dates (inclusive)
const getDaysBetween = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate - startDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 1;
};

const CreateTrip = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [travelStyle, setTravelStyle] = useState("Balanced");
  const [interests, setInterests] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!destination || !startDate || !endDate || !budget) {
      setError("Please fill in all required fields");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before the start date");
      return;
    }

    try {
      setLoading(true);
      const days = getDaysBetween(startDate, endDate);

      // Step 1: ask Gemini for a day-wise itinerary
      const { data: aiData } = await api.post("/ai/generate", {
        destination,
        days,
        budget,
        travelers,
        travelStyle,
        interests,
      });

      // Step 2: save the trip (with the generated itinerary) to MongoDB
      const { data: trip } = await api.post("/trips", {
        destination,
        startDate,
        endDate,
        travelers,
        budget,
        travelStyle,
        interests,
        budgetBreakdown: calculateBudgetBreakdown(Number(budget)),
        itinerary: aiData.itinerary,
      });

      navigate(`/trips/${trip._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="section-heading mb-8">Plan a new trip</h1>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {error && (
          <p className="font-body text-sm text-rust bg-rust/10 rounded-md px-3 py-2">{error}</p>
        )}

        <div>
          <label className="font-body text-sm text-ink mb-1 block">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="input-field"
            placeholder="e.g. Goa, India"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink mb-1 block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink mb-1 block">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink mb-1 block">Budget (₹)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="input-field"
              placeholder="e.g. 30000"
              min="0"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink mb-1 block">Travelers</label>
            <input
              type="number"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              className="input-field"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="font-body text-sm text-ink mb-1 block">Travel Style</label>
          <div className="flex gap-2">
            {TRAVEL_STYLES.map((style) => (
              <button
                type="button"
                key={style}
                onClick={() => setTravelStyle(style)}
                className={`px-4 py-2 rounded-md font-body text-sm border transition-colors ${
                  travelStyle === style
                    ? "bg-clay text-cream border-clay"
                    : "bg-transparent text-ink border-sand hover:border-clay"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-body text-sm text-ink mb-2 block">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                type="button"
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full font-body text-sm border transition-colors ${
                  interests.includes(interest)
                    ? "bg-sage text-cream border-sage"
                    : "bg-transparent text-ink border-sand hover:border-sage"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Generating your itinerary..." : "Generate Itinerary"}
        </button>
      </form>
    </div>
  );
};

export default CreateTrip;
