import MarketNews from "../models/MarketNewsModel.js";

/**
 * @desc    Get all market news (optional filters)
 * @route   GET /api/market-news
 * @access  Public
 */


export const getAllMarketNews = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { isActive: true };

    // Date range filter (tradingDate)
    if (startDate || endDate) {
      filter.tradingDate = {};

      if (startDate) {
        filter.tradingDate.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.tradingDate.$lte = new Date(endDate);
      }
    }

    const news = await MarketNews.find(filter)
      .sort({ tradingDate: -1, impactLevel: -1, publishedAt: -1 });

    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch market news",
      error: error.message,
    });
  }
};


/**
 * @desc    Get today's market-moving news
 * @route   GET /api/market-news/today
 * @access  Public
 */
export const getTodayMarketNews = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const news = await MarketNews.find({
      publishedAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      isActive: true,
    }).sort({ impactLevel: -1, publishedAt: -1 });

    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's market news",
      error: error.message,
    });
  }
};


/**
 * @desc    Get HIGH impact news only
 * @route   GET /api/market-news/high-impact
 * @access  Public
 */
export const getHighImpactNews = async (req, res) => {
  try {
    const news = await MarketNews.find({
      impactLevel: "HIGH",
      isActive: true,
    }).sort({ tradingDate: -1, publishedAt: -1 });

    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch high impact news",
      error: error.message,
    });
  }
};
