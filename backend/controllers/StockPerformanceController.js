import StockPerformance from "../models/StockPerformanceModel.js";

// Controller to get all stock performances
export const getAllStockPerformances = async (req, res) => {
  try {
    const stockPerformances = await StockPerformance.find();
    res.status(200).json(stockPerformances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock performances", error });
  }
};

// Controller to get a stock performance by its ID
export const getStockPerformanceById = async (req, res) => {
  const { id } = req.params;

  try {
    const stockPerformance = await StockPerformance.findById(id);
    if (!stockPerformance) {
      return res.status(404).json({ message: "Stock performance not found" });
    }
    res.status(200).json(stockPerformance);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock performance", error });
  }
};

// Controller to get stock performances by stock symbol
export const getStockPerformanceBySymbol = async (req, res) => {
  const { stockSymbol } = req.params;

  try {
    const stockPerformance = await StockPerformance.findOne({ stockSymbol });
    if (!stockPerformance) {
      return res.status(404).json({ message: "Stock performance not found" });
    }
    res.status(200).json(stockPerformance);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock performance", error });
  }
};

// Controller to get stock performances based on `gainerOrLoser` (e.g., Gainers or Losers)
export const getStockPerformancesByGainerLoser = async (req, res) => {
  const { gainerOrLoser } = req.params; // "Gainer" or "Loser"

  try {
    const stockPerformances = await StockPerformance.find({ gainerOrLoser });
    if (stockPerformances.length === 0) {
      return res.status(404).json({ message: `No ${gainerOrLoser}s found` });
    }
    res.status(200).json(stockPerformances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock performances", error });
  }
};

// Controller to get stock performances filtered by a date range (from `startDate` to `endDate`)
export const getStockPerformancesByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;
console.log(startDate)
console.log(endDate)
  try {
    const stockPerformances = await StockPerformance.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    if (stockPerformances.length === 0) {
      return res.status(404).json({ message: "No stock performances found in this date range" });
    }
    res.status(200).json(stockPerformances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock performances by date range", error });
  }
};

// Controller to get stock performances with a specific rank (e.g., `rankInGainerLoser`)
export const getStockPerformancesByRank = async (req, res) => {
  const { rank } = req.params; // Specific rank to filter by

  try {
    const stockPerformances = await StockPerformance.find({ rankInGainerLoser: rank });
    if (stockPerformances.length === 0) {
      return res.status(404).json({ message: `No stock performances found with rank ${rank}` });
    }
    res.status(200).json(stockPerformances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock performances by rank", error });
  }
};

// Controller to get recent news from stock performances
export const getRecentNews = async (req, res) => {
  try {
    const stockPerformances = await StockPerformance.find({ "recentNews.headline": { $exists: true } });

    // Flatten the recent news from all stock performances
    const recentNews = stockPerformances.map((stock) => stock.recentNews).flat();

    if (recentNews.length === 0) {
      return res.status(404).json({ message: "No recent news found" });
    }
    res.status(200).json(recentNews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent news", error });
  }
};

export const getUniqueStockSymbolsAndNames = async (req, res) => {
  try {
    // Aggregation pipeline to fetch unique combinations of stockSymbol and stockName
    const uniqueStocks = await StockPerformance.aggregate([
      {
        $group: {
          _id: {
            stockSymbol: "$stockSymbol",
            stockName: "$stockName",
          },
        },
      },
      {
        $project: {
          _id: 0, // exclude the _id field
          stockSymbol: "$_id.stockSymbol",
          stockName: "$_id.stockName",
        },
      },
    ]);

    // Check if any unique stock data is found
    if (uniqueStocks.length === 0) {
      return res.status(404).json({ message: "No unique stock data found." });
    }

    // Send response with the unique stock data
    res.status(200).json(uniqueStocks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unique stock data", error });
  }
};

// controllers/StockPerformanceController.js


export const getYesterdayStockPerformance = async (req, res) => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Format to YYYY-MM-DD to match stored date
    const yyyy = yesterday.getFullYear();
    const mm = String(yesterday.getMonth() + 1).padStart(2, "0");
    const dd = String(yesterday.getDate()).padStart(2, "0");
    const yesterdayStr = `${yyyy}-${mm}-${dd}`;

    // Query by date string (ignores time)
    const data = await StockPerformance.find({
      date: { $gte: new Date(yesterdayStr), $lt: new Date(`${yyyy}-${mm}-${dd}T23:59:59.999Z`) },
    }).sort({ CompositeRank: 1 });

    return res.status(200).json({
      success: true,
      date: yesterdayStr,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Error fetching yesterday stock performance:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch yesterday stock performance",
    });
  }
};

