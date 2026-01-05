import express from "express";
import {
  getAllMarketNews,
  getTodayMarketNews,
  getHighImpactNews,
} from "../controllers/marketNewsController.js";

const router = express.Router();

// Get all market news (with filters)
router.get("/", getAllMarketNews);

// Get today's market news
router.get("/today", getTodayMarketNews);

// Get only high-impact news
router.get("/high-impact", getHighImpactNews);

export default router;
