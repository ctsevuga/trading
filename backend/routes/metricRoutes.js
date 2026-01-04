import express from "express";
import {
  getAllMetrics,
  getMetricsByCategory,
  getMetricById,
  getMetricCategories,
} from "../controllers/metricController.js";

const router = express.Router();

/**
 * STATIC ROUTES (FIRST)
 */
router.get("/categories", getMetricCategories);
router.get("/category/:category", getMetricsByCategory);

/**
 * COLLECTION ROUTE
 */
router.get("/", getAllMetrics);

/**
 * PARAMETERIZED ROUTE (LAST)
 */
router.get("/:id", getMetricById);

export default router;
