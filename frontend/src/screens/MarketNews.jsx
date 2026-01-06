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
  MenuItem,
} from "@mui/material";
import {
  CalendarMonth,
  TrendingUp,
  TrendingDown,
  Public,
  ShowChart,
  AccessTime,
} from "@mui/icons-material";
import { format } from "date-fns";

/* ----------------------------------
   UI Mappings
----------------------------------- */
const impactColors = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "success",
};

const sessionColors = {
  PRE_MARKET: "info",
  MARKET_HOURS: "primary",
  POST_MARKET: "secondary",
};

const sentimentIcon = {
  POSITIVE: <TrendingUp color="success" fontSize="small" />,
  NEGATIVE: <TrendingDown color="error" fontSize="small" />,
  NEUTRAL: <ShowChart color="action" fontSize="small" />,
};

const MarketNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Filters */
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [newsSession, setNewsSession] = useState("");
  const [impactLevel, setImpactLevel] = useState("");
  const [sentiment, setSentiment] = useState("");

  /* ----------------------------------
     Fetch News
  ----------------------------------- */
  const fetchNews = async () => {
    try {
      setLoading(true);

      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (newsSession) params.newsSession = newsSession;
      if (impactLevel) params.impactLevel = impactLevel;
      if (sentiment) params.sentiment = sentiment;

      const { data } = await axios.get("/api/market-news", { params });
      setNews(data.data || []);
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
      <Typography variant="h4" fontWeight="bold" mb={1} color="#1e3a8a">
        📊 Market Moving News
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Pre-market outlook, live market alerts & post-market wrap
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 4, p: 2, borderRadius: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
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

          <TextField
            select
            label="Session"
            size="small"
            value={newsSession}
            onChange={(e) => setNewsSession(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PRE_MARKET">Pre-Market</MenuItem>
            <MenuItem value="MARKET_HOURS">Market Hours</MenuItem>
            <MenuItem value="POST_MARKET">Post-Market</MenuItem>
          </TextField>

          <TextField
            select
            label="Impact"
            size="small"
            value={impactLevel}
            onChange={(e) => setImpactLevel(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
          </TextField>

          <TextField
            select
            label="Sentiment"
            size="small"
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="POSITIVE">Positive</MenuItem>
            <MenuItem value="NEGATIVE">Negative</MenuItem>
            <MenuItem value="NEUTRAL">Neutral</MenuItem>
          </TextField>

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
            Apply
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
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>

                  {/* Meta Chips */}
                  <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                    <Chip
                      label={item.market}
                      size="small"
                      color="primary"
                      icon={<Public />}
                    />

                    {item.newsSession && (
                      <Chip
                        label={item.newsSession.replace("_", " ")}
                        size="small"
                        color={sessionColors[item.newsSession] || "default"}
                        icon={<AccessTime />}
                      />
                    )}

                    <Chip
                      label={`${item.impactLevel} Impact`}
                      size="small"
                      color={impactColors[item.impactLevel]}
                    />

                    {sentimentIcon[item.sentiment]}
                  </Stack>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {item.summary}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1}>
                      <CalendarMonth fontSize="small" />
                      <Typography variant="caption">
                        {format(new Date(item.tradingDate), "dd MMM yyyy")}
                      </Typography>
                    </Stack>

                    <a
                      href={item.source?.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 12,
                        color: "#2563eb",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      {item.source?.name}
                    </a>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && news.length === 0 && (
        <Typography align="center" color="text.secondary" mt={4}>
          No market news found for the selected filters.
        </Typography>
      )}
    </Box>
  );
};

export default MarketNews;
