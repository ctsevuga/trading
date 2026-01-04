import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Box, IconButton } from '@mui/material';
import { TrendingUp, TrendingDown, NavigateNext } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for routing

const StockPerformanceList = () => {
  const [stockPerformances, setStockPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize navigate for routing

  // Fetch stock performances from the backend
  useEffect(() => {
    const fetchStockPerformances = async () => {
      try {
        const response = await axios.get('/api/stock/stock-performances');
        setStockPerformances(response.data);
      } catch (error) {
        console.error('Error fetching stock performances', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockPerformances();
  }, []);

  // Handle navigation to the detailed stock page
  const handleNavigateToDetails = (stockSymbol) => {
    navigate(`/stock-details/${stockSymbol}`);  // Navigate to the stock details page
  };

  return (
    <Box sx={{ padding: 2 }}>
      {loading ? (
        <Typography variant="h5" color="text.secondary">
          Loading stock performances...
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {stockPerformances.map((stock) => (
            <Grid
              item
              xs={12} // Full width on mobile
              sm={6}  // Half width on tablets
              md={4}  // One-third width on desktop
              key={stock._id}
            >
              <Card
                sx={{
                  backgroundColor: stock.gainerOrLoser === 'Gainer' ? theme.palette.success.light : theme.palette.error.light,
                  boxShadow: 3,
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" component="div" color="text.primary">
                      {stock.stockName} ({stock.stockSymbol})
                    </Typography>
                    <IconButton color="primary" aria-label="info">
                      <NavigateNext onClick={() => handleNavigateToDetails(stock.stockSymbol)} />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Performance:</strong> {stock.gainerOrLoser}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Yesterday's Price:</strong> ₹{stock.closePriceYesterday?.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Change:</strong> {stock.percentChangeYesterday?.toFixed(2)}%
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                    {stock.percentChangeYesterday > 0 ? (
                      <TrendingUp sx={{ color: theme.palette.success.main, marginRight: 1 }} />
                    ) : (
                      <TrendingDown sx={{ color: theme.palette.error.main, marginRight: 1 }} />
                    )}
                    <Typography
                      variant="h6"
                      color={stock.percentChangeYesterday > 0 ? theme.palette.success.dark : theme.palette.error.dark}
                    >
                      {stock.percentChangeYesterday > 0 ? 'Positive' : 'Negative'}
                    </Typography>
                  </Box>

                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>One Month Return:</strong> {stock.oneMonthReturnPercent?.toFixed(2)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>PE Ratio:</strong> {stock.peRatio?.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Dividend Yield:</strong> {stock.dividendYield?.toFixed(2)}%
                    </Typography>
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

export default StockPerformanceList;
