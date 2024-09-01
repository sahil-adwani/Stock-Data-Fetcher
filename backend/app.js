require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:5174'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.enable('trust proxy');

app.post("/api/fetchStockData", async (req, res) => {
    const { stockSymbol, date } = req.body;
    const POLYGON_API_KEY = "G7THPqlzSRV_MvHPsELplLiT1iCQ7kc0"; //should come as environment variable in practice
    if (!stockSymbol || !date) {
        return res
            .status(400)
            .json({ error: "Both stock symbol and date are required." });
    }
    try {
        const formattedDate = new Date(date).toISOString().slice(0, 10);
        const endpoint = `https://api.polygon.io/v1/open-close/${stockSymbol}/${formattedDate}?apiKey=${POLYGON_API_KEY}`;
        const response = await axios.get(endpoint);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching stock data:", error.message);
        res
            .status(500)
            .json({ error: "An error occurred while fetching stock data." });
    }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}`));