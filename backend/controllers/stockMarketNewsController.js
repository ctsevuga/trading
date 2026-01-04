import StockMarketNews from "../models/StockMarketNewsModel.js";

// Controller for fetching all stock market news
export const getStockMarketNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sentiment, startDate, endDate } = req.query;

    const filters = {};

    // Sentiment filter
    if (sentiment) {
      filters.sentiment = sentiment;
    }

    // Date range filter (published_at)
    if (startDate || endDate) {
      filters.published_at = {};

      if (startDate) {
        filters.published_at.$gte = new Date(
          `${startDate}T00:00:00.000Z`
        );
      }

      if (endDate) {
        filters.published_at.$lte = new Date(
          `${endDate}T23:59:59.999Z`
        );
      }
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { published_at: -1 }, // ✅ FIXED
    };

    const stockNews = await StockMarketNews.paginate(filters, options);

    res.status(200).json({
      success: true,
      data: stockNews,
    });
  } catch (error) {
    console.error('Date filter error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// Controller for fetching a single stock market news by ID
export const getStockMarketNewsById = async (req, res) => {
  try {
    const newsId = req.params.id;

    const news = await StockMarketNews.findById(newsId);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: "Stock market news not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching stock market news by ID.",
    });
  }
};

export const getYesterdayStockMarketNews = async (req, res) => {
  try {
    const now = new Date();

    // UTC start & end of yesterday
    const startOfYesterday = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - 1,
      0, 0, 0
    ));

    const endOfYesterday = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - 1,
      23, 59, 59, 999
    ));

    console.log("Querying for news between:", startOfYesterday, endOfYesterday);

    const news = await StockMarketNews.find({
      date: { $gte: startOfYesterday, $lte: endOfYesterday },
    }).sort({ publishedAt: -1 });

    return res.status(200).json({
      success: true,
      date: startOfYesterday.toISOString().split("T")[0],
      count: news.length,
      data: news,
    });

  } catch (error) {
    console.error("Error fetching yesterday stock market news:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch yesterday stock market news",
    });
  }
};

