import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const StockMarketNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // UI filter inputs
  const [sentiment, setSentiment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Applied filters (used for API calls)
  const [appliedFilters, setAppliedFilters] = useState({
    sentiment: '',
    startDate: '',
    endDate: '',
  });

  // Fetch news data
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/news', {
        params: {
          page,
          limit,
          sentiment: appliedFilters.sentiment,
          startDate: appliedFilters.startDate,
          endDate: appliedFilters.endDate,
        },
      });
      setNews(res.data.data.docs || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch only when page or applied filters change
  useEffect(() => {
    fetchNews();
  }, [page, appliedFilters]);

  // Apply filters button
  const applyFilters = () => {
    setPage(1);
    setAppliedFilters({
      sentiment,
      startDate,
      endDate,
    });
  };

  // Clear filters button
  const clearFilters = () => {
    setSentiment('');
    setStartDate('');
    setEndDate('');
    setPage(1);
    setAppliedFilters({
      sentiment: '',
      startDate: '',
      endDate: '',
    });
  };

  // Pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Stock Market News
      </Typography>

      {/* Filters */}
      <Box
        sx={{
          marginBottom: '20px',
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Sentiment</InputLabel>
          <Select
            value={sentiment}
            label="Sentiment"
            onChange={(e) => setSentiment(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Positive">Positive</MenuItem>
            <MenuItem value="Neutral">Neutral</MenuItem>
            <MenuItem value="Negative">Negative</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <Button variant="contained" color="primary" onClick={applyFilters}>
          Apply Filters
        </Button>

        <Button variant="outlined" color="secondary" onClick={clearFilters}>
          Clear
        </Button>
      </Box>

      {/* News List */}
      {loading ? (
        <Typography variant="h6" align="center">
          Loading...
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {news.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article._id}>
              <Card
                sx={{
                  backgroundColor:
                    article.sentiment === 'Positive'
                      ? '#c8e6c9'
                      : article.sentiment === 'Negative'
                      ? '#ffcdd2'
                      : '#f0f0f0',
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {article.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginTop: '10px' }}
                  >
                    {article.description.length > 100
                      ? article.description.substring(0, 100) + '...'
                      : article.description}
                  </Typography>

                  <Button
                    component={Link}
                    to={`/news/${article._id}`}
                    variant="outlined"
                    color="primary"
                    sx={{ marginTop: '15px' }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          count={10} // Replace with backend totalPages when available
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default StockMarketNews;
