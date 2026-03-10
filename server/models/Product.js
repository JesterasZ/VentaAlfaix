import mongoose from "mongoose";

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

export default mongoose.model("Product", productSchema);
