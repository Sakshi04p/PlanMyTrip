import mongoose from "mongoose";

// One activity inside a day of the itinerary
const activitySchema = new mongoose.Schema(
  {
    time: { type: String, default: "" },
    place: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: true }
);

// One day of the itinerary, made up of several activities
const daySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    activities: [activitySchema],
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    travelers: { type: Number, required: true, default: 1 },
    budget: { type: Number, required: true },
    travelStyle: { type: String, default: "Balanced" },
    interests: [{ type: String }],
    budgetBreakdown: {
      hotel: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      shopping: { type: Number, default: 0 },
    },
    itinerary: [daySchema],
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
