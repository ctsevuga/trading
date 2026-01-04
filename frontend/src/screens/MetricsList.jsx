import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Info as InfoIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MetricsList = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch metrics data from the API
  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/api/metrics');
      setMetrics(response.data.data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (metrics.length === 0) {
    return (
      <Box sx={{ padding: '20px' }}>
        <Typography variant="h5" color="error" align="center">
          No metrics available!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Back Button */}
      <Button
        component={Link}
        to="/"
        variant="outlined"
        sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}
        startIcon={<ArrowBackIcon />}
      >
        Back to Home
      </Button>

      {/* Title */}
      <Typography variant="h4" align="center" gutterBottom>
        Metrics List
      </Typography>

      {/* Metrics List */}
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric._id}>
            <Card sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent>
                <Typography variant="h6" component="div" color="primary">
                  {metric.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Category: </strong>{metric.category}
                </Typography>
                <Divider sx={{ margin: '10px 0' }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>Formula: </strong>{metric.formula}
                </Typography>
                <Divider sx={{ margin: '10px 0' }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>Interpretation: </strong>{metric.interpretation}
                </Typography>
              </CardContent>

              {/* Info Button */}
              <Box sx={{ padding: '10px' }}>
                <IconButton
                  color="primary"
                  component={Link}
                  to={`/metric-detail/${metric._id}`}
                  size="large"
                  sx={{
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    '&:hover': { backgroundColor: 'rgba(0, 123, 255, 0.4)' },
                  }}
                >
                  <InfoIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricsList;
