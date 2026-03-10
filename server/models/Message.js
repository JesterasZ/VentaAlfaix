import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  phone:   { type: String, default: "" },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  read:    { type: Boolean, default: false },
  hidden:  { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
