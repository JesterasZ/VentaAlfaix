import mongoose from "mongoose";

let cached = null;

export async function connectDB() {
  if (cached) return cached;
  cached = await mongoose.connect(process.env.MONGODB_URI);
  return cached;
}

// --- Models ---

const productSchema = new mongoose.Schema({
  nameEs:   { type: String, required: true },
  nameEn:   { type: String, default: "" },
  category: { type: String, required: true },
  price:    { type: String, required: true },
  desc_es:  { type: String, default: "" },
  desc_en:  { type: String, default: "" },
  icon:     { type: String, default: "📦" },
  visible:  { type: Boolean, default: true },
  order:    { type: Number, default: 0 },
}, { timestamps: true });

const gallerySchema = new mongoose.Schema({
  url:        { type: String, required: true },
  caption_es: { type: String, default: "Sin título" },
  caption_en: { type: String, default: "No caption" },
  visible:    { type: Boolean, default: true },
  order:      { type: Number, default: 0 },
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  phone:   { type: String, default: "" },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  read:    { type: Boolean, default: false },
  hidden:  { type: Boolean, default: false },
}, { timestamps: true });

const scheduleSchema = new mongoose.Schema({
  day:   { type: String, required: true, unique: true },
  open:  { type: Boolean, default: true },
  desde: { type: String, default: "08:00" },
  hasta: { type: String, default: "21:00" },
}, { timestamps: true });

export const Product  = mongoose.models.Product  || mongoose.model("Product", productSchema);
export const Gallery  = mongoose.models.Gallery  || mongoose.model("Gallery", gallerySchema);
export const Message  = mongoose.models.Message  || mongoose.model("Message", messageSchema);
export const Schedule = mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);
