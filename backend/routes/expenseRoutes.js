import express from "express";
import {
  addExpense,
  getExpensesByTrip,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, addExpense);
router.get("/:tripId", protect, getExpensesByTrip);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

export default router;
