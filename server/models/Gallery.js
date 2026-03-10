import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  url:        { type: String, required: true },
  caption_es: { type: String, default: "Sin título" },
  caption_en: { type: String, default: "No caption" },
  visible:    { type: Boolean, default: true },
  featured:   { type: Boolean, default: false },
  order:      { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Gallery", gallerySchema);
