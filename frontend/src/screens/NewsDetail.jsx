import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, Grid, Chip, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';

const NewsDetail = () => {
  const { id } = useParams();  // Retrieve the news ID from the URL
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch news details by ID
  const fetchNewsById = async () => {
    try {
      const response = await axios.get(`/api/news/${id}`);
      setNews(response.data.data);
    } catch (error) {
      console.error('Error fetching news details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsById();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!news) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" color="error" align="center">
          News not found!
        </Typography>
      </Box>
    );
  }

  // Define sentiment chip colors
  const sentimentColors = {
    Positive: '#388e3c',
    Neutral: '#1976d2',
    Negative: '#d32f2f',
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Back Button */}
      <Button component={Link} to="/" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ marginBottom: '20px' }}>
        Back to News List
      </Button>

      {/* News Title */}
      <Typography variant="h4" align="center" gutterBottom>
        {news.title}
      </Typography>

      {/* News Sentiment */}
      <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
        <Chip label={news.sentiment} color="primary" sx={{ backgroundColor: sentimentColors[news.sentiment], color: 'white' }} />
      </Box>

      {/* News Description */}
      <Card sx={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            {news.description}
          </Typography>
        </CardContent>
      </Card>

      {/* News URL */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          href={news.url}
          target="_blank"
          sx={{ marginTop: '10px' }}
        >
          Visit Source
        </Button>
      </Box>

      {/* Published Date */}
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="body2" color="textSecondary">
          Published on: {new Date(news.publishedAt).toLocaleDateString()}
        </Typography>
      </Box>

      {/* More information section */}
      <Box sx={{ marginTop: '40px' }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  More News?
                </Typography>
                <Button
                  component={Link}
                  to="/StockMarketNews"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ marginTop: '10px' }}
                >
                  Go to News List
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default NewsDetail;
