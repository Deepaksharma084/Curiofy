const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const indexRouter = require("./routes/indexRouter");
const blogRoute = require("./routes/blogRoute");
const ownerRoute = require("./routes/ownerRoute");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();

// --- START: NEW AND IMPROVED MONGOOSE CONNECTION LOGIC ---

// Define connection options to make it more robust for cloud/serverless environments
const mongooseOptions = {
    serverSelectionTimeoutMS: 60000, // Increase timeout to 60s
    socketTimeoutMS: 45000, // Increase socket timeout to 45s
    keepAlive: true, // This is crucial to prevent idle timeouts
    keepAliveInitialDelay: 300000, // Send first keep-alive probe after 5 mins
    useNewUrlParser: true, // Although deprecated, it's good practice to keep
    useUnifiedTopology: true // Modern topology engine
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, mongooseOptions)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Add connection event listeners for better debugging
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    // You could attempt to reconnect here, but Mongoose's new engine handles it well.
    // The keepAlive option is the primary fix.
});
db.on('reconnected', () => {
    console.log('MongoDB reconnected!');
});
db.on('close', () => {
    console.log('MongoDB connection closed.');
});

// --- END: NEW AND IMPROVED MONGOOSE CONNECTION LOGIC ---

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
const setNoCacheHeaders = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache'); // for HTTP 1.0 proxies
  res.setHeader('Expires', '0'); // for older clients
  res.setHeader('Surrogate-Control', 'no-store'); // for CDNs
  next();
};

app.use('/blogs', setNoCacheHeaders);
app.use('/owner', setNoCacheHeaders);

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