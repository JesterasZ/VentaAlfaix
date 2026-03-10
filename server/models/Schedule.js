import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  day:   { type: String, required: true, unique: true },
  open:  { type: Boolean, default: true },
  desde: { type: String, default: "08:00" },
  hasta: { type: String, default: "21:00" },
}, { timestamps: true });

export default mongoose.model("Schedule", scheduleSchema);
