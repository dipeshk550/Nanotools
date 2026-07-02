const path = require("path");
const multer = require("multer");
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require("docx");

// Keep PDF in memory — no disk writes needed
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are supported"), false);
  },
});

// Extract text from PDF buffer using pdfjs-dist
async function extractTextFromPDF(buffer) {
  const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
  const standardFontDataUrl = path.join(
    __dirname,
    "../node_modules/pdfjs-dist/standard_fonts/"
  );

  const data = new Uint8Array(buffer);
  const pdf = await pdfjsLib.getDocument({ data, standardFontDataUrl }).promise;
  const numPages = pdf.numPages;

  const pages = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Group items into lines by their Y position
    const lines = {};
    for (const item of content.items) {
      if (!item.str) continue;
      const y = Math.round(item.transform[5]);
      if (!lines[y]) lines[y] = [];
      lines[y].push(item.str);
    }
    // Sort lines by Y (descending — PDF coords go bottom-up)
    const sortedYs = Object.keys(lines)
      .map(Number)
      .sort((a, b) => b - a);
    const pageText = sortedYs.map((y) => lines[y].join(" ").trim()).join("\n");
    pages.push(pageText);
  }

  return { text: pages.join("\n\n"), numPages };
}

// Convert extracted text to a styled docx Document
function buildDocx(text, filename) {
  const rawParagraphs = text.split(/\n\s*\n/).filter((p) => p.trim());

  const children = [];

  // Add a title from the filename
  children.push(
    new Paragraph({
      text: filename.replace(/\.pdf$/i, ""),
      heading: HeadingLevel.TITLE,
      spacing: { after: 300 },
    })
  );

  for (const para of rawParagraphs) {
    const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    // Heuristic: short single line in ALL-CAPS or ends without punctuation → treat as heading
    const firstLine = lines[0];
    const isHeading =
      lines.length === 1 &&
      firstLine.length < 80 &&
      (firstLine === firstLine.toUpperCase() || !/[.,:;]$/.test(firstLine));

    if (isHeading) {
      children.push(
        new Paragraph({
          text: firstLine,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 120 },
        })
      );
    } else {
      const fullText = lines.join(" ");
      children.push(
        new Paragraph({
          children: [new TextRun({ text: fullText, size: 24 })],
          spacing: { after: 160 },
        })
      );
    }
  }

  return new Document({
    creator: "NanoTools AI",
    title: filename.replace(/\.pdf$/i, ""),
    sections: [{ children }],
  });
}

// POST /api/pdf/to-word
exports.pdfToWord = [
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No PDF file uploaded" });
      }

      const { text, numPages } = await extractTextFromPDF(req.file.buffer);

      if (!text.trim()) {
        return res.status(422).json({
          success: false,
          message: "Could not extract text from this PDF. It may be scanned or image-only.",
        });
      }

      const originalName = req.file.originalname || "document.pdf";
      const doc = buildDocx(text, originalName);
      const buffer = await Packer.toBuffer(doc);

      const outputName = originalName.replace(/\.pdf$/i, "") + ".docx";
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename="${outputName}"`);
      res.setHeader("Content-Length", buffer.length);
      res.setHeader("X-Pages-Converted", numPages);
      res.send(buffer);
    } catch (err) {
      console.error("PDF-to-Word error:", err.message);
      res.status(500).json({
        success: false,
        message: "Conversion failed: " + err.message,
      });
    }
  },
];
