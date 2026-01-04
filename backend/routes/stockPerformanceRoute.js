import express from "express";
import {
  getAllStockPerformances,
  getStockPerformanceById,
  getStockPerformanceBySymbol,
  getStockPerformancesByGainerLoser,
  getStockPerformancesByDateRange,
  getStockPerformancesByRank,
  getRecentNews,
  getUniqueStockSymbolsAndNames,
  getYesterdayStockPerformance,
} from "../controllers/StockPerformanceController.js";

const router = express.Router();

/**
 * STATIC ROUTES (FIRST)
 */
router.get("/yesterday", getYesterdayStockPerformance);
router.get("/unique-stocks", getUniqueStockSymbolsAndNames);
router.get("/stock-performances/recent-news", getRecentNews);
router.get("/stock-performances/date-range", getStockPerformancesByDateRange);

/**
 * FILTERED / SEMI-DYNAMIC ROUTES
 */
router.get(
  "/stock-performances/gainer-loser/:gainerOrLoser",
  getStockPerformancesByGainerLoser
);
router.get(
  "/stock-performances/rank/:rank",
  getStockPerformancesByRank
);
router.get(
  "/stock-performance/symbol/:stockSymbol",
  getStockPerformanceBySymbol
);

/**
 * COLLECTION ROUTE
 */
router.get("/stock-performances", getAllStockPerformances);

/**
 * FULLY DYNAMIC ROUTE (LAST)
 */
router.get("/stock-performance/:id", getStockPerformanceById);

export default router;
