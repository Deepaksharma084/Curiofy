// --- server/index.js (Cleaned up) ---
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const indexRouter = require("./routes/indexRouter");
const blogRoute = require("./routes/blogRoute");
const ownerRoute = require("./routes/ownerRoute");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();

// Correct Mongoose Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// We no longer need the complex CORS logic here,
// as render.yaml is handling it at the platform level.
const cors = require('cors');
app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/blogs", blogRoute);
app.use("/owner", ownerRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});