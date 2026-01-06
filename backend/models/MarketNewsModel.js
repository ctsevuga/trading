import mongoose from "mongoose";

const MarketNewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    summary: {
      type: String,
      required: true
    },

    source: {
      name: { type: String, required: true },   // Reuters, ET, Mint, etc.
      url: { type: String, required: true }
    },

    market: {
      type: String,
      enum: ["NIFTY", "SENSEX", "GLOBAL", "COMMODITY"],
      required: true
    },

    sectors: [
      {
        type: String, // IT, Banking, FMCG, Metals, Energy
      }
    ],

    stocksMentioned: [
      {
        type: String // RELIANCE, TCS, HDFCBANK
      }
    ],

    impactLevel: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM"
    },

    sentiment: {
      type: String,
      enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"],
      default: "NEUTRAL"
    },

    publishedAt: {
      type: Date,
      required: true
    },

    tradingDate: {
      type: Date,
      required: true,
      index: true // 🔥 fast daily queries
    },
    newsSession: {
  type: String,
  enum: ["PRE_MARKET", "MARKET_HOURS", "POST_MARKET"],
  required: true,
  index: true,
},


    tags: [
      {
        type: String // FII, Inflation, Oil, Fed, Earnings
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  
  {
    timestamps: true // createdAt, updatedAt
  }
);

export default mongoose.model("MarketNews", MarketNewsSchema);