import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  Typography, 
  FormControl, 
  Select, 
  InputLabel, 
  MenuItem, 
  Grid, 
  CircularProgress, 
  Box, 
  IconButton, 
  useTheme 
} from '@mui/material';
import { ArrowUpward, ArrowDownward, NavigateNext } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StockGainerLoserDetails = () => {
  const [selection, setSelection] = useState('Gainer');
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  // Fetch stock performances based on Gainer or Loser selection
  const fetchStockPerformances = async (gainerOrLoser) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/stock/stock-performances/gainer-loser/${gainerOrLoser}`);
      setStocks(response.data);
    } catch (err) {
      setError(`Error fetching ${gainerOrLoser}s.`);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchStockPerformances whenever the selection changes
  useEffect(() => {
    fetchStockPerformances(selection);
  }, [selection]);

  // Handle dropdown selection change
  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
  };

  // Navigate to detailed component using stock _id
  const handleNavigate = (id) => {
    navigate(`/stock-performance/${id}`);
  };

  // Group stocks by date
  const groupByDate = (stocksList) => {
    return stocksList.reduce((acc, stock) => {
      const dateKey = stock.date ? new Date(stock.date).toLocaleDateString() : 'Unknown Date';
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(stock);
      return acc;
    }, {});
  };

  if (loading) {
    return <Box sx={{ textAlign: 'center', mt: 6 }}><CircularProgress color="primary" /></Box>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  // Group the stocks by date
  const stocksGroupedByDate = groupByDate(stocks);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" color="text.primary" gutterBottom>
        Stock Performances: {selection}s
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <InputLabel id="gainer-loser-select-label">Select Gainer or Loser</InputLabel>
        <Select
          labelId="gainer-loser-select-label"
          value={selection}
          onChange={handleSelectionChange}
          label="Select Gainer or Loser"
        >
          <MenuItem value="Gainer">Gainer</MenuItem>
          <MenuItem value="Loser">Loser</MenuItem>
        </Select>
      </FormControl>

      {Object.keys(stocksGroupedByDate).length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          No {selection}s found.
        </Typography>
      ) : (
        Object.keys(stocksGroupedByDate).map((date) => (
          <Box key={date} sx={{ marginBottom: 4 }}>
            {/* Date Heading */}
            <Typography variant="h6" color="text.primary" sx={{ marginBottom: 2 }}>
              Date: {date}
            </Typography>

            <Grid container spacing={3}>
              {stocksGroupedByDate[date].map((stock, index) => (
                <Grid item xs={12} sm={6} md={4} key={stock._id}>
                  <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                    <CardContent>
                      <Typography variant="h6" color="text.primary">
                        {stock.stockName} ({stock.stockSymbol})
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                        {stock.gainerOrLoser === 'Gainer' ? (
                          <ArrowUpward sx={{ verticalAlign: 'middle', marginRight: 1, color: 'green' }} />
                        ) : (
                          <ArrowDownward sx={{ verticalAlign: 'middle', marginRight: 1, color: 'red' }} />
                        )}
                        {stock.gainerOrLoser} | Rank: {stock.rankInGainerLoser}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                        Open Price: {stock.openPriceYesterday} | Close Price: {stock.closePriceYesterday}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                        Volume: {stock.averageVolume}
                      </Typography>
                      
                      <IconButton 
                        onClick={() => handleNavigate(stock._id)} 
                        sx={{ marginTop: 2, color: theme.palette.primary.main }}
                      >
                        <NavigateNext />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}
    </Box>
  );
};

export default StockGainerLoserDetails;
