import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";

import CategoryIcon from "@mui/icons-material/Category";
import FunctionsIcon from "@mui/icons-material/Functions";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InsightsIcon from "@mui/icons-material/Insights";

const categoryColorMap = {
  Trading: "primary",
  Fundamental: "success",
  Calculated: "secondary",
};

const MetricsByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/metrics/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch metrics by category
  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      const res = await axios.get(`/api/metrics/category/${category}`);
      setMetrics(res.data.data);
    } catch (err) {
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <InsightsIcon color="primary" fontSize="large" />
        <Typography variant="h4" fontWeight="bold">
          Metrics Explorer
        </Typography>
      </Stack>

      {/* Category Dropdown */}
      <FormControl fullWidth sx={{ maxWidth: 400, mb: 4 }}>
        <InputLabel>
          <CategoryIcon sx={{ mr: 1 }} />
          Select Category
        </InputLabel>
        <Select
          value={selectedCategory}
          label="Select Category"
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Metrics Grid */}
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric._id}>
            <Card
              elevation={4}
              sx={{
                height: "100%",
                borderRadius: 4,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {metric.name}
                  </Typography>

                  <Chip
                    size="small"
                    color={categoryColorMap[metric.category] || "default"}
                    label={metric.category}
                    sx={{ width: "fit-content" }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "#f4f6ff",
                      p: 1.5,
                      borderRadius: 2,
                      fontFamily: "monospace",
                    }}
                  >
                    <FunctionsIcon fontSize="small" sx={{ mr: 1 }} />
                    {metric.formula}
                  </Typography>

                  {/* Navigate to Detail */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/metrics/${metric._id}`)}
                    >
                      <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {!loading && selectedCategory && metrics.length === 0 && (
        <Typography align="center" sx={{ mt: 4 }} color="text.secondary">
          No metrics available for this category
        </Typography>
      )}
    </Box>
  );
};

export default MetricsByCategory;
