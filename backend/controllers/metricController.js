import Metric from "../models/MetricModel.js"; // Adjust the path if necessary

// Controller to get all metrics
export const getAllMetrics = async (req, res) => {
  try {
    const metrics = await Metric.find(); // Get all metrics from the database
    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching metrics.",
    });
  }
};

// Controller to get metrics by category
export const getMetricsByCategory = async (req, res) => {
  try {
    const category = req.params.category; // Get category from URL parameters
    const metrics = await Metric.find({ category }); // Find metrics by category

    if (!metrics.length) {
      return res.status(404).json({
        success: false,
        message: `No metrics found for category: ${category}`,
      });
    }

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Error fetching metrics by category:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching metrics by category.",
    });
  }
};

// Controller to get a metric by ID
export const getMetricById = async (req, res) => {
  try {
    const metricId = req.params.id; // Get metric ID from URL parameters
    const metric = await Metric.findById(metricId); // Find metric by ID

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: "Metric not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: metric,
    });
  } catch (error) {
    console.error("Error fetching metric by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching metric by ID.",
    });
  }
};

export const getMetricCategories = async (req, res) => {
  try {
    const categories = await Metric.distinct("category");

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching metric categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching metric categories.",
    });
  }
};
