import mongoose from "mongoose";

const StockPerformanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    stockSymbol: {
      type: String,
      required: true,
      index: true,
    },
    stockName: {
      type: String,
      required: true,
    },
    gainerOrLoser: {
      type: String,
      enum: ["Gainer", "Loser"],
      required: true,
    },
    rankInGainerLoser: Number,

    // Price Data
    openPriceYesterday: Number,
    closePriceYesterday: Number,
    percentChangeYesterday: Number,

    // Historical Metrics
    oneMonthReturnPercent: Number,
    volatilityPercent: Number,
    momentum5dPercent: Number,
    averageVolume: Number,

    // Fundamentals
    peRatio: Number,
    pbRatio: Number,
    dividendYield: Number,
    marketCap: Number,

    // Calculated Measures
    riskAdjustedReturn: Number,
    momentumValueRatio: Number,
    liquidityAdjustedMarketCap: Number,
    rank1MReturn: Number,
    rankRiskAdjustedReturn: Number,
    rankMomentum5d: Number,
    rankLiquidityAdjustedMC: Number,
    compositeRank: Number,

    // Analyst Interpretation
    interpretation: String,
    recommendation: String,
    analystCommentary: String,

    // Recent News
    recentNews: [
      {
        headline: String,
        url: String,
        source: String,
        publishedAt: Date,
      },
    ],

    // Outlook & Factors to Watch
    outlookFactors: [String],
  },
  { timestamps: true }
);

const StockPerformance = mongoose.model("StockPerformance", StockPerformanceSchema);
export default StockPerformance;
