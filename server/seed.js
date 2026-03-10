import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import Gallery from "./models/Gallery.js";
import Message from "./models/Message.js";
import Schedule from "./models/Schedule.js";

const products = [
  { nameEs:"Pan de barra", nameEn:"Baguette", category:"Panadería / Bakery", price:"€0.80", desc_es:"Pan artesanal recién horneado cada mañana.", desc_en:"Artisan bread freshly baked every morning.", icon:"🥖", visible:true, order:1 },
  { nameEs:"Pizza congelada", nameEn:"Frozen pizza", category:"Congelados / Frozen", price:"€3.50", desc_es:"Variedad de sabores: margarita, cuatro quesos, barbacoa.", desc_en:"Variety of flavours: margherita, four cheese, BBQ.", icon:"🍕", visible:true, order:2 },
  { nameEs:"Patatas fritas", nameEn:"Crisps / Chips", category:"Snacks", price:"€1.20", desc_es:"Bolsa grande, perfecta para compartir.", desc_en:"Large bag, perfect for sharing.", icon:"🥔", visible:true, order:3 },
  { nameEs:"Cerveza (6 uds.)", nameEn:"Beer (6 pack)", category:"Bebidas / Drinks", price:"€4.90", desc_es:"Pack de seis latas bien frías.", desc_en:"Six-pack of cold cans.", icon:"🍺", visible:true, order:4 },
  { nameEs:"Lejía multiusos", nameEn:"Multipurpose bleach", category:"Limpieza / Cleaning", price:"€1.50", desc_es:"Limpieza profunda y desinfección del hogar.", desc_en:"Deep cleaning and home disinfection.", icon:"🧴", visible:true, order:5 },
  { nameEs:"Vino tinto", nameEn:"Red wine", category:"Bebidas / Drinks", price:"€5.50", desc_es:"Botella de vino de la tierra, suave y afrutado.", desc_en:"Local bottle, smooth and fruity.", icon:"🍷", visible:true, order:6 },
  { nameEs:"Leche entera", nameEn:"Whole milk", category:"Lácteos / Dairy", price:"€1.10", desc_es:"Leche fresca de vaca, 1 litro.", desc_en:"Fresh cow's milk, 1 litre.", icon:"🥛", visible:true, order:7 },
  { nameEs:"Jabón de platos", nameEn:"Washing-up liquid", category:"Limpieza / Cleaning", price:"€2.00", desc_es:"Fórmula concentrada, corta la grasa fácilmente.", desc_en:"Concentrated formula, cuts grease easily.", icon:"🫧", visible:true, order:8 },
];

const gallery = [
  { url:"https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&q=80", caption_es:"Interior de la tienda", caption_en:"Shop interior", visible:true, order:1 },
  { url:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80", caption_es:"Sección de frescos", caption_en:"Fresh produce section", visible:true, order:2 },
  { url:"https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&q=80", caption_es:"Panadería", caption_en:"Bakery", visible:true, order:3 },
  { url:"https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80", caption_es:"Bebidas y refrescos", caption_en:"Drinks & soft drinks", visible:true, order:4 },
  { url:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80", caption_es:"Productos de limpieza", caption_en:"Cleaning products", visible:true, order:5 },
  { url:"https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80", caption_es:"Nuestra fachada", caption_en:"Our storefront", visible:true, order:6 },
];

const messages = [
  { name:"María García", email:"maria@ejemplo.com", subject:"Encargo", message:"Hola, ¿tenéis pan de centeno? Me gustaría pedirlo con antelación.", read:false, hidden:false },
  { name:"Carlos López", email:"carlos@ejemplo.com", subject:"Horario", message:"¿A qué hora cerráis los domingos? No lo encuentro en la web.", read:true, hidden:false },
];

const schedule = [
  { day:"lunes",     open:true,  desde:"08:00", hasta:"21:00" },
  { day:"martes",    open:true,  desde:"08:00", hasta:"21:00" },
  { day:"miércoles", open:true,  desde:"08:00", hasta:"21:00" },
  { day:"jueves",    open:true,  desde:"08:00", hasta:"21:00" },
  { day:"viernes",   open:true,  desde:"08:00", hasta:"22:00" },
  { day:"sábado",    open:true,  desde:"09:00", hasta:"21:00" },
  { day:"domingo",   open:true,  desde:"09:00", hasta:"15:00" },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await Promise.all([
    Product.deleteMany({}),
    Gallery.deleteMany({}),
    Message.deleteMany({}),
    Schedule.deleteMany({}),
  ]);
  console.log("Cleared existing data");

  // Insert seed data
  await Promise.all([
    Product.insertMany(products),
    Gallery.insertMany(gallery),
    Message.insertMany(messages),
    Schedule.insertMany(schedule),
  ]);

  console.log("✅ Seed complete!");
  console.log(`   ${products.length} products`);
  console.log(`   ${gallery.length} gallery images`);
  console.log(`   ${messages.length} messages`);
  console.log(`   ${schedule.length} schedule entries`);

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
