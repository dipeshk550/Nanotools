const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const { protect, requirePro } = require("../middleware/auth");
const { success, error } = require("../utils/response");
const limiter = require("../middleware/rateLimiter");

router.post("/", protect, requirePro, limiter.upload, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return error(res, "No file uploaded");

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `nanotools/${req.user._id}`,
      resource_type: "auto",
      use_filename: true,
    });

    success(res, {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      width: result.width,
      height: result.height,
    }, "File uploaded");
  } catch (err) { next(err); }
});

router.delete("/:publicId", protect, async (req, res, next) => {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);
    success(res, {}, "File deleted");
  } catch (err) { next(err); }
});

module.exports = router;
