const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const indexRouter = require("./routes/indexRouter");
const blogRoute = require("./routes/blogRoute");
const ownerRoute =require("./routes/ownerRoute");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();

// --- Database Connection (No changes needed) ---
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// --- THE CORS FIX ---
const cors = require('cors');

// Define the origins that are allowed to access your backend
const allowedOrigins = [
    'https://curiofy.onrender.com',
    'http://localhost:5173',
    'http://192.168.1.8:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires']
};

// This is the most important part for preflight requests.
// It tells Express to handle OPTIONS requests globally and apply CORS.
app.options('*', cors(corsOptions));

// Now, use the CORS middleware for all other requests.
app.use(cors(corsOptions));


// --- Standard Middleware (No changes needed) ---
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- API Routes (No changes needed) ---
app.use("/", indexRouter);
app.use("/blogs", blogRoute);
app.use("/owner", ownerRoute);


// --- SPA Fallback and Static Serving (No changes needed) ---
// This part is likely not being used in your Render setup, but it's fine to keep.
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


// --- Server Start (No changes needed) ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});