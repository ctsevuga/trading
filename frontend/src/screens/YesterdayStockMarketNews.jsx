import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ArticleIcon from "@mui/icons-material/Article";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useNavigate } from "react-router-dom";

const YesterdayStockMarketNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("/api/news/yesterday");
        console.log(res)
        setNewsList(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch yesterday stock market news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (newsList.length === 0) {
    return (
      <Typography textAlign="center" mt={6}>
        No news available for yesterday.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: "#f5f7fb", minHeight: "100vh" }}>
      {/* Top Navigation Buttons */}
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
          onClick={() => navigate("/")}
        >
          Stock Performance
        </Button>

        
      </Box>

      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={3}
      >
        📰 Yesterday’s Stock Market News
      </Typography>

      {/* News Cards */}
      <Grid container spacing={3}>
        {newsList.map((news) => (
          <Grid item xs={12} sm={6} md={4} key={news._id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 8,
                },
                height: "100%",
              }}
            >
              <CardContent>
                {/* News Title */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  <NewspaperIcon sx={{ mr: 1 }} />
                  {news.title}
                </Typography>

                {/* News Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {news.description}
                </Typography>

                {/* Sentiment */}
                <Chip
                  label={news.sentiment}
                  color={
                    news.sentiment === "Positive"
                      ? "success"
                      : news.sentiment === "Negative"
                      ? "error"
                      : "warning"
                  }
                  size="small"
                  sx={{ mb: 1 }}
                />

                {/* Published Date */}
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Published At: {new Date(news.publishedAt).toLocaleString()}
                </Typography>

                {/* External Link */}
                <Button
                  size="small"
                  color="primary"
                  onClick={() => window.open(news.url, "_blank")}
                >
                  Read Full Article →
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default YesterdayStockMarketNews;
