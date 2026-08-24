import express from "express";
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../controllers/tripController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(protect, createTrip).get(protect, getTrips);
router
  .route("/:id")
  .get(protect, getTripById)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

export default router;
