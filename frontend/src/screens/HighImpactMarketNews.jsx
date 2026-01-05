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
  WarningAmber,
  TrendingUp,
  TrendingDown,
  Public,
  Bolt,
} from "@mui/icons-material";
import { format } from "date-fns";

const sentimentIcon = {
  POSITIVE: <TrendingUp sx={{ color: "#16a34a" }} />,
  NEGATIVE: <TrendingDown sx={{ color: "#dc2626" }} />,
  NEUTRAL: <Bolt sx={{ color: "#f59e0b" }} />,
};

const HighImpactMarketNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHighImpactNews = async () => {
    try {
      const { data } = await axios.get(
        "/api/market-news/high-impact"
      );
      setNews(data.data);
    } catch (error) {
      console.error("Failed to fetch high impact news", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighImpactNews();
  }, []);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Header */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        mb={1}
      >
        <WarningAmber sx={{ color: "#dc2626" }} />
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "#7f1d1d" }}
        >
          High Impact Market News
        </Typography>
      </Stack>

      <Typography color="text.secondary" mb={3}>
        Market-moving events that can significantly impact prices
      </Typography>

      {/* Loader */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress color="error" />
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
                    "linear-gradient(180deg, #fff5f5, #ffffff)",
                  border: "1px solid #fecaca",
                  boxShadow:
                    "0 10px 25px rgba(220,38,38,0.15)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow:
                      "0 16px 40px rgba(220,38,38,0.25)",
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

                  {/* Meta */}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                    mb={1.5}
                  >
                    <Chip
                      label={item.market}
                      color="primary"
                      size="small"
                      icon={<Public />}
                    />
                    <Chip
                      label="HIGH IMPACT"
                      color="error"
                      size="small"
                      icon={<Bolt />}
                    />
                    {sentimentIcon[item.sentiment]}
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
                      {format(
                        new Date(item.tradingDate),
                        "dd MMM yyyy"
                      )}
                    </Typography>

                    <a
                      href={item.source.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#b91c1c",
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
            No high-impact market news available at the moment.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default HighImpactMarketNews;
