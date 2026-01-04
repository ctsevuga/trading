import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { useNavigate } from "react-router-dom";

/* ---------------- Recommendation Helpers ---------------- */

const getRecommendationMeta = (recommendation = "") => {
  const rec = recommendation.toLowerCase();

  if (rec.includes("strong buy")) {
    return {
      label: "🔥 Strong Buy",
      color: "success",
      border: "2px solid #2e7d32",
    };
  }
  if (rec.includes("buy")) {
    return {
      label: "👍 Buy",
      color: "success",
      border: "2px solid #66bb6a",
    };
  }
  if (rec.includes("hold")) {
    return {
      label: "⚖️ Hold",
      color: "warning",
      border: "2px solid #ed6c02",
    };
  }
  if (rec.includes("sell") || rec.includes("reduce")) {
    return {
      label: "⚠️ Sell",
      color: "error",
      border: "2px solid #d32f2f",
    };
  }

  return {
    label: recommendation || "N/A",
    color: "default",
    border: "1px solid #ccc",
  };
};

/* ---------------- Component ---------------- */

const YesterdayStockPerformance = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/stock/yesterday");

        const mappedStocks = (res.data.data || []).map((s) => ({
          _id: s._id,
          stockSymbol: s.Stock || s.stockSymbol || "N/A",
          stockName: s.stockName || s.Stock || "N/A",
          percentChangeYesterday:
            s["%Change_Yesterday"] ?? s.percentChangeYesterday ?? null,
          compositeRank: s.CompositeRank ?? s.compositeRank ?? null,
          interpretation: s.Interpretation ?? s.interpretation ?? null,
          recommendation: s.Recommendation ?? s.recommendation ?? null,
          analystCommentary:
            s.analystCommentary ?? s.AnalystCommentary ?? null,
          gainerOrLoser:
            s.Gainer_or_Loser ?? s.gainerOrLoser ?? "Unknown",
        }));

        setStocks(mappedStocks);
      } catch (error) {
        console.error("Failed to fetch stock performance", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: "#f4f6fa", minHeight: "100vh" }}>
      {/* Header */}
      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
        📊 Gainer & Looser of Nifty50
      </Typography>
      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
        📊 Yesterday’s Stock Performance
      </Typography>

      {/* Disclaimer Box - Always Shown */}
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          mb: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeeba",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          <strong>Disclaimer:</strong> The recommendations shown here are based on our
          analytical models and insights. They are not investment advice. You should
          make your own decisions after carefully analyzing the information and
          consulting additional reliable sources or a financial professional.
        </Typography>
      </Box>

      {/* Navigation Buttons Box - Always Shown */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          startIcon={<ShowChartIcon />}
          color="primary"
          onClick={() => navigate("/stock-news")}
        >
          Stock Market News
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          startIcon={<ShowChartIcon />}
          color="primary"
          onClick={() => navigate("/StockPerformanceList")}
        >
          Stock Performance Date Range
        </Button>
      </Box>

      {/* Loading Spinner */}
      {loading && (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* No Data Message */}
      {!loading && stocks.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="h6">No stock data available for yesterday.</Typography>
        </Box>
      )}

      {/* Stock Cards Grid */}
      {!loading && stocks.length > 0 && (
        <Grid container spacing={3}>
          {stocks.map((stock) => {
            const isGainer = stock.gainerOrLoser === "Gainer";
            const recMeta = getRecommendationMeta(stock.recommendation);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={stock._id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: 4,
                    border: recMeta.border,
                    background: isGainer ? "#e6f4ea" : "#fdecea",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardContent>
                    {/* Header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {stock.stockSymbol}
                      </Typography>
                      {isGainer ? (
                        <TrendingUpIcon color="success" />
                      ) : (
                        <TrendingDownIcon color="error" />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {stock.stockName}
                    </Typography>

                    {/* Gainer / Loser */}
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={stock.gainerOrLoser}
                        color={isGainer ? "success" : "error"}
                        size="small"
                      />
                    </Box>

                    {/* Price Change */}
                    <Typography sx={{ mt: 1 }}>
                      % Change:{" "}
                      <strong>
                        {stock.percentChangeYesterday !== null
                          ? stock.percentChangeYesterday.toFixed(2) + "%"
                          : "N/A"}
                      </strong>
                    </Typography>

                    <Typography variant="body2">
                      Composite Rank: {stock.compositeRank ?? "N/A"}
                    </Typography>

                    {/* Recommendation Badge */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <Chip
                        label={recMeta.label}
                        color={recMeta.color}
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                        }}
                      />

                      {/* Analyst Commentary Tooltip */}
                      {stock.analystCommentary && (
                        <Tooltip title={stock.analystCommentary} arrow placement="top">
                          <IconButton size="small">
                            <PsychologyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    {/* Interpretation */}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {stock.interpretation ?? "No interpretation available"}
                    </Typography>

                    {/* View Details */}
                    <Button
                      fullWidth
                      sx={{ mt: 2 }}
                      endIcon={<ArrowForwardIosIcon />}
                      onClick={() => navigate(`/stock-performance/${stock._id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default YesterdayStockPerformance;
