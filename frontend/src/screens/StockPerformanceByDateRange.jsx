import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const StockPerformanceByDateRange = () => {
  const [stockPerformances, setStockPerformances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const theme = useTheme();
  const navigate = useNavigate();

  const fetchStockPerformances = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("/api/stock/stock-performances/date-range", {
        params: { startDate, endDate },
      });
      setStockPerformances(response.data);
    } catch (error) {
      console.error("Error fetching stock performances", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Box sx={{ padding: 2 }}>
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
      <Typography variant="h5" sx={{ marginBottom: 2 }} color="text.primary">
        Stock Performances by Date Range
      </Typography>

      {/* Date Pickers */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newDate) => setEndDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>

      {/* Fetch Button */}
      <Box sx={{ marginBottom: 3 }}>
        <Button variant="contained" color="primary" onClick={fetchStockPerformances}>
          Fetch Stock Performances
        </Button>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {/* Stock Cards */}
      {!loading && (
        <Grid container spacing={3}>
          {stockPerformances.length > 0 ? (
            stockPerformances.map((stock) => (
              <Grid item xs={12} sm={6} md={4} key={stock._id}>
                <Card
                  sx={{
                    backgroundColor:
                      stock.gainerOrLoser === "Gainer"
                        ? theme.palette.success.light
                        : theme.palette.error.light,
                    boxShadow: 3,
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardContent>
                    {/* Stock Header */}
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      {stock.stockName} ({stock.stockSymbol})
                    </Typography>

                    {/* Date */}
                    {stock.date && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Date:</strong>{" "}
                        {new Date(stock.date).toLocaleDateString()}
                      </Typography>
                    )}

                    {/* Recommendation */}
                    {stock.recommendation && (
                      <Chip
                        label={stock.recommendation}
                        color={
                          stock.recommendation.toLowerCase().includes("buy")
                            ? "success"
                            : stock.recommendation.toLowerCase().includes("hold")
                            ? "warning"
                            : stock.recommendation.toLowerCase().includes("sell")
                            ? "error"
                            : "default"
                        }
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                          mt: 1,
                          mb: 1,
                        }}
                      />
                    )}

                    {/* Performance Metrics */}
                    <Typography variant="body2" color="text.secondary">
                      <strong>Performance:</strong> {stock.gainerOrLoser}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Yesterday's Close:</strong> ₹
                      {stock.closePriceYesterday?.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Change:</strong> {stock.percentChangeYesterday?.toFixed(2)}%
                    </Typography>

                    {/* Positive / Negative Indicator */}
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 1,
                        color:
                          stock.percentChangeYesterday > 0
                            ? theme.palette.success.dark
                            : theme.palette.error.dark,
                        fontWeight: "bold",
                      }}
                    >
                      {stock.percentChangeYesterday > 0 ? "Positive" : "Negative"}
                    </Typography>

                    {/* View Details Button */}
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/stock-performance/${stock._id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ marginTop: 3 }}
            >
              No stock performances found for the selected date range.
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default StockPerformanceByDateRange;
