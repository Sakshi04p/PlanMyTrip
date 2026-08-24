import Trip from "../models/Trip.js";

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
export const createTrip = async (req, res, next) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      travelStyle,
      interests,
      budgetBreakdown,
      itinerary,
    } = req.body;

    if (!destination || !startDate || !endDate || !budget) {
      res.status(400);
      throw new Error("Please provide destination, dates and budget");
    }

    const trip = await Trip.create({
      user: req.user._id,
      destination,
      startDate,
      endDate,
      travelers: travelers || 1,
      budget,
      travelStyle,
      interests,
      budgetBreakdown,
      itinerary: itinerary || [],
    });

    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all trips for logged in user
// @route   GET /api/trips
// @access  Private
export const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single trip by id
// @route   GET /api/trips/:id
// @access  Private
export const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error("Trip not found");
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to view this trip");
    }

    res.json(trip);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a trip (edit itinerary, budget etc.)
// @route   PUT /api/trips/:id
// @access  Private
export const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error("Trip not found");
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this trip");
    }

    const updatableFields = [
      "destination",
      "startDate",
      "endDate",
      "travelers",
      "budget",
      "travelStyle",
      "interests",
      "budgetBreakdown",
      "itinerary",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
      }
    });

    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
export const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error("Trip not found");
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this trip");
    }

    await trip.deleteOne();
    res.json({ message: "Trip removed" });
  } catch (error) {
    next(error);
  }
};
