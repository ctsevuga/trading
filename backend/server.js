import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// Import existing routes
import stockPerformanceRoute from "./routes/stockPerformanceRoute.js";


// Import new routes for Metric and StockMarketNews
import metricRoutes from "./routes/metricRoutes.js";
import stockMarketNewsRoutes from "./routes/stockMarketNewsRoutes.js";

// Error handling middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Required for ES Modules to use __dirname
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ----------------- API ROUTES -----------------
app.use("/api/stock", stockPerformanceRoute);


// Add the new routes for Metric and StockMarketNews
app.use("/api/metrics", metricRoutes);  // Route for metrics
app.use("/api/news", stockMarketNewsRoutes);  // Route for stock market news

// ----------------- FRONTEND PRODUCTION BUILD -----------------
if (process.env.NODE_ENV === "production") {
  // Serve static files from frontend build
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  // Serve React index.html for any route not starting with /api
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });

} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

// ----------------- ERROR HANDLERS -----------------
app.use(notFound);
app.use(errorHandler);

// ----------------- START SERVER -----------------
app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
