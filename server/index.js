const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const indexRouter = require("./routes/indexRouter");
const blogRoute = require("./routes/blogRoute");
const ownerRoute = require("./routes/ownerRoute");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
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

// API routes should be first
app.use("/", indexRouter);
app.use("/blogs", blogRoute);
app.use("/owner", ownerRoute);

// Static files and SPA fallback should be after API routes
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});