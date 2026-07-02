const express = require("express");
const router = express.Router();
const { pdfToWord } = require("../controllers/pdfController");

// POST /api/pdf/to-word  — multipart/form-data, field name: "pdf"
router.post("/to-word", pdfToWord);

module.exports = router;
