import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Stack,
  CircularProgress,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import {
  CalendarMonth,
  TrendingUp,
  TrendingDown,
  Public,
  ShowChart,
} from "@mui/icons-material";
import { format } from "date-fns";

const impactColors = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "success",
};

const sentimentIcon = {
  POSITIVE: <TrendingUp color="success" />,
  NEGATIVE: <TrendingDown color="error" />,
  NEUTRAL: <ShowChart color="action" />,
};

const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const { data } = await axios.get("/api/market-news", { params });
      setNews(data.data);
    } catch (error) {
      console.error("Failed to load market news", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={1}
        sx={{ color: "#1e3a8a" }}
      >
        📊 Market Moving News
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Stay updated with the most impactful market news
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 4, p: 2, borderRadius: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            type="date"
            label="Start Date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
          />
          <TextField
            type="date"
            label="End Date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            size="large"
            onClick={fetchNews}
            sx={{
              minWidth: 160,
              background:
                "linear-gradient(135deg, #2563eb, #1e40af)",
            }}
          >
            Apply Filter
          </Button>
        </Stack>
      </Card>

      {/* Loader */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {/* News Cards */}
      {!loading && (
        <Grid container spacing={3}>
          {news.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item._id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent>
                  {/* Title */}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {item.title}
                  </Typography>

                  {/* Meta */}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mb={1}
                    flexWrap="wrap"
                  >
                    <Chip
                      label={item.market}
                      color="primary"
                      size="small"
                      icon={<Public />}
                    />
                    <Chip
                      label={`${item.impactLevel} Impact`}
                      color={impactColors[item.impactLevel]}
                      size="small"
                    />
                    {sentimentIcon[item.sentiment]}
                  </Stack>

                  {/* Summary */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                  >
                    {item.summary}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  {/* Footer */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1}>
                      <CalendarMonth fontSize="small" />
                      <Typography variant="caption">
                        {format(
                          new Date(item.tradingDate),
                          "dd MMM yyyy"
                        )}
                      </Typography>
                    </Stack>

                    <a
                      href={item.source.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 12,
                        color: "#2563eb",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      {item.source.name}
                    </a>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && news.length === 0 && (
        <Typography
          align="center"
          color="text.secondary"
          mt={4}
        >
          No market news found for the selected date range.
        </Typography>
      )}
    </Box>
  );
};

export default MarketNews;
