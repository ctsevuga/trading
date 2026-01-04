import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Box, IconButton, Paper } from '@mui/material';
import { AccessTime, Link as LinkIcon, Article } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const RecentNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Fetch recent news
  useEffect(() => {
    const fetchRecentNews = async () => {
      try {
        const response = await axios.get('/api/stock/stock-performances/recent-news');
        setNews(response.data);
      } catch (err) {
        setError('Error fetching recent news.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentNews();
  }, []);

  // Loading or error states
  if (loading) {
    return <Typography variant="h5" color="text.secondary">Loading recent news...</Typography>;
  }

  if (error) {
    return <Typography variant="h5" color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" color="text.primary" gutterBottom>
        Recent News
      </Typography>

      {news.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          No recent news available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {news.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <CardContent>
                  <Typography variant="h6" color="text.primary">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                      {item.headline}
                    </a>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                    <Article sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                    Source: {item.source}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                    <AccessTime sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                    Published on: {new Date(item.publishedAt).toLocaleDateString()}
                  </Typography>

                  {/* Additional actions like a link icon */}
                  <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton color="primary" href={item.url} target="_blank" aria-label="open news link">
                      <LinkIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default RecentNews;
