import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";

// ---------- Small Metric Card ----------
const MetricCard = ({ label, value, suffix = "" }) => (
  <Paper sx={{ p: 2, height: "100%" }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h6">
      {value !== null && value !== undefined ? `${value}${suffix}` : "N/A"}
    </Typography>
  </Paper>
);

const StockPerformanceDetail = () => {
  const { id } = useParams();
  const theme = useTheme();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/stock/stock-performance/${id}`);
        setData(res.data);
      } catch {
        setError("Failed to load stock performance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const isGainer = data.gainerOrLoser === "Gainer";

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: "#f4f6fa" }}>
      {/* ===== Header ===== */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {data.stockName} ({data.stockSymbol})
        </Typography>

        {data.date && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            Date: {new Date(data.date).toLocaleDateString()}
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Chip label={data.gainerOrLoser} color={isGainer ? "success" : "error"} />
          <Typography
            fontWeight="bold"
            color={isGainer ? theme.palette.success.main : theme.palette.error.main}
          >
            {data.percentChangeYesterday?.toFixed(2)}%
          </Typography>
          {isGainer ? <TrendingUp /> : <TrendingDown />}
        </Box>
      </Box>

      {/* ===== Price Metrics ===== */}
      <Typography variant="h6" mb={1}>📊 Price Metrics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <MetricCard label="Open (Yesterday)" value={data.openPriceYesterday?.toFixed(2)} />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Close (Yesterday)" value={data.closePriceYesterday?.toFixed(2)} />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="% Change (Yesterday)" value={data.percentChangeYesterday?.toFixed(2)} suffix="%" />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Average Volume" value={data.averageVolume?.toLocaleString()} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* ===== Historical Metrics ===== */}
      <Typography variant="h6" mb={1}>📈 Historical Metrics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <MetricCard label="1M Return" value={data.oneMonthReturnPercent?.toFixed(2)} suffix="%" />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Volatility" value={data.volatilityPercent?.toFixed(2)} suffix="%" />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="5D Momentum" value={data.momentum5dPercent?.toFixed(2)} suffix="%" />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Risk-Adjusted Return" value={data.riskAdjustedReturn?.toFixed(2)} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* ===== Fundamentals ===== */}
      <Typography variant="h6" mb={1}>🏦 Fundamentals</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <MetricCard label="P/E Ratio" value={data.peRatio?.toFixed(2)} />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="P/B Ratio" value={data.pbRatio?.toFixed(2)} />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Dividend Yield" value={data.dividendYield?.toFixed(2)} suffix="%" />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Market Cap" value={data.marketCap?.toLocaleString()} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* ===== Rankings ===== */}
      <Typography variant="h6" mb={1}>🏆 Ranking Metrics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <MetricCard label="Rank (1M Return)" value={data.rank1MReturn} />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Rank (Risk Adj.)" value={data.rankRiskAdjustedReturn} />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Rank (Momentum)" value={data.rankMomentum5d} />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Rank (Liquidity Adj. MC)" value={data.rankLiquidityAdjustedMC} />
        </Grid>
        <Grid item xs={6} md={3}>
          <MetricCard label="Composite Rank" value={data.compositeRank} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* ===== Analyst View ===== */}
      <Typography variant="h6" mb={1}>🧠 Analyst View</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography><strong>Recommendation:</strong> {data.recommendation || "N/A"}</Typography>
        <Typography sx={{ mt: 1 }}><strong>Interpretation:</strong> {data.interpretation || "N/A"}</Typography>
        {data.analystCommentary && (
          <Typography sx={{ mt: 1 }}><strong>Commentary:</strong> {data.analystCommentary}</Typography>
        )}
      </Paper>

      {/* ===== Recent News ===== */}
      {data.recentNews?.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" mb={1}>📰 Recent News</Typography>
          {data.recentNews.map((n, i) => (
            <Paper key={i} sx={{ p: 2, mb: 1 }}>
              <Typography fontWeight="bold">
                <a href={n.url} target="_blank" rel="noreferrer">{n.headline}</a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {n.source} · {new Date(n.publishedAt).toLocaleDateString()}
              </Typography>
            </Paper>
          ))}
        </>
      )}

      {/* ===== Outlook & Factors ===== */}
      {data.outlookFactors?.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" mb={1}>🔮 Outlook & Factors to Watch</Typography>
          <Paper sx={{ p: 2 }}>
            {data.outlookFactors.map((f, i) => (
              <Typography key={i}>• {f}</Typography>
            ))}
          </Paper>
        </>
      )}
    </Box>
  );
};

export default StockPerformanceDetail;
