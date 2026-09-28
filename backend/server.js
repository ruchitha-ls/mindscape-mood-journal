import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import entryRoutes from "./routes/entryRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/entries", entryRoutes);

// Database Connection & Server Startup
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB Connection Error:", err.message));