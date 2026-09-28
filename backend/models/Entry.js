import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    mood: { type: String, default: "" },
    tags: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Entry", entrySchema);