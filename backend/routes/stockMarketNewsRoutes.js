import express from "express";
import {
  getStockMarketNews,
  getStockMarketNewsById,
  getYesterdayStockMarketNews,
} from "../controllers/stockMarketNewsController.js";

const router = express.Router();

/**
 * STATIC ROUTES (FIRST)
 */
router.get("/yesterday", getYesterdayStockMarketNews);

/**
 * COLLECTION ROUTE
 */
router.get("/", getStockMarketNews);

/**
 * PARAMETERIZED ROUTE (LAST)
 */
router.get("/:id", getStockMarketNewsById);

export default router;
