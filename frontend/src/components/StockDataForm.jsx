import React, { useState } from 'react';
import axios from 'axios';
import '../styles/StockDataForm.css';

const StockDataForm = () => {
  const [symbol, setSymbol] = useState('');
  const [date, setDate] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error messages
    setStockData(null); // Clear previous stock data

    try {
      setLoading(true);
      const formattedDate = formatDate(date); // Format date before sending to the API
      const response = await axios.post('http://localhost:8000/api/fetchStockData', {
        stockSymbol: symbol,
        date: formattedDate,
      });
      setStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error.message);
      setErrorMessage(`Error fetching stock data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Get yesterday's date in the format YYYY-MM-DD.
  // Polygon API will only allow past dates excluding today, so this should be handled in the date picker.
  const today = new Date();
  today.setDate(today.getDate() - 1);
  const yesterday = today.toISOString().split('T')[0];

  return (
    <div className="container">
      <h1 className="heading">Stock Data Fetcher</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="symbol">Stock Symbol:</label>
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())} // Convert user input to uppercase
            placeholder="Enter stock symbol (e.g., AAPL)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            max={yesterday} // Set the max attribute to yesterday's date. This will disable today and future dates
          />
        </div>
        <button type="submit" disabled={!symbol || !date || loading}>
          {loading ? 'Loading...' : 'Fetch Stock Data'}
        </button>
      </form>
      {stockData && (
        <div className="result-container">
          <h2>Stock Data:</h2>
          <table>
            <tbody>
              <tr>
                <td>Open:</td>
                <td className={stockData.open > stockData.close ? 'positive' : 'negative'}>
                  {stockData.open}
                </td>
              </tr>
              <tr>
                <td>High:</td>
                <td className={stockData.high > stockData.close ? 'positive' : 'negative'}>
                  {stockData.high}
                </td>
              </tr>
              <tr>
                <td>Low:</td>
                <td className={stockData.low > stockData.close ? 'positive' : 'negative'}>
                  {stockData.low}
                </td>
              </tr>
              <tr>
                <td>Close:</td>
                <td>{stockData.close}</td>
              </tr>
              <tr>
                <td>Volume:</td>
                <td>{stockData.volume}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockDataForm;
