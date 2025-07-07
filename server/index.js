const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const indexRouter = require("./routes/indexRouter");
const blogRoute = require("./routes/blogRoute");
const ownerRoute = require("./routes/ownerRoute");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();

// --- CHANGE 1: Reverted the mongoose connection to its standard form ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected")) // Log message is now standard
    .catch(err => console.error(err));

const cors = require('cors');
app.use(cors({
    origin: [
        'https://curiofy.onrender.com',
        'http://localhost:5173',
        'http://192.168.1.8:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Soooo this is the main cache control. It must be placed BEFORE the API routes
app.use('/blogs', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});
app.use('/owner', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

// API routes are defined after the middleware i.e cache control
app.use("/", indexRouter);
app.use("/blogs", blogRoute);
app.use("/owner", ownerRoute);

//Aurrr-- Static files and SPA fallback should be after API routes
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});