import mongoose from "mongoose";

// Schema to store metric definitions, their categories, formulas, and interpretations
const MetricSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name of the metric (e.g., "RiskAdjustedReturn")
    },
    formula: {
      type: String,
      required: true, // Formula used for the metric calculation (e.g., "1M_Return_% ÷ Volatility_%")
    },
    interpretation: {
      type: String,
      required: true, // Explanation of the metric (e.g., "Measures return per unit of risk...")
    },
    category: {
      type: String,
      required: true, // Category of the metric (e.g., "Trading", "Fundamental", "Calculated")
    },
  },
  { timestamps: true }
);

// Create the model for metrics
const Metric = mongoose.model("Metric", MetricSchema);

export default Metric;
