import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FunctionsIcon from "@mui/icons-material/Functions";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CategoryIcon from "@mui/icons-material/Category";
import InsightsIcon from "@mui/icons-material/Insights";

const categoryColors = {
  Trading: "primary",
  Fundamental: "success",
  Calculated: "secondary",
};

const MetricDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [metric, setMetric] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetric = async () => {
      try {
        const res = await axios.get(`/api/metrics/${id}`);
        setMetric(res.data.data);
      } catch (error) {
        console.error("Failed to load metric:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetric();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (!metric) {
    return (
      <Typography align="center" color="error">
        Metric not found
      </Typography>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
      {/* Back Navigation */}
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      <Card
        elevation={4}
        sx={{
          borderRadius: 4,
          background: "linear-gradient(135deg, #f5f7fa, #ffffff)",
        }}
      >
        <CardContent>
          {/* Header */}
          <Stack spacing={1} mb={2}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <InsightsIcon color="primary" />
              {metric.name}
            </Typography>

            <Chip
              icon={<CategoryIcon />}
              label={metric.category}
              color={categoryColors[metric.category] || "default"}
              sx={{ width: "fit-content" }}
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Formula */}
          <Box mb={3}>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <FunctionsIcon color="secondary" />
              Formula
            </Typography>

            <Typography
              sx={{
                mt: 1,
                p: 2,
                backgroundColor: "#f0f4ff",
                borderRadius: 2,
                fontFamily: "monospace",
                wordBreak: "break-word",
              }}
            >
              {metric.formula}
            </Typography>
          </Box>

          {/* Interpretation */}
          <Box>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <PsychologyIcon color="success" />
              Interpretation
            </Typography>

            <Typography
              sx={{
                mt: 1,
                p: 2,
                backgroundColor: "#f6fff5",
                borderRadius: 2,
                lineHeight: 1.6,
              }}
            >
              {metric.interpretation}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MetricDetail;
