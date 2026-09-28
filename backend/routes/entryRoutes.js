import express from "express";
import Entry from "../models/Entry.js";

const router = express.Router();

// GET all entries (newest first)
router.get("/", async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new entry
router.post("/", async (req, res) => {
  const { text, mood, tags } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Text content is required" });
  }

  try {
    const newEntry = new Entry({ text, mood, tags });
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an entry by ID
router.delete("/:id", async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;