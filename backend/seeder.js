import dotenv from "dotenv";
import mongoose from "mongoose";
import Metric from "./models/MetricModel.js"; // Adjust the path to your model
import connectDB from "./config/db.js"; // Assuming you have a config file for DB connection

dotenv.config();

// Sample metric data to seed the database (including additional metrics)
const metricData = [
  // Trading Metrics
  {
    name: "1M_Return_%",
    formula: "Price at end of 1 month - Price at start of 1 month ÷ Price at start of 1 month * 100",
    interpretation:
      "Percentage return over the last 1 month. Positive → price increased; negative → price decreased. Shows recent trend of the stock.",
    category: "Trading",
  },
  {
    name: "Volatility_%",
    formula: "Standard deviation of daily returns over a period",
    interpretation:
      "Higher volatility → more price fluctuation → higher risk. Lower volatility → more stable stock.",
    category: "Trading",
  },
  {
    name: "Momentum_5d_%",
    formula: "Price at end of 5 days - Price at start of 5 days ÷ Price at start of 5 days * 100",
    interpretation:
      "Price change over the last 5 trading days. High positive → short-term bullish trend; negative → short-term bearish.",
    category: "Trading",
  },
  {
    name: "Avg_Volume",
    formula: "Total shares traded in the last month ÷ Number of trading days",
    interpretation:
      "Average number of shares traded per day over last month. Higher volume → more liquidity → easier to buy/sell without impacting price.",
    category: "Trading",
  },
  // Fundamental Metrics
  {
    name: "PE_Ratio (Price/Earnings)",
    formula: "Price per share ÷ Earnings per share",
    interpretation:
      "High PE → expensive relative to earnings; Low PE → cheap relative to earnings.",
    category: "Fundamental",
  },
  {
    name: "PB_Ratio (Price/Book)",
    formula: "Price per share ÷ Book value per share",
    interpretation:
      "High PB → stock may be overvalued; Low PB → potentially undervalued.",
    category: "Fundamental",
  },
  {
    name: "Dividend_Yield",
    formula: "Annual dividend ÷ Stock price",
    interpretation:
      "Annual dividends ÷ current stock price. Shows income return. High → good for income investors.",
    category: "Fundamental",
  },
  {
    name: "MarketCap",
    formula: "Price per share × Shares Outstanding",
    interpretation:
      "Total value of all shares (Price × Shares Outstanding). Large → stable, blue-chip; Small → more volatile but high growth potential.",
    category: "Fundamental",
  },
  // Additional Fundamental Metrics
  {
    name: "EV/EBITDA",
    formula: "Enterprise Value ÷ Earnings Before Interest, Taxes, Depreciation, and Amortization",
    interpretation:
      "Measures a company's valuation relative to its earnings. Lower values may indicate undervaluation.",
    category: "Fundamental",
  },
  {
    name: "Beta",
    formula: "Covariance of stock with market ÷ Variance of the market",
    interpretation:
      "Measures stock’s volatility relative to the market. A Beta > 1 means the stock is more volatile than the market.",
    category: "Fundamental",
  },
  {
    name: "ROE (Return on Equity)",
    formula: "Net Income ÷ Shareholder's Equity",
    interpretation:
      "Indicates the profitability of a company in relation to its equity. Higher ROE → better performance.",
    category: "Fundamental",
  },
  // Combined / Calculated Metrics
  {
    name: "RiskAdjustedReturn",
    formula: "1M_Return_% ÷ Volatility_%",
    interpretation:
      "Measures return per unit of risk. Higher → better return for the level of risk. Useful to compare stocks with different volatilities.",
    category: "Calculated",
  },
  {
    name: "MomentumValueRatio",
    formula: "Momentum_5d_% ÷ PE_Ratio",
    interpretation:
      "Captures short-term price movement relative to valuation. Higher → momentum is strong and valuation is reasonable.",
    category: "Calculated",
  },
  {
    name: "LiquidityAdjustedMarketCap",
    formula: "MarketCap ÷ Avg_Volume",
    interpretation:
      "Shows relative size vs trading activity. Higher → stock is large but less traded relative to its size; lower → smaller but actively traded.",
    category: "Calculated",
  },
  // Additional Calculated Metrics
  {
    name: "EV/EBITDA_Adjusted",
    formula: "Enterprise Value ÷ Adjusted EBITDA",
    interpretation:
      "Refines the EV/EBITDA ratio by adjusting for non-recurring items. Can give a clearer view of a company’s operating performance.",
    category: "Calculated",
  },
  // Ranking Metrics
  {
    name: "Rank_1M_Return",
    formula: "Rank of stock based on 1-month return",
    interpretation: "Rank 1 → highest return among top gainers/losers.",
    category: "Ranking",
  },
  {
    name: "Rank_RiskAdjustedReturn",
    formula: "Rank of stock based on risk-adjusted return",
    interpretation: "Rank 1 → best return for given risk.",
    category: "Ranking",
  },
  {
    name: "Rank_Momentum5d",
    formula: "Rank based on 5-day momentum",
    interpretation: "Rank 1 → strongest short-term momentum.",
    category: "Ranking",
  },
  {
    name: "Rank_LiquidityAdjustedMC",
    formula: "Rank based on liquidity-adjusted market cap",
    interpretation: "Rank 1 → most favorable combination of size vs liquidity.",
    category: "Ranking",
  },
  {
    name: "CompositeRank",
    formula: "Average of all 4 ranks",
    interpretation: "Rank 1 → overall strongest stock considering returns, risk, momentum, and liquidity.",
    category: "Ranking",
  },
];

// Function to seed Metric data
const seedMetricData = async () => {
  try {
    await connectDB(); // Make sure the database is connected

    // Insert the metric data into the collection
    await Metric.insertMany(metricData);
    console.log("✅ Metric definitions seeded successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Metric seeding failed:", error.message);
    process.exit(1);
  }
};

// Run the seeding function
seedMetricData();
