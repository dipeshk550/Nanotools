require("dotenv").config();
const mongoose = require("mongoose");
const Tool = require("../models/Tool");
const User = require("../models/User");

const TOOLS = [
  { name:"AI Content Writer", slug:"ai-content-writer", description:"Generate blogs, emails, product descriptions with AI", category:"AI", icon:"ti-pencil", color:"#7F77DD", badge:"ai", isAI:true, featured:true, tags:["writing","content","blog","email"] },
  { name:"AI Summarizer", slug:"ai-summarizer", description:"Summarize any text or document instantly", category:"AI", icon:"ti-notes", color:"#7F77DD", badge:"ai", isAI:true },
  { name:"AI Grammar Checker", slug:"ai-grammar-checker", description:"Fix grammar and improve writing quality", category:"AI", icon:"ti-text-grammar", color:"#7F77DD", badge:"ai", isAI:true },
  { name:"AI Code Generator", slug:"ai-code-generator", description:"Generate code from plain language descriptions", category:"AI", icon:"ti-code", color:"#7F77DD", badge:"ai", isAI:true },
  { name:"AI Translator", slug:"ai-translator", description:"Translate text to 50+ languages accurately", category:"AI", icon:"ti-language", color:"#7F77DD", badge:"ai", isAI:true },
  { name:"AI Resume Builder", slug:"ai-resume-builder", description:"Build ATS-friendly professional resumes", category:"AI", icon:"ti-file-text", color:"#7F77DD", badge:"ai", isAI:true },
  { name:"PDF Compressor", slug:"pdf-compressor", description:"Reduce PDF file size without quality loss", category:"PDF", icon:"ti-file-zip", color:"#E24B4A", featured:true },
  { name:"Merge PDF", slug:"merge-pdf", description:"Combine multiple PDFs into one file", category:"PDF", icon:"ti-files", color:"#E24B4A" },
  { name:"PDF to Word", slug:"pdf-to-word", description:"Convert PDF to editable Word document", category:"PDF", badge:"hot", icon:"ti-file-type-doc", color:"#E24B4A", featured:true },
  { name:"Image Compressor", slug:"image-compressor", description:"Compress images up to 90% without visible loss", category:"Image", icon:"ti-photo", color:"#1D9E75", featured:true },
  { name:"Background Remover", slug:"background-remover", description:"Remove image backgrounds instantly with AI", category:"Image", badge:"ai", isAI:true, icon:"ti-cut", color:"#1D9E75" },
  { name:"Image Resizer", slug:"image-resizer", description:"Resize images to exact pixel dimensions", category:"Image", icon:"ti-resize", color:"#1D9E75" },
  { name:"JSON Formatter", slug:"json-formatter", description:"Format and validate JSON code instantly", category:"Developer", icon:"ti-braces", color:"#534AB7", featured:true },
  { name:"Base64 Encoder", slug:"base64-encoder", description:"Encode and decode Base64 strings", category:"Developer", icon:"ti-binary", color:"#534AB7" },
  { name:"JWT Decoder", slug:"jwt-decoder", description:"Decode and inspect JWT tokens", category:"Developer", icon:"ti-key", color:"#534AB7" },
  { name:"UUID Generator", slug:"uuid-generator", description:"Generate RFC-compliant unique identifiers", category:"Developer", icon:"ti-fingerprint", color:"#534AB7" },
  { name:"Password Generator", slug:"password-generator", description:"Generate strong, secure passwords instantly", category:"Security", icon:"ti-lock", color:"#993556", featured:true },
  { name:"Hash Generator", slug:"hash-generator", description:"Generate MD5, SHA1, SHA256 hashes", category:"Security", icon:"ti-hash", color:"#993556" },
  { name:"Word Counter", slug:"word-counter", description:"Count words, characters, and sentences", category:"Writing", icon:"ti-abc", color:"#639922" },
  { name:"Case Converter", slug:"case-converter", description:"Convert text case instantly", category:"Writing", icon:"ti-text-size", color:"#639922" },
  { name:"EMI Calculator", slug:"emi-calculator", description:"Calculate loan EMI and total interest", category:"Finance", icon:"ti-calculator", color:"#0F6E56" },
  { name:"Currency Converter", slug:"currency-converter", description:"Live currency exchange rates", category:"Finance", badge:"new", icon:"ti-currency-exchange", color:"#0F6E56" },
  { name:"QR Generator", slug:"qr-generator", description:"Generate QR codes for any URL or text", category:"Developer", badge:"new", icon:"ti-qrcode", color:"#534AB7" },
  { name:"Keyword Generator", slug:"keyword-generator", description:"Find high-value keywords for your niche", category:"SEO", badge:"ai", isAI:true, icon:"ti-tag", color:"#378ADD" },
  { name:"Meta Tag Generator", slug:"meta-tag-generator", description:"Generate perfect HTML meta tags", category:"SEO", icon:"ti-code", color:"#378ADD" },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nanotools");
  console.log("Connected to MongoDB");
  await Tool.deleteMany({});
  await Tool.insertMany(TOOLS);
  console.log(`Seeded ${TOOLS.length} tools`);
  const existing = await User.findOne({ email: "admin@nanotools.ai" });
  if (!existing) {
    await User.create({ name:"Admin", email:"admin@nanotools.ai", password:"Admin@123456", role:"admin", isVerified:true, plan:"team" });
    console.log("Admin user created: admin@nanotools.ai / Admin@123456");
  }
  await mongoose.disconnect();
  console.log("Seed complete!");
}

seed().catch(console.error);
