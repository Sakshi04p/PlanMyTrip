import Expense from "../models/Expense.js";
import Trip from "../models/Trip.js";

// Helper: makes sure the trip exists and belongs to the logged in user
const verifyTripOwnership = async (tripId, userId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }
  if (trip.user.toString() !== userId.toString()) {
    const error = new Error("Not authorized to access this trip's expenses");
    error.statusCode = 403;
    throw error;
  }
  return trip;
};

// @desc    Add an expense to a trip
// @route   POST /api/expenses
// @access  Private
export const addExpense = async (req, res, next) => {
  try {
    const { trip, category, amount, description, date } = req.body;

    if (!trip || !category || !amount) {
      res.status(400);
      throw new Error("Please provide trip, category and amount");
    }

    await verifyTripOwnership(trip, req.user._id);

    const expense = await Expense.create({
      trip,
      category,
      amount,
      description,
      date,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

// @desc    Get all expenses for a trip
// @route   GET /api/expenses/:tripId
// @access  Private
export const getExpensesByTrip = async (req, res, next) => {
  try {
    await verifyTripOwnership(req.params.tripId, req.user._id);

    const expenses = await Expense.find({ trip: req.params.tripId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error("Expense not found");
    }

    await verifyTripOwnership(expense.trip, req.user._id);

    const { category, amount, description, date } = req.body;

    expense.category = category ?? expense.category;
    expense.amount = amount ?? expense.amount;
    expense.description = description ?? expense.description;
    expense.date = date ?? expense.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error("Expense not found");
    }

    await verifyTripOwnership(expense.trip, req.user._id);

    await expense.deleteOne();
    res.json({ message: "Expense removed" });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};
