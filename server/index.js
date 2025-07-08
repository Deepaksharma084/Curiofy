const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const indexRouter = require("./routes/indexRouter");
const blogRoute = require("./routes/blogRoute");
const ownerRoute = require("./routes/ownerRoute");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const cors = require('cors');
app.use(cors({
    origin: [
        'https://curiofy.onrender.com',
        'http://localhost:5173',
        'http://192.168.1.8:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Soooo this is the main cache control. It must be placed BEFORE the API routes
const setNoCacheHeaders = (req, res, next) => {
    // This is the most important header. 'private' tells CDNs not to cache.
    // 'no-store' is for browsers. 'max-age=0' ensures re-validation.
    res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0');
    
    // This is a specific header for Cloudflare (which Render uses) to not cache.
    res.setHeader('CDN-Cache-Control', 'no-cache');

    // For older HTTP/1.0 proxies
    res.setHeader('Pragma', 'no-cache');
    
    // For older clients
    res.setHeader('Expires', '0');
    
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