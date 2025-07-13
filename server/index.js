import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import blogRoute from "./routes/blogRoute.js";
import ownerRoute from "./routes/ownerRoute.js";
import aiRoute from "./routes/aiRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// A simple CORS setup is still good for local development.
app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API ROUTES ---
app.use("/blogs", blogRoute);
app.use("/owner", ownerRoute);
app.use('/ai', aiRoute);

// --- STATIC FILE SERVING ---
// This tells Express where your built React app is.
app.use(express.static(path.join(__dirname, '../../client/dist')));

// --- SPA FALLBACK ---
// This catch-all route sends all non-API requests to your React app's entry point.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});