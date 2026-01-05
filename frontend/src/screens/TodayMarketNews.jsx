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
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  Public,
  Whatshot,
  CalendarToday,
} from "@mui/icons-material";
import { format } from "date-fns";

const impactColorMap = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "success",
};

const sentimentIconMap = {
  POSITIVE: <TrendingUp sx={{ color: "#16a34a" }} />,
  NEGATIVE: <TrendingDown sx={{ color: "#dc2626" }} />,
  NEUTRAL: <ShowChart sx={{ color: "#64748b" }} />,
};

const TodayMarketNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayNews = async () => {
    try {
      const { data } = await axios.get("/api/market-news/today");
      setNews(data.data);
    } catch (error) {
      console.error("Error fetching today's market news", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayNews();
  }, []);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        mb={1}
      >
        <Whatshot sx={{ color: "#f97316" }} />
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "#0f172a" }}
        >
          Today’s Market News
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" mb={3}>
        <CalendarToday fontSize="small" />
        <Typography color="text.secondary">
          {format(new Date(), "dd MMMM yyyy")}
        </Typography>
      </Stack>

      {/* Loader */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      )}

      {/* News Cards */}
      {!loading && news.length > 0 && (
        <Grid container spacing={3}>
          {news.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item._id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  background:
                    "linear-gradient(180deg, #ffffff, #f8fafc)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow:
                      "0 16px 40px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent>
                  {/* Title */}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={1}
                  >
                    {item.title}
                  </Typography>

                  {/* Meta Chips */}
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    alignItems="center"
                    mb={1.5}
                  >
                    <Chip
                      label={item.market}
                      size="small"
                      color="primary"
                      icon={<Public />}
                    />
                    <Chip
                      label={`${item.impactLevel} Impact`}
                      size="small"
                      color={impactColorMap[item.impactLevel]}
                    />
                    {sentimentIconMap[item.sentiment]}
                  </Stack>

                  {/* Summary */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                    sx={{ lineHeight: 1.6 }}
                  >
                    {item.summary}
                  </Typography>

                  <Divider sx={{ mb: 1.5 }} />

                  {/* Footer */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Published:{" "}
                      {format(
                        new Date(item.publishedAt),
                        "hh:mm a"
                      )}
                    </Typography>

                    <a
                      href={item.source.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#2563eb",
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

      {/* Empty State */}
      {!loading && news.length === 0 && (
        <Box mt={6} textAlign="center">
          <Typography color="text.secondary">
            No market-moving news available for today.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TodayMarketNews;
