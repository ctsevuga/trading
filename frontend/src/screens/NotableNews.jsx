import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Share as ShareIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotableNews = () => {
  const [notableNews, setNotableNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notable news from the backend
  const fetchNotableNews = async () => {
    try {
      const response = await axios.get('/api/market/market-summaries/notable-news');
      setNotableNews(response.data);
    } catch (error) {
      console.error('Error fetching notable news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotableNews();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (notableNews.length === 0) {
    return (
      <Box sx={{ padding: '20px' }}>
        <Typography variant="h5" color="error" align="center">
          No notable news available!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Back Button */}
      <Button
        component={Link}
        to="/market"
        variant="outlined"
        sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}
        startIcon={<ArrowBackIcon />}
      >
        Back to Market Summaries
      </Button>

      {/* Title */}
      <Typography variant="h4" align="center" gutterBottom>
        Notable News
      </Typography>

      {/* List of Notable News */}
      {notableNews.map((news, index) => (
        <Card key={index} sx={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h6" color="text.primary">
              <a href={news.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                {news.headline}
              </a>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Source: {news.source} - {new Date(news.publishedAt).toLocaleDateString()}
            </Typography>
            <Divider sx={{ margin: '10px 0' }} />
            <Button
              component="a"
              href={news.url}
              target="_blank"
              variant="outlined"
              startIcon={<ShareIcon />}
              sx={{ textTransform: 'none' }}
            >
              Share
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default NotableNews;
