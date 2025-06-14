const express = require("express");
const mongoose = require("mongoose");
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
    origin: 'https://curiofy.onrender.com', // Added frontend production URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/blogs", blogRoute);
app.use("/owner", ownerRoute);

app.listen(3000, '0.0.0.0', () => {
    console.log("Server is running on port 3000");
});