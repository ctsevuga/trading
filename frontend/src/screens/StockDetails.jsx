import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Box,
  CircularProgress,
  Grid,
  Paper
} from '@mui/material';
import { AccountBalance, ArrowUpward, ArrowDownward, Timeline } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const StockDetails = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [stockDetails, setStockDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Fetch the unique stock symbols and names
  useEffect(() => {
    const fetchUniqueStocks = async () => {
      try {
        const response = await axios.get('/api/stock/unique-stocks');
        setStocks(response.data);
      } catch (err) {
        setError('Failed to fetch stock symbols.');
      }
    };
    fetchUniqueStocks();
  }, []);

  // Fetch stock details by symbol
  const fetchStockDetails = async (symbol) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/stock/stock-performance/symbol/${symbol}`);
      setStockDetails(response.data);
    } catch (err) {
      setError('Failed to fetch stock performance data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle stock selection
  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
    fetchStockDetails(event.target.value);
  };

  // Loading, error, and no data states
  if (loading) {
    return <CircularProgress color="primary" />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" color="text.primary" gutterBottom>
        Stock Performance Details
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <InputLabel id="stock-select-label">Select a Stock</InputLabel>
        <Select
          labelId="stock-select-label"
          value={selectedStock}
          onChange={handleStockChange}
          label="Select a Stock"
        >
          {stocks.map((stock, index) => (
            <MenuItem key={index} value={stock.stockSymbol}>
              {stock.stockName} ({stock.stockSymbol})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {stockDetails && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
              <CardContent>
                <Typography variant="h6" color="text.primary">
                  {stockDetails.stockName} ({stockDetails.stockSymbol})
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                  <AccountBalance sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                  {stockDetails.gainerOrLoser} | Rank: {stockDetails.rankInGainerLoser}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                  <Timeline sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                  1M Return: {stockDetails.oneMonthReturnPercent}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                  {stockDetails.percentChangeYesterday > 0 ? (
                    <ArrowUpward sx={{ verticalAlign: 'middle', marginRight: 1, color: 'green' }} />
                  ) : (
                    <ArrowDownward sx={{ verticalAlign: 'middle', marginRight: 1, color: 'red' }} />
                  )}
                  Yesterday's Change: {stockDetails.percentChangeYesterday}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper sx={{ padding: 2, boxShadow: 3 }}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Stock Fundamentals
              </Typography>
              <Typography variant="body2" color="text.secondary">
                P/E Ratio: {stockDetails.peRatio}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Market Cap: {stockDetails.marketCap}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dividend Yield: {stockDetails.dividendYield}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PB Ratio: {stockDetails.pbRatio}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StockDetails;
