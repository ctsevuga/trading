import dotenv from "dotenv";
import mongoose from "mongoose";
import MarketSummary from "./models/MarketSummaryModel.js"; // Adjust the path to your model
import connectDB from "./config/db.js"; // Assuming you have a config file for DB connection

dotenv.config();

const STOCK_LIST = [
    { symbol: "COALINDIA", name: "Coal India" },
    { symbol: "NTPC", name: "NTPC" },
    { symbol: "HINDALCO", name: "Hindalco" },
    { symbol: "BAJFINANCE", name: "Bajaj Finance" },
    { symbol: "INDUSINDBK", name: "IndusInd Bank" }
];

// Simulate fetching stock data (Replace with actual API calls like yfinance, or NSE APIs)
const getStockData = async (symbol, name) => {
    const priceData = {
        "COALINDIA": { yesterdayClose: 413.80, percentChangeYesterday: 3.10 },
        "NTPC": { yesterdayClose: 348.15, percentChangeYesterday: 3.37 },
        "HINDALCO": { yesterdayClose: 917.60, percentChangeYesterday: 2.18 },
        "BAJFINANCE": { yesterdayClose: 990.90, percentChangeYesterday: 1.85 },
        "INDUSINDBK": { yesterdayClose: 908.80, percentChangeYesterday: 1.42 }
    };

    const recentNews = [
        { headline: `Latest news about ${name}`, url: `https://example.com/${symbol}`, source: "Example News", publishedAt: new Date() }
    ];

    const tradingAnalystInterpretation = `The stock ${name} has seen a ${priceData[symbol].percentChangeYesterday > 0 ? 'positive' : 'negative'} movement recently.`;
    const outlookFactors = [
        `Factors for ${name} include global demand trends, energy prices, and company earnings reports.`
    ];

    return {
        stockSymbol: symbol,
        stockName: name,
        yesterdayClose: priceData[symbol].yesterdayClose,
        percentChangeYesterday: priceData[symbol].percentChangeYesterday,
        recentNews: recentNews,
        tradingAnalystInterpretation: tradingAnalystInterpretation,
        outlookFactors: outlookFactors
    };
};

// Seed Market Summary function
const seedMarketSummary = async () => {
  try {
    await connectDB(); // Make sure the database is connected

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Set the date to yesterday

    // Fetch stock data dynamically for each stock in the STOCK_LIST
    const stockSummaries = [];
    for (const stock of STOCK_LIST) {
      const stockData = await getStockData(stock.symbol, stock.name);
      stockSummaries.push(stockData);
    }

    // Prepare the overall market summary
    const marketSummary = new MarketSummary({
      date: yesterday,
      overallMarketInterpretation: "Indian markets showed resilience with benchmarks rallying. Commodities and cyclicals in focus; financials mixed sentiment.",
      sectorHighlights: [
        { sectorName: "Energy", trend: "Strong", commentary: "Positive outlook driven by global demand." },
        { sectorName: "Banking", trend: "Mixed", commentary: "Mixed performance with financial stocks under pressure." }
      ],
      topGainers: stockSummaries.filter(stock => stock.percentChangeYesterday > 0).map(stock => stock.stockSymbol),
      topLosers: stockSummaries.filter(stock => stock.percentChangeYesterday < 0).map(stock => stock.stockSymbol),
      notableNews: stockSummaries.flatMap(stock => stock.recentNews)
    });

    // Insert the market summary into the database
    await marketSummary.save();
    console.log("✅ Market summary seeded successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Market summary seeding failed:", error.message);
    process.exit(1);
  }
};

// Run the seeding function
seedMarketSummary();
